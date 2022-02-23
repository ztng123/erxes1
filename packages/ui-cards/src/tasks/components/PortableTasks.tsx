import PortableItems from '../../boards/components/portable/Items';
import GetConformity from '../../conformity/containers/GetConformity';
import React from 'react';
import options from '../options';

type IProps = {
  mainType?: string;
  mainTypeId?: string;
};

export default (props: IProps) => {
  return (
    <GetConformity
      {...props}
      relType="task"
      component={PortableItems}
      queryName={options.queriesName.itemsQuery}
      itemsQuery={options.queries.itemsQuery}
      data={{ options }}
    />
  );
};
