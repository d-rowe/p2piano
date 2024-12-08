import {MongoClient} from "mongodb";

const HOST = process.env.NODE_ENV === 'production'
    ? 'database'
    : 'localhost';
const URI = `mongodb://root:password@${HOST}:27017`;
const client = new MongoClient(URI);

export default client.db('p2piano');
