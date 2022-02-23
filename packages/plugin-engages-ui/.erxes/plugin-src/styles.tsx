import { colors, dimensions } from "@erxes/ui/src/styles";
import { BoxRoot } from "@erxes/ui/src/styles/main";
import { rgba } from "@erxes/ui/src/styles/ecolor";
import styled from "styled-components";
import styledTS from "styled-components-ts";

const coreSpace = `${dimensions.coreSpacing}px`;
const size = 65;

const RowTitle = styled.div`
  > a {
    color: ${colors.textPrimary};
  }

  &:hover {
    text-decoration: underline;
    color: ${colors.colorBlack};
    cursor: pointer;
  }
`;

const HelperText = styled.div`
  color: ${colors.colorCoreGray};
  font-size: 12px;
  line-height: 16px;
`;

const FlexContainer = styledTS<{ direction?: string }>(styled.div)`
  display: flex;
  flex-direction: ${(props) => props.direction};
`;

const Title = styled.h3`
  font-size: 12px;
  margin: 0;
  text-transform: uppercase;
`;

const FormWrapper = styled.div`
  padding: ${coreSpace};
  flex: 1;
  min-height: 100%;
  height: 100%;
`;

const PreviewContent = styledTS<{
  isFullmessage: boolean;
  showOverflow?: boolean;
}>(styled.div)`
  padding: 0 ${coreSpace};
  line-height: 22px;
  margin-bottom: ${coreSpace};
  color: ${colors.colorCoreGray};
  font-size: 14px;
  word-break: break-word;
  min-height: 500px;

  ${(props) => {
    if (!props.isFullmessage) {
      return `
        overflow: ${props.showOverflow ? "auto" : "hidden"};
        -webkit-box-orient: vertical;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        word-wrap: break-word;
      `;
    }
    return null;
  }};
`;

