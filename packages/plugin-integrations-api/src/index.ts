import * as bodyParser from 'body-parser';

import initCallPro from './callpro/controller';
import initChatfuel from './chatfuel/controller';
import { debugIntegrations, debugRequest } from './debuggers';
import initFacebook from './facebook/controller';
import initGmail from './gmail/controller';
import { initNylas } from './nylas/controller';
import initSmooch from './smooch/controller';
// import { init } from './startup';
import systemStatus from './systemStatus';
import userMiddleware from './userMiddleware';

const rawBodySaver = (req, _res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');

    if (req.headers.fromcore === 'true') {
      req.rawBody = req.rawBody.replace(/\//g, '\\/');
    }
  }
};

const initApp = async app => {
  app.use(
    bodyParser.urlencoded({
      limit: '10mb',
      verify: rawBodySaver,
      extended: true
    })
  );
  app.use(bodyParser.json({ limit: '10mb', verify: rawBodySaver }));

  app.use(userMiddleware);

  // Intentionally placing this route above raw bodyParser
  // File upload in nylas controller is not working with rawParser
  initNylas(app);

  app.use(bodyParser.raw({ limit: '10mb', verify: rawBodySaver, type: '*/*' }));

  app.use((req, _res, next) => {
    debugRequest(debugIntegrations, req);

    next();
  });

  app.get('/system-status', async (_req, res) => {
    return res.json(await systemStatus());
  });
  
  // init bots
  initFacebook(app);

  // init gmail
  initGmail(app);

  // init callpro
  initCallPro(app);

  // init chatfuel
  initChatfuel(app);

  // init smooch
  initSmooch(app);

  // Error handling middleware
  app.use((error, _req, res, _next) => {
    console.error(error.stack);
    res.status(500).send(error.message);
  });

};

export default initApp;
