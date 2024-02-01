const { tableSchema } = require('../tablePrefix');

cube(`ProductsTag`, {
  sql: `SELECT * FROM ${tableSchema()}.\`products_tagIds\``,

  joins: {
    Tags: {
      sql: `CONCAT(${CUBE}.tagIds)= ${Tags}._id`,
      relationship: `belongsTo`
    }
  },

  measures: {
    count: {
      type: `count`
    }
  },

  dimensions: {
    _id: {
      sql: `CONCAT(${CUBE}._id)`,
      type: `string`,
      primaryKey: true
    },

    tag: {
      sql: `${Tags.name}`,
      type: `string`
    }
  },

  dataSource: `default`
});
