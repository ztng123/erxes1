import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Form from './Form';
import React from 'react';
import Button from '@erxes/ui/src/components/Button';
import Tip from '@erxes/ui/src/components/Tip';
import Icon from '@erxes/ui/src/components/Icon';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import { IDocument, IType } from '../types';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import { FormControl } from '@erxes/ui/src/components/form';
import { colors, dimensions } from '@erxes/ui/src/styles';

const DocumentNameStyled = styledTS<{ checked: boolean }>(styled.div).attrs({})`
    color: ${colors.colorCoreBlack};
    text-decoration: ${props => (props.checked ? 'line-through' : 'none')}
    `;

export const DocumentWrapper = styledTS<{ space: number }>(
  styled.div
)`padding-left: ${props => props.space * 20}px;
  display:inline-flex;
  justify-content:flex-start;
  align-items: center;
`;

const Margin = styledTS(styled.div)`
 margin: ${dimensions.unitSpacing}px;
`;

type Props = {
  document: IDocument;
  space: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  documents: IDocument[];
  remove: (document: IDocument) => void;
  edit: (document: IDocument) => void;
  types?: IType[];
};

type State = {
  checked: boolean;
};

class Row extends React.Component<Props, State> {
  Documents({ document, checked }) {
    return <DocumentNameStyled checked={checked}>{document.name}</DocumentNameStyled>;
  }

  removeDocument = () => {
    const { remove, document } = this.props;

    remove(document);
  };

  toggleCheck = () => {
    const { edit, document } = this.props;

    edit({ _id: document._id, checked: !document.checked });
  };

  render() {
    const { document, renderButton, space, documents, types } = this.props;

    const editTrigger = (
      <Button btnStyle='link'>
        <Tip text={__('Edit')} placement='top'>
          <Icon icon='edit-3'></Icon>
        </Tip>
      </Button>
    );

    const content = props => (
      <Form
        {...props}
        types={types}
        document={document}
        renderButton={renderButton}
        documents={documents}
      />
    );

    const extractDate = document.expiryDate
      ? document.expiryDate?.toString().split('T')[0]
      : '-';

    return (
      <tr>
        <td>
          <DocumentWrapper space={space}>
            <FormControl
              componentClass='checkbox'
              onChange={this.toggleCheck}
              color={colors.colorPrimary}
              defaultChecked={document.checked || false}
            ></FormControl>
            <Margin>
              <this.Documents document={document} checked={document.checked || false} />
            </Margin>
          </DocumentWrapper>
        </td>
        <td>{extractDate}</td>
        <td>
          <ActionButtons>
            <ModalTrigger
              title='Edit document'
              trigger={editTrigger}
              content={content}
            />

            <Tip text={__('Delete')} placement='top'>
              <Button
                btnStyle='link'
                onClick={this.removeDocument}
                icon='times-circle'
              />
            </Tip>
          </ActionButtons>
        </td>
      </tr>
    );
  }
}

export default Row;
