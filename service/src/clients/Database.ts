import {MongoClient} from "mongodb";


const HOST = process.env.DB_URL ?? 'localhost';
const URI = `mongodb://root:password@${HOST}:27017`;
const client = new MongoClient(URI);

export default client.db('p2piano');