const Messenger = styled.div`
  position: absolute;
  right: ${coreSpace};
  bottom: ${coreSpace};
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const LogoContainer = styled.div`
  color: ${colors.colorWhite};
  line-height: 56px;
  text-align: center;
  border-radius: 28px;
  width: 56px;
  height: 56px;
  cursor: pointer;
  box-shadow: 0 0 ${dimensions.unitSpacing}px 0 ${rgba(colors.colorBlack, 0.2)};
  background-image: url("/images/erxes.png");
  background-color: ${colors.colorPrimary};
  background-position: center;
  background-size: 20px;
  background-repeat: no-repeat;
  margin-top: ${dimensions.unitSpacing}px;
  position: relative;
  float: right;
  display: table;

  span {
    position: absolute;
    width: ${coreSpace};
    height: ${coreSpace};
    background: ${colors.colorCoreRed};
    display: block;
    right: -2px;
    top: -5px;
    color: ${colors.colorWhite};
    border-radius: ${dimensions.unitSpacing}px;
    text-align: center;
    line-height: ${coreSpace};
    font-size: ${dimensions.unitSpacing}px;
  }

  input[type="file"] {
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

const LauncherContainer = styled(LogoContainer)`
  position: absolute;
  right: ${dimensions.unitSpacing}px;
  bottom: ${dimensions.unitSpacing}px;
`;

const WidgetPreviewStyled = styled.div`
  background: ${colors.colorWhite};
  color: ${colors.colorWhite};
  border-radius: ${dimensions.unitSpacing}px;
  border-bottom-right-radius: 25px;
  bottom: 80px;
  box-shadow: 0 2px 16px 1px ${rgba(colors.colorBlack, 0.2)};
  display: flex;
  flex-direction: column;
  height: calc(100% - 95px);
  max-height: 660px;
  overflow: hidden;
  position: absolute;
  right: 8px;
  width: 380px;
  z-index: 1;
`;

const WidgetPreview = styled(WidgetPreviewStyled)`
  height: auto;
  bottom: 90px;
  right: ${coreSpace};
  max-height: calc(100% - 95px);
  max-width: calc(100% - 40px);
`;

const WebPreview = styledTS<{ isEngage?: boolean }>(styled.div)`
  min-height: 100%;
  position: relative;
  background: linear-gradient(
    140deg,
    rgba(0, 0, 0, 0) 70%,
    rgba(0, 0, 0, 0.08) 95%,
    rgba(0, 0, 0, 0.1) 100%
  );
  width: ${(props) => props.isEngage && "100%"};

  .engage-message {
    > div:first-of-type {
      flex-shrink: 0;
      padding: ${coreSpace} ${coreSpace} 10px ${coreSpace};
    }
  }
`;

const MessengerPreview = styled(WebPreview)`
  min-height: 500px;
`;

const ListCounter = styledTS<{ chosen: boolean }>(styled.li)`
  list-style-type: none;
  text-align: left;
  display: list-item;
  background-color: ${(props) =>
    props.chosen ? colors.borderPrimary : "transparent"};

  a {
    outline: none;
    text-decoration: none;

    &:focus {
      outline: none;
      text-decoration: none;
    }
  }
`;

const Recipients = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
`;

const Recipient = styled.div`
  padding: 3px 6px;
  border: 1px solid ${colors.colorShadowGray};
  border-radius: 4px;
  display: flex;
  margin-right: 5px;
  margin-bottom: 5px;
  background: ${colors.bgLight};
  font-size: 13px;

  > span {
    margin-left: 6px;
    background: rgba(0, 0, 0, 0.05);
    padding: 0 3px;
    border-radius: 2px;
    margin-right: -2px;

    &:hover {
      color: ${colors.colorCoreRed};
      cursor: pointer;
      background: rgba(0, 0, 0, 0.08);
    }
  }
`;

const Half = styled.div`
  width: 50%;

  &:last-of-type {
    border: none;
  }
`;

const FlexItemCentered = styled(FlexContainer)`
  justify-content: center;
`;

const Box = styled(BoxRoot)`
  height: 200px;
  margin-bottom: ${coreSpace};
  margin-right: 0;
  flex-basis: 31%;
  flex-shrink: 0;

  @media (max-width: 1400px) {
    flex-basis: 48%;
  }
`;

const ChooseBox = styled(BoxRoot)`
  text-align: left;
  background: ${colors.colorWhite};
  margin: 10px 0 0 0;
  flex: 1;
  padding: ${dimensions.unitSpacing * 1.5}px;

  &:last-of-type {
    margin-bottom: ${dimensions.unitSpacing}px;
  }

  b {
    font-size: 15px;
    line-height: 20px;
    color: ${colors.textPrimary};
  }

  p {
    margin: 10px 0 0;
    font-size: 12px;
    color: ${colors.textSecondary};
  }

  a {
    color: ${colors.textPrimary};
    padding: ${dimensions.unitSpacing}px;
  }
`;

const BoxContent = styled.div`
  margin-top: 30px;
  font-size: 18px;

  h5 {
    margin-bottom: ${dimensions.coreSpacing}px;
  }

  span {
    font-weight: normal;
    color: ${colors.colorCoreGray};
    font-size: 80%;
    display: initial;
  }
`;

const BoxHeader = styled.div`
  position: relative;
  background-image: url("/images/patterns/bg-2.png");
  background-repeat: repeat;
  background-position: 0 0;
  height: 90px;
  border-bottom: 1px solid ${colors.borderPrimary};
`;

const IconContainer = styled.div`
  width: ${size}px;
  height: ${size}px;
  margin-top: 40px;
  border-radius: ${size}px;
  display: inline-block;
  background-color: ${colors.colorCoreTeal};

  i {
    color: ${colors.colorWhite};
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
`;

const SelectMonth = styled.div`
  flex: 1;

  label {
    margin-top: ${coreSpace};
  }
`;

const DateTimePicker = styled.div`
  margin-top: ${coreSpace};

  .rdtCounters {
    padding-left: 15px;
  }

  .rdtOpen .rdtPicker {
    border:none;

    table {
      width: inherit;
    }
  }

  .rdtCounterSeparator {
    line-height: inherit;
    padding: ${dimensions.unitSpacing - 5}px ${dimensions.unitSpacing}px;
  }

  .rdtTime {
    margin-left: -${dimensions.coreSpacing}px;
  }

  .rdtCounter {
    position: relative;
    height: ${dimensions.coreSpacing + 10}px
    color: ${rgba(colors.colorCoreDarkGray, 0.8)};
    background: ${colors.bgLight};
    border: 1px solid ${colors.borderPrimary};

    .rdtBtn {
      line-height: ${dimensions.unitSpacing}px;
      position: absolute;
      right: 0;
      font-size: ${dimensions.unitSpacing}px;
      color: ${colors.colorCoreGray};
      padding: 2px 3px 0 0;
    }

    .rdtCount {
      height: ${dimensions.unitSpacing}px;
      font-size: inherit;
      margin: 3px 0 0 -${dimensions.unitSpacing - 5}px;
    }
  }
`;

const StepFormWrapper = styled.div`
  padding: 20px;
`;

const ListWrapper = styled.div`
  padding: ${dimensions.coreSpacing}px;
`;

const RadioContainer = styled.div`
  border-bottom: 1px dotted ${colors.borderPrimary};

  > * {
    padding: ${dimensions.coreSpacing}px;
  }
`;

const CustomerCounts = styled.div`
  text-align: center;

  > i {
    color: ${colors.colorCoreLightGray};
  }
`;

const EditorContainer = styled.div`
  padding: ${coreSpace};
  flex: 1;
  overflow-y: auto;
`;

const SelectMessageType = styled.div`
  margin: 20px 20px 0 20px;
  width: 300px;
  white-space: normal;
  color: ${colors.colorCoreGray};
`;

const VerifyStatus = styled.div`
  display: flex;
  align-items: center;
`;

const VerifyCancel = styled.div`
  font-size: 16px;
  color: ${colors.colorCoreRed};
  padding-right: 8px;
`;

const VerifyCheck = styled.div`
  font-size: 16px;
  color: ${colors.colorCoreGreen};
  padding-right: 8px;
`;

const RightSection = styled.div`
  padding: ${coreSpace};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Shell = styled.div`
  width: 100%;

  .shell-wrap {
    width: 100%;
    margin: 100px auto 0 auto;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.4);

    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
  }

  .shell-top-bar {
    text-align: center;
    color: #525252;
    padding: 5px 0;
    margin: 0;
    text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
    font-size: 0.85em;
    border: 1px solid #cccccc;
    border-bottom: none;

    -webkit-border-top-left-radius: 3px;
    -webkit-border-top-right-radius: 3px;
    -moz-border-radius-topleft: 3px;
    -moz-border-radius-topright: 3px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;

    background: #f7f7f7; /* Old browsers */
    background: -moz-linear-gradient(
      top,
      #f7f7f7 0%,
      #b8b8b8 100%
    ); /* FF3.6+ */
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0%, #f7f7f7),
      color-stop(100%, #b8b8b8)
    ); /* Chrome,Safari4+ */
    background: -webkit-linear-gradient(
      top,
      #f7f7f7 0%,
      #b8b8b8 100%
    ); /* Chrome10+,Safari5.1+ */
    background: -o-linear-gradient(
      top,
      #f7f7f7 0%,
      #b8b8b8 100%
    ); /* Opera 11.10+ */
    background: -ms-linear-gradient(top, #f7f7f7 0%, #b8b8b8 100%); /* IE10+ */
    background: linear-gradient(to bottom, #f7f7f7 0%, #b8b8b8 100%); /* W3C */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f7f7f7', endColorstr='#B8B8B8',GradientType=0 ); /* IE6-9 */
  }

  .shell-body {
    min-height: 50px;
    margin: 0;
    padding: 5px;
    list-style: none;
    background: #141414;
    color: #45d40c;
    font: 0.8em "Andale Mono", Consolas, "Courier New";
    line-height: 1.6em;

    -webkit-border-bottom-right-radius: 3px;
    -webkit-border-bottom-left-radius: 3px;
    -moz-border-radius-bottomright: 3px;
    -moz-border-radius-bottomleft: 3px;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  .shell-body li:before {
    content: "$";
    position: absolute;
    left: 0;
    top: 0;
  }

  .shell-body li {
    word-wrap: break-word;
    position: relative;
    padding: 0 0 0 15px;
  }
`;

const DesktopPreviewContent = styledTS<{ templateId?: string }>(styled.div)`
  width: 70%;
  margin: 0 auto;
  background: ${(props) => !props.templateId && colors.colorWhite}
  padding: ${(props) => !props.templateId && `${dimensions.coreSpacing}px`}
`;

const MobilePreviewContent = styledTS<{ templateId?: string }>(styled.div)`
  height: 100%;
  overflow: auto;
  background: ${(props) => !props.templateId && colors.colorWhite}
  padding: ${(props) => !props.templateId && `${dimensions.coreSpacing}px`}
  overflow-x: hidden;
`;

const TestEmailWrapper = styled.div`
  margin: 20px 0;
  padding: 20px 0;
  border-top: 1px dashed #ddd;

  button {
    margin-top: 10px;
  }
`;

const Disabled = styled.div`
  display: inline-block;
  opacity: 0.7;

  > button:hover {
    cursor: not-allowed;
  }
`;

const InfoWrapper = styled.div`
  padding: 15px 20px;
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;

  > label {
    margin: 2px ${dimensions.unitSpacing}px 2px 0;
    color: ${colors.colorCoreGray};
    align-self: baseline;
  }
`;

const Subject = styledTS<{ noBorder?: boolean }>(styled.div)`
  padding: ${dimensions.unitSpacing}px ${dimensions.coreSpacing}px;
  border-bottom:${(props) =>
    !props.noBorder && `1px solid ${colors.borderPrimary}`};

  input {
    height: ${dimensions.coreSpacing}px;
    border-bottom: 0;
  }
`;

export {
  RowTitle,
  HelperText,
  FlexContainer,
  FormWrapper,
  WebPreview,
  PreviewContent,
  Messenger,
  MessengerPreview,
  ListCounter,
  Recipients,
  Recipient,
  Half,
  Title,
  FlexItemCentered,
  ChooseBox,
  Box,
  BoxContent,
  BoxHeader,
  IconContainer,
  DateTimePicker,
  SelectMonth,
  LauncherContainer,
  WidgetPreview,
  EditorContainer,
  StepFormWrapper,
  ListWrapper,
  RadioContainer,
  CustomerCounts,
  SelectMessageType,
  VerifyStatus,
  VerifyCancel,
  VerifyCheck,
  RightSection,
  DesktopPreviewContent,
  MobilePreviewContent,
  Shell,
  TestEmailWrapper,
  Disabled,
  InfoWrapper,
  FlexRow,
  Subject,
};
