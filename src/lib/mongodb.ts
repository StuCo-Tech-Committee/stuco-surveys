// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient, MongoClientOptions } from 'mongodb';

const uri = process.env.DB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
} as MongoClientOptions;

let client;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalVar = global as unknown as {
    _mongoClientPromise: Promise<MongoClient>;
  };
  if (!globalVar._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalVar._mongoClientPromise = client.connect();
  }
  clientPromise = globalVar._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
