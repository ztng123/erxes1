import { ButtonMutate } from 'modules/common/components';
import { IButtonMutateProps } from 'modules/common/types';
import { __, Alert } from 'modules/common/utils';
import * as React from 'react';
import { ChangePassword } from '../components';
import { usersChangePassword } from '../graphql/mutations';

type Props = {
  closeModal: () => void;
};

const ChangePasswordContainer = (props: Props) => {
  const renderButton = ({
    values,
    isSubmitted,
    callback
  }: IButtonMutateProps) => {
    if (values.newPassword !== values.confirmation) {
      return;
    }

    return (
      <ButtonMutate
        mutation={usersChangePassword}
        variables={values}
        callback={callback}
        isSubmitted={isSubmitted}
        type="submit"
        icon="checked-1"
        successMessage={'Your password has been changed and updated'}
      >
        {__('Save')}
      </ButtonMutate>
    );
  };

  const updatedProps = {
    ...props,
    renderButton
  };

  return <ChangePassword {...updatedProps} />;
};

export default ChangePasswordContainer;
