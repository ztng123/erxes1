import React from 'react';
import { IAction } from '../../../../types';
import SegmentsForm from '@erxes/ui-segments/src/containers/form/SegmentsForm';
import { ScrolledContent } from '../../../../styles';

type Props = {
  activeAction: IAction;
  addAction: (action: IAction, id?: string, config?: any) => void;
  triggerType: string;
  closeModal: () => void;
};

type State = {
  queryLoaded: boolean;
  config?: any;
};

class IfForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      queryLoaded: false
    };
  }

  render() {
    const { activeAction, addAction, triggerType } = this.props;

    const config = activeAction.config || {};

    return (
      <ScrolledContent>
        <SegmentsForm
          {...this.props}
          contentType={triggerType || 'customer'}
          addConfig={addAction}
          closeModal={this.props.closeModal}
          activeTrigger={activeAction}
          id={config.contentId}
          hideDetailForm={true}
        />
      </ScrolledContent>
    );
  }
}

export default IfForm;
