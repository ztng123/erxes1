const { tableSchema } = require('../tablePrefix');

cube(`Integrations`, {
  sql: `SELECT * FROM ${tableSchema()}.integrations`,

  joins: {},

  measures: {
    count: {
      type: `count`,
      drillMembers: [name]
    },

    bookingdataViewcount: {
      sql: `${CUBE}.\`bookingData.viewCount\``,
      type: `sum`,
      title: `Bookingdata.viewcount`
    },

    leaddataViewcount: {
      sql: `${CUBE}.\`leadData.viewCount\``,
      type: `sum`,
      title: `Leaddata.viewcount`
    }
  },

  dimensions: {
    _id: {
      sql: `_id`,
      type: `number`,
      primaryKey: true
    },

    kind: {
      sql: `kind`,
      type: `string`
    },

    name: {
      sql: `kind`,
      type: `string`
    }
  },

  dataSource: `default`
});
