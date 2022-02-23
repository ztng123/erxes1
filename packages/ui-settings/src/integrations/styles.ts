import { SelectWrapper } from '@erxes/ui/src/components/form/styles';
import { colors, dimensions } from '@erxes/ui/src/styles';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';

const FileSize = styled.div`
  font-size: 90%;
  opacity: 0.9;
`;

const Uploading = styled.div`
  display: flex;
  align-items: baseline;
  color: ${colors.colorCoreGray};
  font-size: 12px;
`;

const ControlWrapper = styled.div`
  position: relative;
`;

const MailEditorWrapper = styled.div`
  position: relative;
  background: ${colors.colorWhite};

  .cke {
    border: 0;
    border-bottom: 1px solid ${colors.borderPrimary};
  }

  .cke_inner {
    position: relative;

    .cke_resizer {
      display: none;
    }

    .cke_bottom {
      background: ${colors.bgLight};
      padding-left: ${dimensions.coreSpacing}px;
      padding-right: ${dimensions.coreSpacing}px;
      border-top: 1px solid ${colors.borderPrimary};
      max-height: 60px;
      overflow: hidden;
    }
  }

  .cke_toolgroup {
    border: 0;
    margin-left: ${dimensions.unitSpacing / 2}px;
  }
`;

const Resipients = styledTS<{ isActive?: boolean }>(styled.a)`
  padding-left: ${dimensions.unitSpacing}px;
  font-size: 12px;
  color: ${colors.colorCoreLightGray};
  display: ${props => props.isActive && 'none'};
  font-weight: 500;

  &:hover {
    cursor: pointer;
    color: ${colors.colorCoreGray};
  }
`;

const EditorFooter = styled.div`
  padding: ${dimensions.unitSpacing}px ${dimensions.coreSpacing}px;
`;

const Attachments = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 6px ${dimensions.coreSpacing}px 2px ${dimensions.coreSpacing}px
  border-bottom: 1px solid ${colors.borderPrimary};
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

const ToolBar = styled.div`
  i {
    font-size: 18px;
    color: ${colors.colorLightGray};
  }

  label {
    color: ${colors.colorCoreGray};
    margin-right: 10px;
    font-size: 14px;
    margin-bottom: 0;

    &:hover {
      cursor: pointer;
    }
  }

  input[type='file'] {
    display: none;
  }
`;

const SpaceBetweenRow = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;

  textarea,
  input,
  ${SelectWrapper} {
    height: ${dimensions.coreSpacing}px;
    border-bottom: 0;
    padding: 0;
    min-height: auto;
  }

  ${SelectWrapper} {
    width: auto;
    display: inline-flex;
    padding-right: 10px;
    background: ${colors.bgActive};

    &:after {
      top: 5px;
    }

    select {
      height: ${dimensions.coreSpacing}px;
    }
  }
`;

const Subject = styledTS<{ noBorder?: boolean }>(styled.div)`
  padding: ${dimensions.unitSpacing}px ${dimensions.coreSpacing}px;
  border-bottom:${props =>
    !props.noBorder && `1px solid ${colors.borderPrimary}`};

  input {
    height: ${dimensions.coreSpacing}px;
    border-bottom: 0;
  }
`;

const ShowReplyButtonWrapper = styled.div`
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 50px;
  bottom: 42px;
`;

const ShowReplies = styled.div`
  background-color: #eee;
  margin-left: 20px;
  margin-top: 10px;
  width: 35px;
  height: 11px;
  display: flex;
  border-radius: 8px;
  padding: 3px;
  justify-content: space-evenly;
  cursor: pointer;

  span {
    overflow: hidden;
    height: 5px;
    width: 5px;
    box-sizing: border-box;
    border-radius: 50%;
    background-color: ${colors.colorLightGray};
  }
`;

const PopoverLinkWrapper = styled.div`
  padding: ${dimensions.unitSpacing - 5}px ${dimensions.coreSpacing}px;

  a > i {
    padding-right: ${dimensions.unitSpacing - 5}px;
  }

  &:hover {
    a {
      color: #666;
    }
  }
`;

const Content = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;

  > form {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
`;

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Row = styled.div`
  display: flex;

  .Select {
    flex: 1;
  }

  button {
    flex-shrink: 0;
    margin-left: 10px;
    align-self: baseline;
  }
`;

const SearchInput = styledTS<{ isInPopover: boolean }>(styled.div)`
  position: relative;

  input {
    border: 1px solid ${colors.borderPrimary};
    padding: 20px 20px 20px 30px;
    border-radius: 5px;
    width: ${props => (props.isInPopover ? '250px' : '500px')};
    margin:  ${props => props.isInPopover && '5px 5px 0'};
    background: ${colors.colorWhite};

    @media (max-width: 1300px) {
      min-width: 260px;
    }
  }

  i {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 15px;
    color: ${colors.colorCoreGray};
  }
`;

export {
  Attachments,
  FlexRow,
  Row,
  Subject,
  ToolBar,
  Content,
  LeftContent,
  MailEditorWrapper,
  ControlWrapper,
  Resipients,
  Uploading,
  SpaceBetweenRow,
  EditorFooter,
  FileSize,
  ShowReplyButtonWrapper,
  ShowReplies,
  PopoverLinkWrapper,
  SearchInput
};
