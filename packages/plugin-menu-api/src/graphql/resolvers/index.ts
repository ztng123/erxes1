import customScalars from '@erxes/api-utils/src/customScalars';

import mutations from './mutations';
import queries from './queries';
import { Menus, Types } from '../../models';

const Menu = {
  currentType(menu, _args) {
    return Types.findOne({ _id: menu.typeId });
  },
  children(menu, _args) {
    // 자식 메뉴 항목들을 찾아서 반환합니다.
    return Menus.find({ parentId: menu._id }).sort({ order: 1, name: 1 });
  },
  title(menu, _args) {
    return menu.title;
  },
  content(menu, _args) {
    return menu.content;
  }
};

const resolvers: any = async _serviceDiscovery => ({
  ...customScalars,
  Menu,
  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  }
});

export default resolvers;
