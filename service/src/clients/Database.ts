import {MongoClient} from "mongodb";

const URI = 'mongodb://root:password@database:27017';
const client = new MongoClient(URI);

export default client.db('p2piano');
