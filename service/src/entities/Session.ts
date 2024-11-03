import {v4 as uuidv4} from 'uuid';
import {SessionNotFoundError} from '../errors';
import Database from '../clients/Database';

export type Session = {
  sessionId: string,
};

const SessionCollection = Database.collection<Session>('session');


export default class SessionProvider {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static async create() {
    const sessionId = uuidv4();
    const session: Session = {sessionId};
    await SessionCollection.insertOne(session);
    return session;
  }

  static async get(sessionId: string) {
    const session = await SessionCollection.findOne({sessionId});
    if (!session) {
      throw new SessionNotFoundError(`Session ${sessionId} does not exist`);
    }

    return session;
  }
}
