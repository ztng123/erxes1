import { NotificationConfigurations, Notifications } from '../../models';
import { NOTIFICATION_MODULES } from '../../constants';
import { moduleRequireLogin } from '@erxes/api-utils/src/permissions';
import { IContext, paginate } from '@erxes/api-utils/src';

const notificationQueries = {
  /**
   * Notifications list
   */
  notifications(
    _root,
    {
      requireRead,
      title,
      limit,
      notifType,
      ...params
    }: {
      requireRead: boolean;
      title: string;
      limit: number;
      notifType: string;
      page: number;
      perPage: number;
    },
    { user }: IContext
  ) {
    const sort = { date: -1 };
    const selector: any = { receiver: user._id };

    if (requireRead) {
      selector.isRead = false;
    }

    if (title) {
      selector.title = title;
    }

    if (notifType) {
      selector.notifType = notifType;
    }

    if (limit) {
      return Notifications.find(selector)
        .sort(sort)
        .limit(limit);
    }

    return paginate(Notifications.find(selector), params).sort(sort);
  },

  /**
   * Notification counts
   */
  notificationCounts(
    _root,
    { requireRead }: { requireRead: boolean },
    { user }: IContext
  ) {
    const selector: any = { receiver: user._id };

    if (requireRead) {
      selector.isRead = false;
    }

    return Notifications.find(selector).countDocuments();
  },

  /**
   * Module list used in notifications
   */
  notificationsModules() {
    return NOTIFICATION_MODULES;
  },

  /**
   * Get per user configuration
   */
  notificationsGetConfigurations(_root, _args, { user }: IContext) {
    return NotificationConfigurations.find({ user: user._id });
  },
};

moduleRequireLogin(notificationQueries);

export default notificationQueries;
