import React from 'react';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  __,
  Toggle,
  Button,
  colors,
  Icon
} from '@erxes/ui/src';
import { DrawerDetail } from '@erxes/ui-automations/src/styles';
import SelectFields from '@erxes/ui-automations/src/containers/forms/actions/SelectFields';
import { IAction } from '@erxes/ui-automations/src/types';
import { LinkButton } from '@erxes/ui/src/styles/main';
import { Columns } from '@erxes/ui/src/styles/chooser';
import Common from '@erxes/ui-automations/src/components/forms/actions/Common';
import { EndColumn, FirstColumn, ListItem } from '../styles';
import Select from 'react-select-plus';

type Props = {
  activeAction: IAction;
  triggerType: string;
  closeModal: () => void;
  addAction: (action: IAction, actionId?: string, config?: any) => void;
};

type State = {
  config: any;
  useSpecifiedFields: boolean;
};

const RESP_METHODS = [
  {
    value: 'POST',
    label: 'POST'
  },
  {
    value: 'PUT',
    label: 'PUT'
  },
  {
    value: 'DELETE',
    label: 'DELETE'
  },
  {
    value: 'PATCH',
    label: 'PATCH'
  }
];

class SendWebhook extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { activeAction } = props;

    this.state = {
      useSpecifiedFields: false,
      config: activeAction?.config || {}
    };
  }

  onChange(config) {
    this.setState({ config });
  }

  renderHeader(header) {
    const { config } = this.state;

    const { headers } = config || {};

    const onChange = e => {
      const { name, value } = e.currentTarget as HTMLInputElement;

      const updatedHeaders = headers.map(h =>
        h._id === header._id ? { ...h, [name]: value } : h
      );

      this.setState({ config: { ...config, headers: updatedHeaders } });
    };

    const handleRemove = () => {
      const updatedHeaders = headers.filter(h => h._id !== header._id);
      this.setState({ config: { ...config, headers: updatedHeaders } });
    };

    return (
      <ListItem key={header._id}>
        <Columns>
          <FirstColumn>
            <FormGroup>
              <FormControl
                name="key"
                placeholder="key"
                value={header?.key}
                onChange={onChange}
              />
            </FormGroup>
          </FirstColumn>
          <EndColumn>
            <FormGroup>
              <FormControl
                name="value"
                value={header?.value}
                placeholder="value"
                onChange={onChange}
              />
            </FormGroup>
          </EndColumn>
          <Button
            icon="trash-alt"
            iconColor={colors.colorCoreRed}
            btnStyle="link"
            onClick={handleRemove}
          />
        </Columns>
      </ListItem>
    );
  }

  renderHeaders() {
    const { config } = this.state;

    const addHeader = () => {
      this.setState({
        config: {
          ...config,
          headers: [
            ...(config?.headers || []),
            { _id: Math.random(), key: '', value: '' }
          ]
        }
      });
    };

    return (
      <>
        {(config?.headers || []).map(header => this.renderHeader(header))}
        <LinkButton onClick={addHeader}>
          <Icon icon="plus-1" />
          {'Add header'}
        </LinkButton>
      </>
    );
  }

  render() {
    const { triggerType, closeModal, activeAction, addAction } = this.props;
    const { useSpecifiedFields, config } = this.state;

    const onChangeFields = rConf => {
      this.setState({
        config: {
          ...config,
          specifiedFields: { ...(config?.specifiedFields || {}), ...rConf }
        }
      });
    };

    const handleChange = e => {
      const { name, value } = e.currentTarget as HTMLInputElement;

      this.onChange({ ...config, [name]: value });
    };

    const handleSelect = (value, name) => {
      this.onChange({ ...config, [name]: value });
    };

    return (
      <DrawerDetail>
        <Common
          closeModal={closeModal}
          addAction={addAction}
          activeAction={activeAction}
          config={config}
        >
          <Columns>
            <FirstColumn>
              <FormGroup>
                <ControlLabel>{__('Method')}</ControlLabel>

                <Select
                  value={config?.method || 'POST'}
                  options={RESP_METHODS}
                  name="method"
                  clearable={false}
                  onChange={handleSelect}
                />
              </FormGroup>
            </FirstColumn>
            <EndColumn>
              <FormGroup>
                <ControlLabel required>{__('Post Url')}</ControlLabel>
                <FormControl
                  name="url"
                  value={config?.url}
                  placeholder="https://erxes.io/..."
                  onChange={handleChange}
                />
              </FormGroup>
            </EndColumn>
          </Columns>

          <DrawerDetail>
            <ControlLabel>{__('Headers (optional)  ')}</ControlLabel>
            {this.renderHeaders()}
          </DrawerDetail>
          <FormGroup>
            <ControlLabel>{__('Use specified fields')}</ControlLabel>
            <Toggle
              onChange={() =>
                this.setState({
                  useSpecifiedFields: !useSpecifiedFields,
                  config: { url: config?.url || '' }
                })
              }
            />
          </FormGroup>

          {useSpecifiedFields && (
            <SelectFields
              config={config?.specifiedFields || {}}
              triggerType={triggerType}
              onSelect={onChangeFields}
              actionType={triggerType}
              label="Add Fields"
              withDefaultValue={true}
            />
          )}
        </Common>
      </DrawerDetail>
    );
  }
}

export default SendWebhook;
