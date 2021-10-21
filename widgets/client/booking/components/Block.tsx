import * as React from 'react';
import { IProductCategory } from '../../types';
import { IStyle } from '../types';

type Props = {
  block: IProductCategory;
  widgetColor: string;
  onHoverHandler?: () => void;
  goToBlock: (blockId: string) => void;
};

function Block({ block, goToBlock, onHoverHandler }: Props) {
  const handleOnClick = () => {
    goToBlock(block._id);
  };
  return (
    <div
      className={`block`}
      onClick={handleOnClick}
      onMouseEnter={onHoverHandler}
    >
      <h4>{block.name}</h4>
      <p>{block.description}</p>
    </div>
  );
}

export default Block;
