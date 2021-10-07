import { Bookings, Channels, Tags } from '../../../db/models';
import { paginate } from '../../utils';
import { IContext } from '../../types';
import { TAG_TYPES } from '../../../db/models/definitions/constants';
import { getDocumentList } from '../mutations/cacheUtils';
import {
  checkPermission,
  moduleRequireLogin
} from '../../permissions/wrappers';

/**
 * Common helper for bookings & bookingsTotalCount
 */
const generateFilterQuery = async ({
  channelId,
  brandId,
  searchValue,
  tag,
  status
}) => {
  const query: any = {};

  // filter bookings by channel
  if (channelId) {
    const channel = await Channels.getChannel(channelId);
    query._id = { $in: channel.integrationIds || [] };
  }

  // filter bookings by brand
  if (brandId) {
    query.brandId = brandId;
  }

  if (searchValue) {
    query.name = new RegExp(`.*${searchValue}.*`, 'i');
  }

  // filtering bookings by tag
  if (tag) {
    const object = await Tags.findOne({ _id: tag });

    query.tagIds = { $in: [tag, ...(object?.relatedIds || [])] };
  }

  if (status) {
    query.isActive = status === 'active' ? true : false;
  }

  return query;
};

const bookingQueries = {
  /**
   * Booking detail
   */
  bookingDetail(_root, { _id }: { _id: string }) {
    return Bookings.getBooking(_id);
  },

  /**
   * Booking list
   */
  bookings(
    _root,
    args: { page: number; perPage: number; brandId: string; tagId: string },
    { commonQuerySelector }: IContext
  ) {
    const filter: any = { ...commonQuerySelector };

    if (args.brandId) {
      filter.brandId = args.brandId;
    }

    if (args.tagId) {
      filter.tagIds = args.tagId;
    }

    const bookings = paginate(Bookings.find(filter), args);

    return bookings.sort({ modifiedDate: -1 });
  },

  /**
   * Bookings total count
   */

  async bookingsTotalCount(
    _root,
    args: {
      channelId: string;
      brandId: string;
      tag: string;
      searchValue: string;
      status: string;
    }
  ) {
    const counts = {
      total: 0,
      byTag: {},
      byChannel: {},
      byBrand: {},
      byStatus: { active: 0, archived: 0, disabled: 0 }
    };

    const qry = {
      ...(await generateFilterQuery(args))
    };

    const count = async query => {
      return Bookings.find(query).countDocuments();
    };

    // Counting integrations by tag
    const tags = await Tags.find({ type: TAG_TYPES.BOOKING });

    for (const tag of tags) {
      const countQueryResult = await count({ tagIds: tag._id, ...qry });
      counts.byTag[tag._id] = !args.tag
        ? countQueryResult
        : args.tag === tag._id
        ? countQueryResult
        : 0;
    }

    // Counting integrations by channel
    const channels = await getDocumentList('channels', {});

    for (const channel of channels) {
      const countQueryResult = await count({
        _id: { $in: channel.integrationIds },
        ...qry
      });

      counts.byChannel[channel._id] = !args.channelId
        ? countQueryResult
        : args.channelId === channel._id
        ? countQueryResult
        : 0;
    }

    // Counting integrations by brand
    const brands = await getDocumentList('brands', {});

    for (const brand of brands) {
      const countQueryResult = await count({ brandId: brand._id, ...qry });
      counts.byBrand[brand._id] = !args.brandId
        ? countQueryResult
        : args.brandId === brand._id
        ? countQueryResult
        : 0;
    }

    counts.byStatus.active = await count({ isActive: true, ...qry });
    counts.byStatus.archived = await count({ isActive: false, ...qry });
    counts.byStatus.disabled = await count({ isActive: false, ...qry });

    if (args.status) {
      if (args.status === 'active') {
        counts.byStatus.archived = 0;
      } else {
        counts.byStatus.active = 0;
      }
    }

    // Counting all bookings without any filter
    counts.total = await count(qry);

    return counts;
  }
};

moduleRequireLogin(bookingQueries);

checkPermission(bookingQueries, 'bookings', 'showBookings', []);

export default bookingQueries;
