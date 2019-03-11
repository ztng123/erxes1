import { getEnv } from 'apolloClient';
import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  Icon,
  Spinner
} from 'modules/common/components';
import { ModalFooter } from 'modules/common/styles/main';
import { __ } from 'modules/common/utils';
import { IBrand } from 'modules/settings/brands/types';
import { IAccount } from 'modules/settings/linkedAccounts/types';
import * as React from 'react';
import { SelectBrand } from '..';
import { LinkedAccountButton, Row } from '../../styles';
import { CreateFacebookMutationVariables, IPages } from '../../types';

type Props = {
  save: (
    params: CreateFacebookMutationVariables,
    callback?: () => void
  ) => void;
  onAccSelect: (doc: { appId?: string; accountId?: string }) => void;
  brands: IBrand[];
  pages: IPages[];
  accounts: IAccount[];
  closeModal: () => void;
};

class Facebook extends React.Component<Props, { loading: boolean }> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  onAccChange = () => {
    const accountId = (document.getElementById('acc') as HTMLInputElement)
      .value;

    if (accountId === '') {
      return;
    }

    this.props.onAccSelect({ accountId });
  };

  onFacebookRedirect = () => {
    const { REACT_APP_API_URL } = getEnv();
    const url = `${REACT_APP_API_URL}/fblogin`;

    window.location.replace(url);
  };

  collectCheckboxValues(name: string): string[] {
    const values: string[] = [];
    const elements = document.getElementsByName(name);

    // tslint:disable-next-line
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLInputElement;

      if (element.checked) {
        values.push(element.value);
      }
    }

    return values;
  }

  handleSubmit = e => {
    e.preventDefault();

    const doc: CreateFacebookMutationVariables = {
      name: (document.getElementById('name') as HTMLInputElement).value,
      brandId: (document.getElementById('selectBrand') as HTMLInputElement)
        .value,
      accountId: (document.getElementById('acc') as HTMLInputElement).value,
      pageIds: this.collectCheckboxValues('pages')
    };

    const callback = () => {
      this.setState({ loading: false }, () => this.props.closeModal());
    };

    this.setState({ loading: true });

    this.props.save(doc, callback);
  };

  render() {
    const { pages, brands, accounts } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        {this.state.loading && <Spinner />}
        <FormGroup>
          <ControlLabel required={true}>Name</ControlLabel>

          <FormControl id="name" type="text" required={true} />
        </FormGroup>

        <SelectBrand brands={brands} />

        <FormGroup>
          <ControlLabel required={true}>Linked Accounts</ControlLabel>

          <Row>
            <FormControl
              componentClass="select"
              placeholder={__('Select account')}
              onChange={this.onAccChange}
              id="acc"
            >
              <option value="">Select account ...</option>

              {accounts.map((account, index) => (
                <option key={`account${index}`} value={account._id}>
                  {account.name}
                </option>
              ))}
            </FormControl>
            <LinkedAccountButton onClick={this.onFacebookRedirect}>
              <Icon icon="plus" />
            </LinkedAccountButton>
          </Row>
        </FormGroup>

        <FormGroup>
          <ControlLabel required={true}>Pages</ControlLabel>

          {pages.map(page => (
            <div key={page.id}>
              <FormControl
                componentClass="checkbox"
                name="pages"
                key={page.id}
                value={page.id}
              >
                {page.name}
              </FormControl>
            </div>
          ))}
        </FormGroup>

        <ModalFooter>
          <Button btnStyle="success" type="submit" icon="checked-1">
            Save
          </Button>
        </ModalFooter>
      </form>
    );
  }
}

export default Facebook;
