import React from 'react';
import { ContenFooter, ContentBox, MainContent } from '../styles';

type Props = {
  actionBar?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  transparent: boolean;
  center?: boolean;
  leftSpacing?: boolean;
};

function PageContent({
  actionBar,
  footer,
  children,
  transparent,
  center,
  leftSpacing
}: Props) {
  return (
    <MainContent transparent={transparent} center={center} leftSpacing={leftSpacing}>
      {actionBar}
      <ContentBox transparent={transparent}>{children}</ContentBox>
      {footer && <ContenFooter>{footer}</ContenFooter>}
    </MainContent>
  );
}

export default PageContent;
