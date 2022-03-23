import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from 'react-apollo';
import { ButtonMutate } from '@erxes/ui/src/components';
import { withProps} from '@erxes/ui/src/utils';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import From from '../components/Form';
import { mutations, queries } from '../graphql';
import { ILotteryCompaign } from '../types';
import { queries as voucherCompaignQueries } from '../../voucherCompaign/graphql';
import { VoucherCompaignQueryResponse } from '../../voucherCompaign/types';

type Props = {
  lotteryCompaign?: ILotteryCompaign;
  closeModal: () => void;
};

type FinalProps = {
  voucherCompaignsQuery: VoucherCompaignQueryResponse;
} & Props;

class ProductFormContainer extends React.Component<FinalProps> {
  render() {
    const { voucherCompaignsQuery } = this.props;

    if (voucherCompaignsQuery.loading) {
      return null;
    }

    const renderButton = ({
      name,
      values,
      isSubmitted,
      callback,
      object
    }: IButtonMutateProps) => {
      const attachmentMoreArray: any[] = [];
      const attachment = values.attachment || undefined;
      const attachmentMore = values.attachmentMore || [];

      attachmentMore.map(attachment => {
        attachmentMoreArray.push({ ...attachment, __typename: undefined });
      })

      values.attachment = attachment ? { ...attachment, __typename: undefined } : null;
      values.attachmentMore = attachmentMoreArray;

      return (
        <ButtonMutate
          mutation={object && object._id ? mutations.lotteryCompaignsEdit : mutations.lotteryCompaignsAdd}
          variables={values}
          callback={callback}
          refetchQueries={getRefetchQueries()}
          isSubmitted={isSubmitted}
          type="submit"
          uppercase={false}
          successMessage={`You successfully ${object ? 'updated' : 'added'
            } a ${name}`}
        />
      );
    };

    const voucherCompaigns = voucherCompaignsQuery.voucherCompaigns || [];

    const updatedProps = {
      ...this.props,
      renderButton,
      voucherCompaigns,
    };

    return <From {...updatedProps} />;
  }
}

const getRefetchQueries = () => {
  return ['lotteryCompaigns'];
};

export default withProps<Props>(
  compose(
    graphql<Props, VoucherCompaignQueryResponse>(
      gql(voucherCompaignQueries.voucherCompaigns),
      {
        name: 'voucherCompaignsQuery'
      }
    ),
  )(ProductFormContainer)
);
