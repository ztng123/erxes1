import React, { useState, useEffect } from 'react';
import Button from '@erxes/ui/src/components/Button';
import { IMenu, IType } from '../types';
import Row from './Row';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
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

const NotionPageView = () => {
  const [pageTitle, setPageTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotionPageData = async () => {
      try {
        // 여기서는 Notion API 대신 서버의 프록시 엔드포인트를 호출해야 합니다.
        const response = await fetch('/api/notion-page');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // 예시로, 페이지의 제목만을 추출합니다.
        const title = data.properties.title.title[0].plain_text;
        setPageTitle(title);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Notion page data:', error);
        setLoading(false);
      }
    };

    fetchNotionPageData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!pageTitle) return <div>Error loading page</div>;

  return (
    <div>
      <h3>{pageTitle}</h3>
      {/* 페이지 내용 대신 제목만 표시합니다. 실제 내용을 표시하려면 추가 처리가 필요합니다. */}
    </div>
  );
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

  const modalContent = (props: any) => (
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
          data={<NotionPageView />}
          loading={loading}
          count={1}
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
