import WebRtcController from '../controllers/WebRtcController';

import type { Payload } from '../constants';
import WebsocketController from '../controllers/WebsocketController';

const KEY_ACTIONS = {
    KEY_DOWN: 'KEY_DOWN',
    KEY_UP: 'KEY_UP',
};

const PianoClient = {
    // TODO: Move subscriptions to RoomActionBridge
    onKeyDown(callback: (payload: Payload) => void) {
        WebRtcController.getInstance().on(KEY_ACTIONS.KEY_DOWN, callback);
        // @ts-ignore
        WebsocketController.getInstance().on(KEY_ACTIONS.KEY_DOWN, (message) => callback(message.payload));
    },

    // TODO: Move subscriptions to RoomActionBridge
    onKeyUp(callback: (payload: Payload) => void) {
        WebRtcController.getInstance().on(KEY_ACTIONS.KEY_UP, callback);
        // @ts-ignore
        WebsocketController.getInstance().on(KEY_ACTIONS.KEY_UP, (message) => callback(message.payload));
    },

    keyDown(midi: number, velocity: number) {
        WebRtcController.getInstance().send({
            action: KEY_ACTIONS.KEY_DOWN,
            payload: { midi, velocity }
        });
    },

    keyUp(midi: number) {
        WebRtcController.getInstance().send({
            action: KEY_ACTIONS.KEY_UP,
            payload: { midi }
        });
    },
};

export default PianoClient;
