import Button from '@erxes/ui/src/components/Button';
import { IMenu, IType } from '../types';
import Row from './Row';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import Form from './Form';
import { Title } from '@erxes/ui-settings/src/styles';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import Table from '@erxes/ui/src/components/table';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import asyncComponent from '@erxes/ui/src/components/AsyncComponent';

type Props = {
  menus: IMenu[];
  types: IType[];
  typeId?: string;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  remove: (menu: IMenu) => void;
  edit: (menu: IMenu) => void;
  loading: boolean;
};

function List({
  menus,
  typeId,
  types,
  remove,
  renderButton,
  loading,
  edit
}: Props) {
  const trigger = (
    <Button id={'AddMenuButton'} btnStyle="success" icon="plus-circle">
      Add Menu
    </Button>
  );

  const modalContent = props => (
    <Form {...props} types={types} renderButton={renderButton} menus={menus} />
  );

  const actionBarRight = (
    <ModalTrigger
      title={__('Add menu')}
      trigger={trigger}
      content={modalContent}
      enforceFocus={false}
    />
  );

  const title = <Title capitalize={true}>{__('Menu')}</Title>;

  const actionBar = (
    <Wrapper.ActionBar left={title} right={actionBarRight} wideSpacing />
  );

  const content = (
    <Table>
      <thead>
        <tr>
          <th>{__('Todo')}</th>
          <th>{__('Expiry Date')}</th>
          <th>{__('Actions')}</th>
        </tr>
      </thead>
      <tbody id={'MenusShowing'}>
        {menus.map(menu => {
          return (
            <Row
              space={0}
              key={menu._id}
              menu={menu}
              remove={remove}
              edit={edit}
              renderButton={renderButton}
              menus={menus}
              types={types}
            />
          );
        })}
      </tbody>
    </Table>
  );

  const SideBarList = asyncComponent(() =>
    import(/* webpackChunkName: "List - Menus" */ '../containers/SideBarList')
  );

  const breadcrumb = [
    { title: __('Settings'), link: '/settings' },
    { title: __('Menus'), link: '/menus' }
  ];

  return (
    <Wrapper
      header={<Wrapper.Header title={__('Menus')} breadcrumb={breadcrumb} />}
      actionBar={actionBar}
      content={
        <DataWithLoader
          data={content}
          loading={loading}
          count={menus.length}
          emptyText={__('Theres no menu')}
          emptyImage="/images/actions/8.svg"
        />
      }
      leftSidebar={<SideBarList currentTypeId={typeId} />}
      transparent={true}
      hasBorder
    />
  );
}

export default List;
