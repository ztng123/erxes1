import { IUser } from 'modules/auth/types';
import asyncComponent from 'modules/common/components/AsyncComponent';
import { IRouterProps } from 'modules/common/types';
import { NotifProvider } from 'modules/notifications/context';
import Robot from 'modules/robot/containers/Robot';
import ImportIndicator from 'modules/settings/importHistory/containers/ImportIndicator';
import React from 'react';
import { withRouter } from 'react-router-dom';
import Navigation from '../containers/Navigation';
import { Layout, MainWrapper } from '../styles';
import DetectBrowser from './DetectBrowser';

const MainBar = asyncComponent(() =>
  import(/* webpackChunkName: "MainBar" */ 'modules/layout/components/MainBar')
);

interface IProps extends IRouterProps {
  currentUser?: IUser;
  children: React.ReactNode;
  isShownIndicator: boolean;
  closeLoadingBar: () => void;
}

class MainLayout extends React.Component<IProps> {
  componentDidMount() {
    const { history, currentUser } = this.props;

    if (history.location.pathname !== '/reset-password' && !currentUser) {
      history.push('/sign-in');
    }

    if (currentUser && process.env.NODE_ENV === 'production') {
      // Wootric code
      (window as any).wootricSettings = {
        email: currentUser.email, // Required to uniquely identify a user. Email is recommended but this can be any unique identifier.
        created_at: Math.floor(Date.now() / 1000), // The current logged in user's sign-up date as a 10 digit Unix timestamp in seconds. OPTIONAL
        account_token: 'NPS-477ee032' // This is your unique account token.
      };

      const wootricScript = document.createElement('script');
      wootricScript.src = 'https://cdn.wootric.com/wootric-sdk.js';

      document.head.appendChild(wootricScript);

      const initWootric = () => {
        // tslint:disable
        if ((window as any).wootric) {
          (window as any).wootric('run');
        } else {
          setTimeout(() => initWootric(), 1000);
        }
      };

      initWootric();
    }
  }

  getLastImport = () => {
    return localStorage.getItem('erxes_import_data') || '';
  };

  renderBackgroundProccess = () => {
    const { isShownIndicator, closeLoadingBar } = this.props;

    if (isShownIndicator) {
      return (
        <ImportIndicator id={this.getLastImport()} close={closeLoadingBar} />
      );
    }

    return null;
  };

  render() {
    const { currentUser, children, isShownIndicator, history } = this.props;

    if (history.location.pathname === '/videoCall') {
      return children;
    }

    return (
      <>
        {this.renderBackgroundProccess()}
        <Layout isSqueezed={isShownIndicator}>
          {currentUser && <Navigation currentUser={currentUser} />}

          <MainWrapper>
            <NotifProvider currentUser={currentUser}>
              <MainBar />
            </NotifProvider>

            {children}
          </MainWrapper>
          <DetectBrowser />
        </Layout>
        <Robot />
      </>
    );
  }
}

export default withRouter<IProps>(MainLayout);
