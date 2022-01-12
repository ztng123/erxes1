import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import { filterXSS } from 'xss';
import cookieParser from 'cookie-parser';
import http from 'http';

import configs from './api/configs';
import deliveryReports from './api/deliveryReports';
import telnyx from './api/telnyx';
import { buildSubgraphSchema } from '@apollo/federation';
import { ApolloServer } from 'apollo-server-express';

import { connect } from './connection';
import { debugBase, debugError, debugInit } from './debuggers';
import { initBroker } from './messageBroker';
import { trackEngages } from './trackers/engageTracker';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import * as db from './apiCollections';

// load environment variables
dotenv.config();

export const app = express();

app.disable('x-powered-by');

app.use(cookieParser());

trackEngages(app);

// for health checking
app.get('/health', async (_req, res) => {
  res.end('ok');
});

app.use((req: any, _res, next) => {
  req.rawBody = '';

  req.on('data', chunk => {
    req.rawBody += chunk.toString();
  });

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Insert routes below
app.use('/configs', configs);
app.use('/deliveryReports', deliveryReports);
app.use('/telnyx', telnyx);

// Error handling middleware
app.use((error, _req, res, _next) => {
  const msg = filterXSS(error.message);

  console.log(error, 'ererer');

  debugBase(`Error: ${msg}`);
  res.status(500).send(msg);
});

const { MONGO_URL, NODE_ENV, PORT, TEST_MONGO_URL } = process.env;

const httpServer = http.createServer(app);

httpServer.on('close', () => {
  try {
    db.disconnect();
  } catch (e) {
    console.log('Mongo DB disconnected');
  }
});

const apolloServer = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  // for graceful shutdown
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  context: ({ req }) => {
    let user: any = null;

    if (req.headers.user) {
      if (Array.isArray(req.headers.user)) {
        throw new Error(`Multiple user headers`);
      }
      const userJson = Buffer.from(req.headers.user, 'base64').toString(
        'utf-8'
      );
      user = JSON.parse(userJson);
    }

    return { user };
  }
});

async function starServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });
  await new Promise<void>(resolve =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(
    `🚀 Engages graphql api ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
  );

  let mongoUrl = MONGO_URL;

  if (NODE_ENV === 'test') {
    mongoUrl = TEST_MONGO_URL;
  }

  // connect to mongo database
  connect(mongoUrl).then(async () => {
    initBroker(app).catch(e => {
      debugError(`Error ocurred during message broker init ${e.message}`);
    });
  });

  await db.connect();

  debugInit(`Engages server is running on port ${PORT}`);
}

starServer();
