import { IContext } from '../../../connectionResolver';
import { IPipelineDocument } from '../../../models/definitions/boards';
import {
  BOARD_TYPES,
  PIPELINE_VISIBLITIES
} from '../../../models/definitions/constants';
import {
  generateDealCommonFilters,
  generateGrowthHackCommonFilters,
  generateTaskCommonFilters,
  generateTicketCommonFilters
} from '../queries/utils';

export default {
  createdUser(pipeline: IPipelineDocument) {
    return { __typename: "User", _id: pipeline.userId };
  },

  members(pipeline: IPipelineDocument, {}) {
    if (pipeline.visibility === PIPELINE_VISIBLITIES.PRIVATE && pipeline.memberIds) {
      return pipeline.memberIds.map(memberId => ({ __typename: "User", _id : memberId }));
    }

    return [];
  },

  isWatched(pipeline: IPipelineDocument, _args, { user }: IContext) {
    const watchedUserIds = pipeline.watchedUserIds || [];

    if (watchedUserIds.includes(user._id)) {
      return true;
    }

    return false;
  },

  state(pipeline: IPipelineDocument) {
    if (pipeline.startDate && pipeline.endDate) {
      const now = new Date().getTime();

      const startDate = new Date(pipeline.startDate).getTime();
      const endDate = new Date(pipeline.endDate).getTime();

      if (now > endDate) {
        return 'Completed';
      } else if (now < endDate && now > startDate) {
        return 'In progress';
      } else {
        return 'Not started';
      }
    }

    return '';
  },

  async itemsTotalCount(
    pipeline: IPipelineDocument,
    _args,
    { user, models }: IContext
  ) {
    switch (pipeline.type) {
      case BOARD_TYPES.DEAL: {
        const filter = await generateDealCommonFilters(models, user._id, {
          pipelineId: pipeline._id
        });

        return models.Deals.find(filter).countDocuments();
      }
      case BOARD_TYPES.TICKET: {
        const filter = await generateTicketCommonFilters(models, user._id, {
          pipelineId: pipeline._id
        });

        return models.Tickets.find(filter).countDocuments();
      }
      case BOARD_TYPES.TASK: {
        const filter = await generateTaskCommonFilters(models, user._id, {
          pipelineId: pipeline._id
        });

        return models.Tasks.find(filter).countDocuments();
      }
      case BOARD_TYPES.GROWTH_HACK: {
        const filter = await generateGrowthHackCommonFilters(models, user._id, {
          pipelineId: pipeline._id
        });

        return models.GrowthHacks.find(filter).countDocuments();
      }
    }
  }
};
