import * as React from 'react';
import { Contents } from '../styles';
import ActionBar from './ActionBar';
import Header from './Header';
import PageContent from './PageContent';
import Sidebar from './Sidebar';

type Props = {
  header: JSX.Element,
  leftSidebar: JSX.Element,
  rightSidebar: JSX.Element,
  actionBar: Node,
  content: JSX.Element,
  footer: Node,
  transparent: boolean
};

function Wrapper({
  header,
  leftSidebar,
  actionBar,
  content,
  footer,
  rightSidebar,
  transparent
}: Props) {
  return (
    <Contents>
      {header}
      {leftSidebar}
      <PageContent
        actionBar={actionBar}
        footer={footer}
        transparent={transparent || false}
      >
        {content}
      </PageContent>
      {rightSidebar}
    </Contents>
  );
}

Wrapper.Header = Header;
Wrapper.Sidebar = Sidebar;
Wrapper.ActionBar = ActionBar;

export default Wrapper;
