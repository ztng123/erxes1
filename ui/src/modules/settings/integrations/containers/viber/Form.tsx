import ButtonMutate from "modules/common/components/ButtonMutate";
import { IButtonMutateProps, IRouterProps } from "modules/common/types";
import Viber from "modules/settings/integrations/components/viber/Viber";
import { mutations } from "modules/settings/integrations/graphql";
import React from "react";
import { withRouter } from "react-router";

type Props = {
  type?: string;
  closeModal: () => void;
};

type FinalProps = {} & IRouterProps & Props;

class ViberContainer extends React.Component<FinalProps> {
  renderButton = ({
    name,
    values,
    isSubmitted,
    callback
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={mutations.integrationsCreateExternalIntegration}
        variables={values}
        callback={callback}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully added a ${name}`}
      />
    );
  };

  render() {
    const { closeModal } = this.props;

    const updatedProps = {
      closeModal,
      renderButton: this.renderButton
    };

    return <Viber {...updatedProps} />;
  }
}

export default withRouter<FinalProps>(ViberContainer);
