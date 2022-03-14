import Button from '@erxes/ui/src/components/Button';
import { FormControl } from '@erxes/ui/src/components/form';
import Icon from '@erxes/ui/src/components/Icon';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Tags from '@erxes/ui/src/components/Tags';
import Tip from '@erxes/ui/src/components/Tip';
import WithPermission from '@erxes/ui/src/components/WithPermission';
import { __ } from '@erxes/ui/src/utils';
import React from 'react';

import { PRODUCT_TEMPLATE_STATUSES } from '../../constants';
import Form from '../../containers/product/ProductForm';
import { IProductTemplate } from '../../types';

type Props = {
  productTemplate: IProductTemplate;
  history: any;
  isChecked: boolean;
  toggleBulk: (productTemplate: IProductTemplate, isChecked?: boolean) => void;
  changeStatus: (_id: string, status: string) => void;
  duplicateTemplate: (_id: string) => void;
};

class Row extends React.Component<Props> {
  renderChangeStatusAction(_id: string, status: string) {
    const { changeStatus } = this.props;
    const isactive = status === PRODUCT_TEMPLATE_STATUSES.ACTIVE;
    const tipText = isactive ? 'Archive' : 'Active';

    if (!changeStatus) {
      return null;
    }

    const onClick = () => changeStatus(_id, status);

    return (
      <WithPermission action="integrationsArchive">
        <Tip text={__(tipText)} placement="top">
          <Button btnStyle="link" onClick={onClick}>
            <Icon icon={isactive ? 'archive-alt' : 'redo'} />
          </Button>
        </Tip>
      </WithPermission>
    );
  }

  renderDuplicateTemplateAction(_id: string) {
    const { duplicateTemplate } = this.props;

    if (!duplicateTemplate) {
      return null;
    }

    const onClick = () => duplicateTemplate(_id);

    return (
      <WithPermission action="integrationsArchive">
        <Tip text={__('Duplicate')} placement="top">
          <Button btnStyle="link" onClick={onClick}>
            <Icon icon="copy" />
          </Button>
        </Tip>
      </WithPermission>
    );
  }

  renderFormTrigger = (trigger: React.ReactNode, thisProps) => {
    const modalContent = props => (
      <Form {...props} productTemplate={thisProps.productTemplate} />
    );

    return (
      <ModalTrigger
        title="Edit template"
        content={modalContent}
        trigger={trigger}
        autoOpenKey="showProductModal"
        size="lg"
      />
    );
  };

  renderEditAction = props => {
    const trigger = (
      <Button btnStyle="link">
        <Tip text={__('Edit')} placement="top">
          <Icon icon="edit-3" />
        </Tip>
      </Button>
    );

    return this.renderFormTrigger(trigger, props);
  };

  render() {
    const { productTemplate, toggleBulk, isChecked } = this.props;
    const { _id, status, title, description, templateItems } = productTemplate;

    const tags = productTemplate.tags || [];

    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(productTemplate, e.target.checked);
      }
    };

    return (
      <tr>
        <td>
          <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>{title}</td>
        <td>{description}</td>
        <td>{templateItems.length}</td>
        <td>
          <Tags tags={tags} limit={2} />
        </td>
        <td>
          {this.renderEditAction(this.props)}
          {this.renderDuplicateTemplateAction(_id)}
          {this.renderChangeStatusAction(_id, status)}
        </td>
      </tr>
    );
  }
}

export default Row;
