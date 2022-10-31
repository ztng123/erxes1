import { paginate } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import { generateFilter } from '../../../utils';

const movementQueries = {
  async assetMovements(_root, params, { models }: IContext) {
    const filter = await generateFilter(params, 'movement');

    return paginate(
      models.Movements.find(filter).sort({ createdAt: -1 }),
      params
    );
  },
  async assetMovement(_root, { _id }, { models }: IContext) {
    return await models.Movements.findOne({ _id });
  },

  async assetMovementTotalCount(_root, params, { models }: IContext) {
    const filter = await generateFilter(params, 'movement');

    return models.Movements.find(filter).countDocuments();
  }
};

export default movementQueries;
