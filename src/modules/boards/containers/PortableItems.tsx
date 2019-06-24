import gql from 'graphql-tag';
import { ButtonMutate } from 'modules/common/components';
import { IButtonMutateProps } from 'modules/common/types';
import { Alert, renderWithProps } from 'modules/common/utils';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { Items } from '../components/portable';
import { IOptions, ItemsQueryResponse } from '../types';

type IProps = {
  customerIds?: string[];
  companyIds?: string[];
  isOpen?: boolean;
  options: IOptions;
};

type FinalProps = {
  itemsQuery: ItemsQueryResponse;
} & IProps;

class PortableItemsContainer extends React.Component<FinalProps> {
  renderButton = ({ values, isSubmitted, callback }: IButtonMutateProps) => {
    const { options, itemsQuery } = this.props;

    return (
      <ButtonMutate
        mutation={options.mutations.addMutation}
        variables={values}
        callback={callback}
        refetchQueries={itemsQuery.refetch()}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={options.texts.addSuccessText}
      />
    );
  };

  onChangeItems = () => {
    const { itemsQuery } = this.props;

    itemsQuery.refetch();
  };

  render() {
    const { itemsQuery, options } = this.props;

    if (!itemsQuery) {
      return null;
    }

    const items = itemsQuery[options.queriesName.itemsQuery] || [];

    const extendedProps = {
      ...this.props,
      items,
      renderButton: this.renderButton,
      onChangeItems: this.onChangeItems
    };

    return <Items {...extendedProps} />;
  }
}

export default (props: IProps) =>
  renderWithProps<IProps>(
    props,
    compose(
      graphql<
        IProps,
        ItemsQueryResponse,
        { customerIds?: string[]; companyIds?: string[] }
      >(gql(props.options.queries.itemsQuery), {
        name: 'itemsQuery',
        skip: ({ customerIds, companyIds }) => !customerIds && !companyIds,
        options: ({ customerIds, companyIds }) => ({
          variables: {
            customerIds,
            companyIds
          }
        })
      })
    )(PortableItemsContainer)
  );
