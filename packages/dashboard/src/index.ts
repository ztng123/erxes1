import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as cors from 'cors';
import { CubejsServer } from '@cubejs-backend/server';
import { getService, getServices } from './serviceDiscovery';

dotenv.config();

const { CUBEJS_API_SECRET, DB_NAME } = process.env;

const server = new CubejsServer({
  schemaPath: '/dynamicSchema'
});

server
  .listen()
  .then(async ({ app, port }) => {
    const services = await getServices();

    for (const serviceName of services) {
      const service = await getService(serviceName);
      const meta = service.config?.meta || {};

      if (meta && meta.dashboards) {
        const schemas = meta.dashboards.schemas || [];

        for (const schema of schemas) {
          console.log(schema);
          // fs.writeFileSync(
          //   `./dynamicSchema/${schema.title}.js`,
          //   `${JSON.stringify(schema.content)}`
          // );
        }
      }
    }

    app.get('/get-token', async (_req, res) => {
      const dashboardToken = jwt.sign({}, CUBEJS_API_SECRET || 'secret', {
        expiresIn: '10day'
      });

      return res.send({
        dashboardToken
      });
    });

    app.use(cors());

    console.log(`🚀 Cube.js server is listening on ${port} dbname ${DB_NAME}`);
  })
  .catch(e => {
    console.error('Fatal error during server start: ');
    console.error(e.stack || e);
  });
