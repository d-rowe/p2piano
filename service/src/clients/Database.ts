import {MongoClient} from "mongodb";

const ENV_HOSTS = {
    production: 'http://p2piano.home',
    compose: 'database',
} as const;

const HOST = ENV_HOSTS[process.env.NODE_ENV] ?? 'localhost';
const URI = `mongodb://root:password@${HOST}:27017`;
const client = new MongoClient(URI);

export default client.db('p2piano');
