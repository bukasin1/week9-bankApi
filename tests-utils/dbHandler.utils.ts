import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// const mongoServer = new MongoMemoryServer();
let mongoServer: MongoMemoryServer;
exports.dbConnect = async () => {
   mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  await mongoose.connect(uri, mongooseOpts);
};

exports.dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};
