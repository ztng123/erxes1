import {
  convertStringPropToFunction,
  transformDimensions,
  transformMeasures,
  transformJoins
} from '../src/utils';

asyncModule(async () => {
  const dynamicCubes = [
    {
      name: 'Customers',

      sql: 'SELECT * FROM erxes."customers"',

      dataSource: 'default',
      joins: {
        Integrations: {
          relationship: `belongsTo`,
          sql: 'Customers.integrationId = Integrations.id'
        }
      },

      measures: {
        count: {
          type: 'count'
        }
      },

      dimensions: {
        id: {
          sql: `_id`,
          type: `string`,
          primaryKey: true
        },

        name: {
          sql: `Integrations.\`name\``,
          type: 'string'
        }
      }
    },
    {
      name: 'Integrations',

      sql: 'SELECT * FROM erxes."integrations"',
      dataSource: 'default',
      joins: {
        Integrations: {
          relationship: `belongsTo`,
          sql: 'Customers.integrationId = Integrations.id'
        }
      },
      measures: {
        count: {
          type: `count`
        }
      },
      dimensions: {
        id: {
          sql: `_id`,
          type: `string`,
          primaryKey: true
        },

        name: {
          sql: `name`,
          type: `string`
        }
      }
    }
  ];

  dynamicCubes.forEach(dynamicCube => {
    const dimensions = transformDimensions(dynamicCube.dimensions);
    const measures = transformMeasures(dynamicCube.measures);
    const joins = transformJoins(dynamicCube.joins);
    cube(dynamicCube.name, {
      sql: dynamicCube.sql,
      dimensions,
      measures,
      joins
    });
  });
});
