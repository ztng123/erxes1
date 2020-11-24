const calendars = `
  query calendarAccounts($groupId: String) {
    calendarAccounts(groupId: $groupId) {
      _id
      name
      color
      accountId
      userId
      isPrimary

      calendars {
        _id
        providerCalendarId
        accountUid
        name
        description
        readOnly
      }
    }
  }
`;

export default {
  calendars
};
