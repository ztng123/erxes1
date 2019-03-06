import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  Info
} from 'modules/common/components';
import { ModalFooter } from 'modules/common/styles/main';
import { IForm } from 'modules/forms/types';
import * as React from 'react';
import { __ } from '../../../../common/utils';
import { IIntegration } from '../../types';

type Props = {
  save: (
    params: { name: string; integrationId: string; formId: string },
    callback: () => void
  ) => void;
  integrations: IIntegration[];
  leads: IForm[];
  closeModal: () => void;
};

class Lead extends React.Component<Props> {
  generateDoc() {
    return {
      name: (document.getElementById('name') as HTMLInputElement).value,
      integrationId: (document.getElementById(
        'selectIntegration'
      ) as HTMLInputElement).value,
      formId: (document.getElementById('selectLead') as HTMLInputElement).value
    };
  }

  handleSubmit = e => {
    e.preventDefault();

    this.props.save(this.generateDoc(), this.props.closeModal);
  };

  onIntegrationsChange = integrations => {
    this.setState({ integrations: integrations.map(el => el.value) });
  };

  render() {
    const { integrations, leads, closeModal } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <Info>
          {__(
            'Add a Lead here and see it on your Messenger Widget! In order to see Leads in your inbox, please make sure it is added in your channel.'
          )}
        </Info>
        <FormGroup>
          <ControlLabel required={true}>Name</ControlLabel>

          <FormControl id="name" type="text" required={true} autoFocus={true} />
        </FormGroup>

        <FormGroup>
          <ControlLabel required={true}>Messenger integration</ControlLabel>

          <FormControl componentClass="select" id="selectIntegration">
            <option />
            {integrations.map(i => (
              <option key={i._id} value={i._id}>
                {i.name}
              </option>
            ))}
          </FormControl>
        </FormGroup>

        <FormGroup>
          <ControlLabel required={true}>Lead</ControlLabel>

          <FormControl componentClass="select" id="selectLead">
            <option />
            {leads.map(lead => (
              <option key={lead._id} value={lead._id}>
                {lead.title}
              </option>
            ))}
          </FormControl>
        </FormGroup>

        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={closeModal}
            icon="cancel-1"
          >
            Cancel
          </Button>
          <Button btnStyle="success" type="submit" icon="checked-1">
            Save
          </Button>
        </ModalFooter>
      </form>
    );
  }
}

export default Lead;
