import styled from 'styled-components';
import { colors, dimensions } from 'modules/common/styles';

const Info = styled.div`
  margin-top: 5px;
  white-space: normal;

  > span {
    font-weight: normal;
  }
`;

const InfoTitle = styled.span`
  font-weight: 500;
  margin-bottom: 5px;
  margin-right: 10px;
`;

const InfoDetail = styled.p`
  margin: 0;
  display: inline-block;
  font-size: 12px;
  font-weight: normal;
  color: ${colors.colorCoreGray};
`;

const SectionBody = styled.div`
  i {
    color: ${colors.colorCoreLightGray};

    &:hover {
      cursor: pointer;
    }
  }
`;

const SectionBodyItem = styled.div`
  border-top: 1px solid ${colors.borderPrimary};
  padding: 10px 20px;

  span {
    display: inline-block;
    width: 100%;
    padding-right: ${dimensions.coreSpacing}px;
  }

  i {
    color: ${colors.colorCoreLightGray};
    position: absolute;
    right: ${dimensions.coreSpacing}px;

    &:hover {
      cursor: pointer;
    }
  }

  a {
    font-size: 12px;
  }

  ul li {
    margin-left: ${dimensions.coreSpacing}px;
  }
`;

const Action = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${dimensions.coreSpacing}px;
`;

export { InfoTitle, InfoDetail, Info, SectionBody, SectionBodyItem, Action };
