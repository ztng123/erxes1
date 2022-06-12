import * as compose from 'lodash.flowright';
import React from 'react';

import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils';
import From from '../components/SafeRemainderForm';
import { mutations } from '../graphql';

type Props = {
  closeModal: () => void;
  history: any;
};

type FinalProps = {} & Props;

class SafeRemainderFormContainer extends React.Component<FinalProps> {
  render() {
    const { history } = this.props;
    const renderButton = ({
      name,
      values,
      isSubmitted,
      callback
    }: IButtonMutateProps) => {
      const callBack = data => {
        if (callback) {
          callback(data);
        }

        history.push(
          `/inventories/safe-remainders/details/${data.createSafeRemainder._id}`
        );
      };

      return (
        <ButtonMutate
          mutation={mutations.createSafeRemainder}
          variables={values}
          callback={callBack}
          refetchQueries={getRefetchQueries()}
          isSubmitted={isSubmitted}
          type="submit"
          uppercase={false}
          successMessage={`You successfully added a ${name}`}
        />
      );
    };

    const updatedProps = {
      ...this.props,
      renderButton
    };

    return <From {...updatedProps} />;
  }
}

const getRefetchQueries = () => {
  return ['safeRemainders'];
};

export default withProps<Props>(compose()(SafeRemainderFormContainer));
