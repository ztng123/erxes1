import { IUser } from 'modules/auth/types';
import asyncComponent from 'modules/common/components/AsyncComponent';
import DropdownToggle from 'modules/common/components/DropdownToggle';
import Icon from 'modules/common/components/Icon';
import ModalTrigger from 'modules/common/components/ModalTrigger';
import NameCard from 'modules/common/components/nameCard/NameCard';
import Tip from 'modules/common/components/Tip';
import { colors } from 'modules/common/styles';
import { lighten, rgba } from 'modules/common/styles/color';
import { __, can } from 'modules/common/utils';
import Widget from 'modules/notifications/containers/Widget';
import NotificationSettings from 'modules/settings/profile/containers/NotificationSettings';
import Version from 'modules/settings/status/containers/Version';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Search from '../containers/Search';
import { UserHelper } from '../styles';
import BrandChooser from './BrandChooser';

const Signature = asyncComponent(() =>
  import(
    /* webpackChunkName:"Signature" */ 'modules/settings/email/containers/Signature'
  )
);

const ChangePassword = asyncComponent(() =>
  import(
    /* webpackChunkName:"ChangePassword" */ 'modules/settings/profile/containers/ChangePassword'
  )
);

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  span {
    float: none;
    margin: 0 5px 0 0;
  }

  i {
    width: 10px;
  }
`;

const NameCardWrapper = styled.div`
  padding: 10px 20px;
`;

const NavItem = styled.div`
  padding-left: 18px;
  display: table-cell;
  vertical-align: middle;

  > a {
    color: ${colors.textSecondary};
    display: flex;
    align-items: center;

    &:hover {
      color: ${colors.colorSecondary};
    }
  }

  .dropdown-menu {
    min-width: 240px;
  }
`;

const Round = styled(NavItem)`
  padding-left: 24px;

  > a {
    padding: 0 10px;
    background: ${lighten(colors.colorPrimary, 5)};
    color: ${colors.colorWhite};
    border-radius: 17px;

    > span {
      margin-left: 5px;
    }

    &.active,
    &:hover {
      background: ${lighten(colors.colorPrimary, 15)};
      color: ${rgba(colors.colorWhite, 0.8)};
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const QuickNavigation = ({
  logout,
  currentUser,
  showBrands,
  selectedBrands,
  onChangeBrands
}: {
  logout: () => void;
  currentUser: IUser;
  showBrands: boolean;
  selectedBrands: string[];
  onChangeBrands: (value: string) => void;
}) => {
  const passContent = props => <ChangePassword {...props} />;
  const signatureContent = props => <Signature {...props} />;

  const notificationContent = props => (
    <NotificationSettings currentUser={currentUser} {...props} />
  );

  const brands = currentUser.brands || [];

  const brandOptions = brands.map(brand => ({
    value: brand._id,
    label: brand.name || ''
  }));

  let brandsCombo;

  if (showBrands && brands.length > 1) {
    brandsCombo = (
      <NavItem>
        <BrandChooser
          selectedItems={selectedBrands}
          items={brandOptions}
          onChange={onChangeBrands}
        />
      </NavItem>
    );
  }

  return (
    <nav id={'SettingsNav'}>
      {brandsCombo}

      <NavItem>
        <Search />
      </NavItem>

      {can('showCalendars', currentUser) && (
        <NavItem>
          <Tip text={__('Calendar')} placement="bottom">
            <Link to="/calendar">
              <Icon icon="calendar-alt" size={20} />
            </Link>
          </Tip>
        </NavItem>
      )}

      <NavItem>
        <Tip text={__('Task')} placement="bottom">
          <Link to="/task">
            <Icon icon="file-check-alt" size={21} />
          </Link>
        </Tip>
      </NavItem>

      <Round>
        <NavLink to="/tutorial#defaultStage">
          <Icon icon="question-circle" size={20} />{' '}
          <span>{__('Tutorial')}</span>
        </NavLink>
      </Round>
      <NavItem>
        <Widget />
      </NavItem>
      <NavItem>
        <Link id="Settings" to="/settings">
          <Icon icon="cog" size={20} />
        </Link>
      </NavItem>
      <NavItem>
        <Dropdown alignRight={true}>
          <Dropdown.Toggle as={DropdownToggle} id="dropdown-user">
            <UserHelper>
              <UserInfo>
                <NameCard.Avatar user={currentUser} size={30} />
                <Icon icon="angle-down" size={14} />
              </UserInfo>
            </UserHelper>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <NameCardWrapper>
              <NameCard user={currentUser} />
            </NameCardWrapper>
            <Dropdown.Divider />

            <li>
              <Link to="/profile">{__('View Profile')}</Link>
            </li>

            <ModalTrigger
              title="Change Password"
              trigger={
                <li>
                  <a href="#change-password">{__('Change password')}</a>
                </li>
              }
              content={passContent}
            />

            <ModalTrigger
              title="Email signatures"
              enforceFocus={false}
              trigger={
                <li>
                  <a href="#email">{__('Email signatures')}</a>
                </li>
              }
              content={signatureContent}
            />

            <ModalTrigger
              title="Notification settings"
              trigger={
                <li>
                  <a href="#notif">{__('Notification settings')}</a>
                </li>
              }
              content={notificationContent}
            />

            <Dropdown.Divider />
            <Dropdown.Item onClick={logout}>{__('Sign out')}</Dropdown.Item>
            <Version kind="plain" />
          </Dropdown.Menu>
        </Dropdown>
      </NavItem>
    </nav>
  );
};

export default QuickNavigation;
