const { tableSchema } = require('../tablePrefix');

cube(`DealsAssigneduser`, {
  sql: `SELECT * FROM ${tableSchema()}.\`deals_assignedUserIds\``,

  joins: {
    Users: {
      sql: `CONCAT(${CUBE}.assignedUserIds)= ${Users}._id`,
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

    assigneduserids: {
      sql: `${Users}.\`username\``,
      type: `string`,
      title: 'Name'
    }
  },

  dataSource: `default`
});
