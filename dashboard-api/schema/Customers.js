const { tableSchema } = require('../tablePrefix');

cube(`Customers`, {
  sql: `SELECT * FROM ${tableSchema()}__customers WHERE state='customer'`,

  joins: {},

  measures: {
    count: {
      type: `count`
    }
  },

  dimensions: {
    brand: {
      sql: `${CUBE}."integrationId"`,
      type: `string`
    },

    status: {
      sql: `status`,
      type: `string`
    },

    tag: {
      sql: `${CUBE}."tagIds"`,
      type: `string`
    },

    createdDate: {
      sql: `${CUBE}."createdAt"`,
      type: `time`
    },

    birthDate: {
      sql: `${CUBE}."birthDate"`,
      type: `time`
    },

    modifiedDate: {
      sql: `${CUBE}."modifiedAt"`,
      type: `time`
    }
  }
});
