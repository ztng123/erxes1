const { tableSchema } = require('../tablePrefix');

cube(`TasksAssigneduser`, {
  sql: `SELECT * FROM ${tableSchema()}.\`tasks_assignedUserIds\``,

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
