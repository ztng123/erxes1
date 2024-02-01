// import {
//   convertStringPropToFunction,
//   transformDimensions,
//   transformMeasures,
//   transformJoins
// } from '../src/utils';

// import { getService, getServices } from '../src/serviceDiscovery';

// asyncModule(async () => {
//   const services = await getServices();

//   for (const serviceName of services) {
//     const service = await getService(serviceName, true);
//     const meta = service.config?.meta || {};

//     if (meta && meta.dashboards) {
//       const schemas = meta.dashboards.schemas || [];

//       for (const schema of schemas) {
//         const dimensions = transformDimensions(schema.dimensions);
//         const measures = transformMeasures(schema.measures);
//         const joins = transformJoins(schema.joins || {});

//         cube(schema.title, {
//           dataSource: schema.dataSource,
//           sql: schema.sql,
//           dimensions,
//           measures
//         });
//       }
//     }
//   }
// });
