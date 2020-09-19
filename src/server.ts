require("dotenv").config();
import express from 'express';
import cors from 'cors';
import routes from './routes';
import mongoose from 'mongoose';

const server = express();
server.use(cors({}));

mongoose.connect(
  process.env.MONGO_CONECTION as string,
  { 
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
server.use(express.json())

server.use(routes);

server.listen(process.env.PORT || 3333);