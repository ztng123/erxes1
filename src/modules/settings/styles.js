import styled from 'styled-components';
import { dimensions, colors, typography } from 'modules/common/styles';
import { rgba } from 'modules/common/styles/color';
import { ActionButtons } from 'modules/knowledgeBase/styles';

const coreSpace = `${dimensions.coreSpacing}px`;
const unitSpace = `${dimensions.unitSpacing}px`;

const ContentBox = styled.div`
  padding: ${dimensions.coreSpacing}px;
`;

const ModuleBox = styled.div`
  padding: ${coreSpace} 0 0 ${coreSpace};
`;

const LogoContainer = styled.div`
  color: ${colors.colorWhite};
  line-height: 56px;
  text-align: center;
  border-radius: 28px;
  width: 56px;
  height: 56px;
  cursor: pointer;
  box-shadow: 0 0 ${unitSpace} 0 ${rgba(colors.colorBlack, 0.2)};
  background-image: url('/images/erxes.png');
  background-color: ${colors.colorPrimary};
  background-position: center;
  background-size: 20px;
  background-repeat: no-repeat;
  margin-top: ${unitSpace};
  position: relative;
  float: right;

  span {
    position: absolute;
    width: ${coreSpace};
    height: ${coreSpace};
    background: ${colors.colorCoreRed};
    display: block;
    right: -2px;
    top: -5px;
    color: ${colors.colorWhite};
    border-radius: ${unitSpace};
    text-align: center;
    line-height: ${coreSpace};
    font-size: ${unitSpace};
  }

  input[type='file'] {
    display: none;
  }

  label {
    display: block;
    margin: 0;
    visibility: hidden;
    border-radius: 50%;
  }

  &:hover label {
    visibility: visible;
    cursor: pointer;
  }
`;

const WidgetPreviewStyled = styled.div`
  font-family: 'Roboto', sans-serif;
  max-height: 460px;
  width: 340px;
  border-radius: 4px;
  background: ${colors.colorWhite};
  color: ${colors.colorWhite};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2px 15px 0 ${rgba(colors.colorBlack, 0.14)},
    0 1px 6px 0 ${rgba(colors.colorBlack, 0.06)};
`;

const ColorPick = styled.div`
  border-radius: 4px;
  display: ${props => (props.full ? 'block' : 'inline-block')};
  padding: 5px;
  border: 1px solid ${colors.borderPrimary};
  cursor: pointer;
`;

const ColorPicker = styled.div`
  width: ${props => (props.full ? '100%' : '80px')};
  height: 15px;
`;

const WidgetApperance = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 100%;
  padding: ${coreSpace};
`;

const WidgetBackgrounds = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const SubHeading = styled.h4`
  text-transform: uppercase;
  font-weight: ${typography.fontWeightMedium};
  border-bottom: 1px dotted ${colors.colorShadowGray};
  padding-bottom: ${coreSpace};
  font-size: ${typography.fontSizeHeading8}px;
  margin: 0 0 ${coreSpace};
`;

const MarkdownWrapper = styled.div`
  position: relative;
  background: ${colors.colorWhite};
  border: 1px solid ${colors.colorShadowGray};
  border-radius: 2px;

  > div {
    background: none;
  }

  button {
    position: absolute;
    right: ${coreSpace};
    top: ${coreSpace};
  }

  pre {
    border: none;
    background: none;
    margin: 0;
  }
`;

const InlineItems = styled.div`
  display: flex;
  margin-bottom: ${unitSpace};
  align-items: center;
  justify-content: space-between;

  > div {
    margin-right: ${unitSpace};
  }
`;

const SubItem = styled.div`
  margin-bottom: ${coreSpace};
`;

const BackgroundSelector = styled.div`
  border: 3px solid transparent;
  margin-right: 15px;
  border-radius: 4px;
  transition: border-color 0.3s;

  > div {
    width: 80px;
    height: 40px;
    margin: 5px;
    border: 1px solid ${colors.borderDarker};
    background-repeat: repeat;
    background-position: 0 0;
    background-size: 220%;

    &.background-1 {
      background-image: url('/images/patterns/bg-1.png');
    }

    &.background-2 {
      background-image: url('/images/patterns/bg-2.png');
    }

    &.background-3 {
      background-image: url('/images/patterns/bg-3.png');
    }

    &.background-4 {
      background-image: url('/images/patterns/bg-4.png');
    }

    &.background-5 {
      background: #faf9fb;
    }
  }

  &.selected {
    border-color: ${colors.borderDarker};
  }

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    cursor: pointer;
  }
`;

const SidebarListItem = styled.li`
  position: relative;
  border-bottom: 1px solid ${colors.borderPrimary};
  background: ${props => props.isActive && colors.bgActive};
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;

  a {
    white-space: normal;
    flex: 1;
    padding: 10px 0 10px 20px;

    &:hover {
      background: none;
    }

    &:focus {
      color: inherit;
      text-decoration: none;
    }
  }

  &:last-child {
    border: none;
  }

  &:hover {
    cursor: pointer;
    background: ${props => !props.isActive && colors.bgLight};

    ${ActionButtons} {
      transform: translate(0px);
    }
  }
`;

export {
  ContentBox,
  ModuleBox,
  SubHeading,
  MarkdownWrapper,
  InlineItems,
  SubItem,
  WidgetApperance,
  WidgetPreviewStyled,
  WidgetBackgrounds,
  BackgroundSelector,
  ColorPick,
  ColorPicker,
  LogoContainer,
  SidebarListItem,
  ActionButtons
};
