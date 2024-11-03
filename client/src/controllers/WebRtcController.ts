import {dispatch} from '../app/store';
import {Transports} from '../constants';
import {getWorkspace} from '../lib/WorkspaceHelper';
import {downgradeConnection, setConnection} from '../slices/workspaceSlice';
import WebsocketController from './WebsocketController';
import SimplePeer from 'simple-peer';

type UserConnectPayload = {
  userId: string;
};

type SignalPayload = {
  userId: string;
  signalData: SimplePeer.SignalData;
};

const ACTIONS = {
  SIGNAL: 'SIGNAL',
  PEER_JOINED: 'PEER_JOINED',
  USER_CONNECT: 'USER_CONNECT',
};

const textDecoder = new TextDecoder();

/**
 * This is in need of a refactor. The controller should not have a dependency on
 * the websocket controller, and rather be a wrapper for SimplePeer. This would
 * allow this controller to be generalized.
 */

export default class WebRtcController {
  private static instance?: WebRtcController;
  private websocketController: WebsocketController;
  private initiator = false;
  private peers = new Map<string, SimplePeer.Instance>();
  private activeUserIds = new Set<string>();
  private messageListeners = new Map<string, Function[]>();

  private constructor() {
    this.websocketController = WebsocketController.getInstance();
    // @ts-ignore
    this.websocketController.on(ACTIONS.SIGNAL, this.onSignalReceived.bind(this));
    // @ts-ignore
    this.websocketController.on(ACTIONS.USER_CONNECT, this.onPeerJoined.bind(this));
  }

  public static getInstance(): WebRtcController {
    if (!WebRtcController.instance) {
      WebRtcController.instance = new WebRtcController();
    }

    return WebRtcController.instance;
  }

  public send(message: Record<string, unknown>) {
    const workspace = getWorkspace();
    const userIds = Object.keys(workspace?.room?.users || {});

    const userIdsForWebsockets: string[] = [];

    userIds.forEach(userId => {
      // don't send message back to this client, only peers
      if (userId === workspace.connectionId) {
        return;
      }

      const peer = this.peers.get(userId);
      try {
        if (peer && this.activeUserIds.has(userId)) {
          peer.send(JSON.stringify(message));
        } else {
          throw new Error('Cannot send message to unconnected to peer');
        }
      } catch {
        // fall back to websocket
        userIdsForWebsockets.push(userId);
      }
    });

    // broadcast message to all peers that don't have an active webrtc connection
    if (userIdsForWebsockets.length) {
      const {action, payload} = message;
      // @ts-ignore
      WebsocketController.getInstance().send(action, {
        // @ts-ignore
        ...payload,
        targetUserIds: userIdsForWebsockets,
      });
    }
  }

  public on(action: string, callback: Function) {
    if (!this.messageListeners.get(action)) {
      this.messageListeners.set(action, []);
    }

    this.messageListeners.get(action)?.push(callback);
  }

  static destroy() {
    WebRtcController.instance?.peers.forEach(peer => peer.destroy());
    WebRtcController.instance = undefined;
  }

  private onSignalReceived(message: SignalPayload) {
    const {userId, signalData} = message;
    if (!this.initiator) {
      this.addPeer(userId);
    }

    this.peers.get(userId)?.signal(signalData);
  }

  private onPeerJoined(message: UserConnectPayload) {
    this.initiator = true;
    this.addPeer(message.userId);
  }

  private addPeer(userId: string) {
    const p = new SimplePeer({
      initiator: this.initiator,
      trickle: false,
    });

    p.on('connect', () => {
      this.activeUserIds.add(userId);
      dispatch(setConnection({
        userId,
        transport: Transports.WEBRTC,
      }));
    });

    p.on('signal', signalData => {
      this.websocketController.send(ACTIONS.SIGNAL, {
        userId,
        signalData,
      });
    });

    p.on('close', () => {
      console.log('Peer closed');
      this.peers.delete(userId);
      this.activeUserIds.delete(userId);
      dispatch(downgradeConnection({userId}));
    });

    p.on('data', data => {
      const text = textDecoder.decode(data);
      const message = JSON.parse(text);
      const callbacks = this.messageListeners.get(message.action);
      callbacks?.forEach(cb => cb({...message.payload, userId}));
    });

    this.peers.set(userId, p);
  }
}
