const { tableSchema } = require('../tablePrefix');

cube(`DealsLabel`, {
  sql: `SELECT * FROM ${tableSchema()}.\`deals_labelIds\``,

  joins: {
    PipelineLabels: {
      sql: `CONCAT(${CUBE}.labelIds)= ${PipelineLabels}._id`,
      relationship: `belongsTo`
    }
  },

  measures: {},

  dimensions: {
    _id: {
      sql: `CONCAT(${CUBE}._id)`,
      type: `string`,
      primaryKey: true
    },

    name: {
      sql: `${PipelineLabels.name}`,
      type: `string`
    }
  },

  dataSource: `default`
});
