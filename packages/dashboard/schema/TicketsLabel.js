const { tableSchema } = require('../tablePrefix');

cube(`TicketsLabel`, {
  sql: `SELECT * FROM ${tableSchema()}.\`tickets_labelIds\``,

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

    label: {
      sql: `${PipelineLabels.name}`,
      type: `string`,
      title: 'Name'
    }
  },

  dataSource: `default`
});
