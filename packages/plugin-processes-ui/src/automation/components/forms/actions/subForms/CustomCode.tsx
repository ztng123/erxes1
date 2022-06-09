import { __ } from 'coreui/utils';
import React from 'react';

import { ControlLabel } from '@erxes/ui/src/components/form';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import Info from '@erxes/ui/src/components/Info';
import Label from '@erxes/ui/src/components/Label';
import { FormColumn, FormWrapper } from '@erxes/ui/src/styles/main';

import { IJob } from '../../../../../flow/types';
import { IJobRefer } from '../../../../../job/types';
import { DrawerDetail } from '../../../../styles';
import Common from '../Common';

type Props = {
  closeModal: () => void;
  onSave: () => void;
  activeAction?: IJob;
  jobRefers: IJobRefer[];
  actions: IJob[];
  addAction: (action: IJob, actionId?: string, jobReferId?: string) => void;
};

type State = {
  jobReferId: string;
  description: string;
};

class Delay extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { jobReferId, description } = this.props.activeAction;

    this.state = {
      jobReferId: jobReferId ? jobReferId : '',
      description: description ? description : ''
    };

    console.log(
      'this.props.activeAction on constructor:',
      this.props.activeAction
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeAction !== this.props.activeAction) {
      this.setState({ jobReferId: nextProps.activeAction.jobReferId });
    }
  }

  renderLabelInfo = (style, text) => {
    return <Label lblStyle={style}>{text}</Label>;
  };

  renderProducts = (products, type, matchProducts = undefined) => {
    const style = type === 'need' ? 'simple' : 'default';
    const space = '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0';

    return products.map(product => {
      const name = product.product.name;
      const matchResult = matchProducts
        ? matchProducts.includes(name)
        : matchProducts;

      return (
        <>
          <FormGroup>
            <ControlLabel key={product.id}>
              {space} -{matchResult === undefined && name}
              {matchResult === true && name}
              {matchResult === false && this.renderLabelInfo('danger', name)}
              {/* {this.renderLabelInfo(style, type)} */}
            </ControlLabel>
          </FormGroup>
        </>
      );
    });
  };

  renderActions = (
    chosenActions: IJob[],
    jobRefers,
    type,
    beforeActions: IJob[]
  ) => {
    let beforeResultProducts = [];
    if (beforeActions.length) {
      for (const before of beforeActions) {
        const jobRefer = jobRefers.find(job => job._id === before.jobReferId);
        const resultProducts = jobRefer.resultProducts || [];
        const productNames = resultProducts.map(e => e.product.name);

        beforeResultProducts = beforeResultProducts.concat(productNames);
      }
    }

    console.log('beforeResultProducts', beforeResultProducts);

    return chosenActions.map(action => {
      if (!action.jobReferId) {
        return [];
      }

      const jobRefer = jobRefers.find(job => job._id === action.jobReferId);
      const needProducts = jobRefer.needProducts || [];
      const resultProducts = jobRefer.resultProducts || [];

      return (
        <>
          <Info type="primary" title="">
            <FormGroup>
              <ControlLabel key={action.id}>{action.label}</ControlLabel>
            </FormGroup>
            {type === 'next' && this.renderProducts(needProducts, 'need')}
            {type === 'prev' && this.renderProducts(resultProducts, 'result')}
            {type === 'cur' &&
              this.renderProducts(needProducts, 'need', beforeResultProducts)}
            {/* {type === 'cur' && this.renderProducts(resultProducts, 'result')} */}
          </Info>
        </>
      );
    });
  };

  renderContent() {
    const { jobRefers, actions, activeAction } = this.props;

    const beforeActions = actions.filter(e =>
      e.nextJobIds.includes(activeAction.id)
    );

    // const afterActions = actions.filter(
    //   e => e.id === activeAction.nextJobIds[0]
    // );

    const onChangeValue = (type, e) => {
      this.setState({ [type]: e.target.value });
    };

    return (
      <DrawerDetail>
        <FormGroup>
          <ControlLabel>Job</ControlLabel>
          <FormControl
            name="type"
            componentClass="select"
            onChange={onChangeValue.bind(this, 'jobReferId')}
            required={true}
            value={this.state.jobReferId}
          >
            <option value="" />
            {jobRefers.map(jobRefer => (
              <option key={jobRefer._id} value={jobRefer._id}>
                {jobRefer.name}
              </option>
            ))}
          </FormControl>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl
            name="description"
            value={this.state.description}
            onChange={onChangeValue.bind(this, 'description')}
          />
        </FormGroup>

        <FormWrapper>
          <FormColumn>
            <Info type="primary" title="Result products">
              {this.renderActions(beforeActions, jobRefers, 'prev', [])}
            </Info>
          </FormColumn>

          <FormColumn>
            <Info type="success" title="Need products">
              {this.renderActions(
                [activeAction],
                jobRefers,
                'cur',
                beforeActions
              )}
            </Info>
          </FormColumn>

          {/*
          If you want to show next Job report on jobForm 
          when double click job instance , 
          please uncomment below.
          */}

          {/* <FormColumn>
            <Info type="info" title="Next">
              {this.renderActions(afterActions, jobRefers, 'next')}
            </Info>
          </FormColumn> */}
        </FormWrapper>
      </DrawerDetail>
    );
  }

  render() {
    const { jobReferId, description } = this.state;

    return (
      <Common jobReferId={jobReferId} description={description} {...this.props}>
        {this.renderContent()}
      </Common>
    );
  }
}

export default Delay;
