import { IUser } from 'modules/auth/types';
import * as React from 'react';
import RTG from 'react-transition-group';
import Onboarding from '../containers/Onboarding';
import { IEntry } from '../types';
import { Bot } from './styles';

type Props = {
  entries: IEntry[];
  currentUser: IUser;
};

type State = {
  currentRoute: string;
};

class Robot extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = { currentRoute: 'onboardInitial' };
  }

  changeRoute = (currentRoute: string) => {
    this.setState({ currentRoute });
  };

  renderContent = () => {
    const { currentRoute } = this.state;
    const { currentUser } = this.props;

    return (
      <Onboarding
        changeRoute={this.changeRoute}
        show={currentRoute.includes('onboard')}
        currentUser={currentUser}
        currentStep={
          currentRoute === 'onboardStart' ? 'featureList' : undefined
        }
      />
    );
  };

  changeContent = () => {
    if (this.state.currentRoute === 'onboardStart') {
      return this.changeRoute('');
    }

    return this.changeRoute('onboardStart');
  };

  render() {
    return (
      <>
        {this.renderContent()}
        <RTG.CSSTransition
          in={true}
          appear={true}
          timeout={2600}
          classNames="robot"
        >
          <Bot onClick={this.changeContent}>
            <img src="/images/erxes-bot.svg" alt="ai robot" />
          </Bot>
        </RTG.CSSTransition>
      </>
    );
  }
}

export default Robot;
