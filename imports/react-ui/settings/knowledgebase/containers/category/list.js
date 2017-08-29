import { compose } from 'react-komposer';
import { getTrackerLoader, composerOptions } from '/imports/react-ui/utils';
import { Meteor } from 'meteor/meteor';
import { KbCategories } from '/imports/api/knowledgebase/collections';
import { pagination } from '/imports/react-ui/common';
import { KbCategoryList } from '../../components';

function categoriesComposer({ queryParams }, onData) {
  const { limit, loadMore, hasMore } = pagination(queryParams, 'kb_categories.list.count');
  const kbCategoriesHandler = Meteor.subscribe(
    'kb_categories.list',
    Object.assign(queryParams, { limit }),
  );

  const removeItem = (id, callback) => {
    Meteor.call('knowledgebase.removeKbCategory', id, callback);
  };

  if (kbCategoriesHandler.ready()) {
    const items = KbCategories.find().fetch();
    onData(null, {
      items,
      removeItem,
      loadMore,
      hasMore,
    });
  }
}

export default compose(getTrackerLoader(categoriesComposer), composerOptions({}))(KbCategoryList);
