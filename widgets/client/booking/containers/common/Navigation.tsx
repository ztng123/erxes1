import * as React from 'react';
import { AppConsumer } from '../AppContext';
import { Navigation } from '../../components/common';
import { ICategoryTree } from '../../types';
import { ChildProps } from 'react-apollo';

type Props = {
  items: ICategoryTree[];
  parentId?: string;
  goToBlock?: (blockId: string) => void;
  goToFloor?: (floorId: string) => void;
  goToProduct?: (productId: string) => void;
};

function NavigationContainer(props: ChildProps<Props>) {
  const { parentId, goToBlock, goToFloor, goToProduct } = props;

  const changeRoute = (item: ICategoryTree) => {
    if (item.parentId === parentId && goToBlock) {
      return goToBlock(item._id);
    }

    if (item.type === 'category' && goToFloor) {
      return goToFloor(item._id);
    }

    if (item.type === 'product' && goToProduct) {
      return goToProduct(item._id);
    }
  };
  return <Navigation {...props} changeRoute={changeRoute} />;
}

const WithContext = (props: Props) => {
  return (
    <AppConsumer>
      {({ goToBlock, goToFloor, goToProduct }) => (
        <NavigationContainer
          {...props}
          goToBlock={goToBlock}
          goToFloor={goToFloor}
          goToProduct={goToProduct}
        />
      )}
    </AppConsumer>
  );
};

export default WithContext;
