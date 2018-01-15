import styled from 'styled-components';
import { colors, dimensions, typography } from 'modules/common/styles';

const SidebarListli = styled.li`
  border-bottom: 1px solid ${colors.borderPrimary};
  padding: ${dimensions.unitSpacing}px;
  transition: all ease 0.3s;

  a {
    &:hover {
      background: none;
    }
  }

  &:hover {
    background: ${colors.bgLight};
    cursor: pointer;
  }
`;

const Members = styled.div`
  padding: 5px 0 0 16px;
`;

const MemberImg = styled.img`
  width: ${dimensions.coreSpacing + 10}px;
  border-radius: ${dimensions.unitSpacing + 5}px;
  border: 2px solid ${colors.colorWhite};
  margin-left: -8px;
`;

const More = MemberImg.withComponent('span').extend`
  color: ${colors.colorWhite};
  text-align: center;
  vertical-align: middle;
  font-size: ${dimensions.unitSpacing}px;
  background: ${colors.colorCoreLightGray};
  display: inline-block;
  line-height: ${dimensions.coreSpacing + 6}px;
  cursor: pointer;
`;

const RightButton = styled.div`
  position: absolute;
  right: ${dimensions.coreSpacing}px;
  top: ${dimensions.coreSpacing - 5}px;
`;

const ManageActions = styled.div`
  margin-top: ${dimensions.unitSpacing}px;
  margin-right: ${dimensions.unitSpacing}px;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  * {
    padding: 0;
    margin-left: ${dimensions.unitSpacing}px;

    &:first-child {
      margin-left: 0;
    }
  }
`;

const Title = styled.h3`
  font-size: ${typography.fontSizeHeading8}px;
  font-weight: ${typography.fontWeightMedium};
  text-transform: uppercase;
  padding: ${dimensions.coreSpacing}px;
  margin: 0;
  height: ${dimensions.headerSpacing - 1}px;
  background-color: ${colors.bgLight};
  border-bottom: 1px solid ${colors.borderPrimary};
`;

const Row = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  transition: all ease 0.3s;

  &:hover {
    ${ManageActions} {
      width: ${dimensions.headerSpacing - 7}px;
      padding-left: ${dimensions.unitSpacing - 5}px;
      align-items: center;
      display: flex;
    }
  }

  ${ManageActions} {
    width: 0;
    margin-left: auto;
    padding-left: ${dimensions.unitSpacing - 5}px;
    overflow: hidden;
    display: flex;
    transition: all ease 0.3s;

    > label {
      margin-top: ${dimensions.unitSpacing}px;
    }
  }

  > div {
    margin: 0;
  }

  > a {
    padding: 0;

    &:focus {
      color: inherit;
      text-decoration: none;
    }
  }
`;

const RowContent = styled.div`
  flex: 1;

  > a {
    padding: 0 ${dimensions.unitSpacing}px;
  }
`;

const RowTitle = styled.div`
  padding-left: ${dimensions.unitSpacing + 1}px;
`;

export {
  SidebarListli,
  MemberImg,
  Members,
  More,
  Title,
  RightButton,
  ActionButtons,
  ManageActions,
  Row,
  RowContent,
  RowTitle
};
