import FormControl from 'modules/common/components/form/Control';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import { FlexItem, LeftItem } from 'modules/common/components/step/styles';
import { LANGUAGES } from 'modules/settings/general/constants';
import React from 'react';
import Toggle from 'react-toggle';
import SelectBrand from '../../../containers/SelectBrand';

type Props = {
  onChange: (
    name:
      | 'brandId'
      | 'languageCode'
      | 'notifyCustomer'
      | 'requireAuth'
      | 'showChat'
      | 'showLauncher'
      | 'forceLogoutWhenResolve',
    value: string
  ) => void;
  brandId?: string;
  languageCode: string;
  notifyCustomer?: boolean;
  requireAuth?: boolean;
  showChat?: boolean;
  showLauncher?: boolean;
  forceLogoutWhenResolve?: boolean;
};

type State = {
  supporters?: any;
  languageCode?: string;
};

class Options extends React.Component<Props, State> {
  onChangeFunction = (name, value) => {
    this.setState({ [name]: value });
    this.props.onChange(name, value);
  };

  onInputChange = <T extends keyof State>(name: any, value: State[T]) => {
    this.setState({ [name]: value } as Pick<State, keyof State>);
    this.props.onChange(name, value);
  };

  renderToggle({
    label,
    onChange,
    checked
  }: {
    label: string;
    checked?: boolean;
    onChange: (e: React.FormEvent) => void;
  }) {
    return (
      <FormGroup>
        <ControlLabel>{label}</ControlLabel>
        <div>
          <Toggle
            className="wide"
            checked={checked}
            onChange={onChange}
            icons={{
              checked: <span>Yes</span>,
              unchecked: <span>No</span>
            }}
          />
        </div>
      </FormGroup>
    );
  }

  render() {
    const languageOnChange = e =>
      this.onInputChange(
        'languageCode',
        (e.currentTarget as HTMLInputElement).value
      );

    const brandOnChange = e => this.onChangeFunction('brandId', e.target.value);

    const notifyCustomerChange = e =>
      this.onChangeFunction('notifyCustomer', e.target.checked);

    const requireAuthChange = e =>
      this.onChangeFunction('requireAuth', e.target.checked);

    const showChatChange = e =>
      this.onChangeFunction('showChat', e.target.checked);

    const showLauncherChange = e =>
      this.onChangeFunction('showLauncher', e.target.checked);

    const forceLogoutWhenResolveChange = e =>
      this.onChangeFunction('forceLogoutWhenResolve', e.target.checked);

    return (
      <FlexItem>
        <LeftItem>
          <FormGroup>
            <ControlLabel>Default Language</ControlLabel>

            <FormControl
              componentClass="select"
              id="languageCode"
              defaultValue={this.props.languageCode}
              onChange={languageOnChange}
            >
              {LANGUAGES.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
            </FormControl>
          </FormGroup>

          <SelectBrand
            defaultValue={this.props.brandId}
            isRequired={true}
            onChange={brandOnChange}
          />

          {this.renderToggle({
            label: 'Require Authentication',
            checked: this.props.requireAuth,
            onChange: requireAuthChange
          })}

          {this.renderToggle({
            label: 'Show chat',
            checked: this.props.showChat,
            onChange: showChatChange
          })}

          {this.renderToggle({
            label: 'Show launcher',
            checked: this.props.showLauncher,
            onChange: showLauncherChange
          })}

          {this.renderToggle({
            label: 'Force logout when resolve',
            checked: this.props.forceLogoutWhenResolve,
            onChange: forceLogoutWhenResolveChange
          })}

          {this.renderToggle({
            label: 'Notify customer',
            checked: this.props.notifyCustomer,
            onChange: notifyCustomerChange
          })}
        </LeftItem>
      </FlexItem>
    );
  }
}

export default Options;
