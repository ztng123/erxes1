import { Tip } from 'modules/common/components';
import { colors } from 'modules/common/styles';
import { __ } from 'modules/common/utils';
import * as React from 'react';
import styled from 'styled-components';
import { IUser } from '../../../../auth/types';

const spacing = 30;

const ParticipatorWrapper = styled.div`
  display: inline-block;
  margin-left: ${spacing}px;

  &:hover {
    cursor: pointer;
  }
`;

const ParticipatorImg = styled.img`
  width: ${spacing}px;
  height: ${spacing}px;
  border-radius: 15px;
  display: inline-block;
  border: 2px solid ${colors.colorWhite};
  margin-left: -10px;
`;

const More = ParticipatorImg.withComponent('span').extend`
  color: ${colors.colorWhite};
  text-align: center;
  vertical-align: middle;
  font-size: 10px;
  background: ${colors.colorCoreLightGray};
  line-height: ${spacing - 2}px;
`;

type Props = {
  participatedUsers: IUser[];
  limit: number;
};

class Participators extends React.Component<Props, { toggle: boolean }> {
  constructor(props) {
    super(props);

    this.state = {
      toggle: true
    };
  }

  toggleParticipator = () => {
    this.setState({ toggle: !this.state.toggle });
  };

  render() {
    const { participatedUsers, limit } = this.props;
    const { toggle } = this.state;
    const length = participatedUsers.length;

    const Trigger = user => (
      <Tip key={user._id} placement="top" text={user.details.fullName || ''}>
        <ParticipatorImg
          key={user._id}
          src={user.details.avatar || '/images/avatar-colored.svg'}
        />
      </Tip>
    );

    const Tooltip = (
      <Tip placement="top" text={__('View more')}>
        <More>{`+${length - limit}`}</More>
      </Tip>
    );

    return (
      <ParticipatorWrapper onClick={this.toggleParticipator}>
        {participatedUsers
          .slice(0, limit && toggle ? limit : length)
          .map(user => Trigger(user))}
        {limit && toggle && length - limit > 0 && Tooltip}
      </ParticipatorWrapper>
    );
  }
}

export default Participators;
