import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StepItem,
  FullStep,
  StepHeaderContainer,
  StepHeader,
  StepImg,
  StepHeaderTitle,
  StepContent,
  ShortStep
} from './Style';
import { Button } from 'modules/common/components';

const propTypes = {
  brands: PropTypes.array,
  users: PropTypes.array,
  save: PropTypes.func,
  kind: PropTypes.string
};

class Step extends Component {
  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.saveLive = this.saveLive.bind(this);
    this.saveDraft = this.saveDraft.bind(this);
  }

  showStep(step) {
    this.setState({ step });
  }

  save(e) {
    const doc = this.generateDoc(e);
    this.props.save(doc);
  }

  saveLive(e) {
    const doc = this.generateDoc(e);
    this.props.save({ isLive: true, isDraft: false, ...doc });
  }

  saveDraft(e) {
    const doc = this.generateDoc(e);
    this.props.save({ isLive: false, isDraft: true, ...doc });
  }

  renderTitle() {
    const { kind } = this.props;
    let title = 'Visitor auto message';
    if (kind === 'auto') {
      title = 'Auto message';
    } else if (kind === 'manual') {
      title = 'Manual message';
    }
    const breadcrumb = [{ title: 'Engage', link: '/engage' }, { title: title }];
    return breadcrumb;
  }

  renderStep(step, img, title, hasNext, content) {
    let next = '';

    if (hasNext) {
      next = (
        <Button
          btnStyle="default"
          size="small"
          icon="ios-arrow-forward"
          onClick={() => this.showStep(step + 1)}
        >
          Next
        </Button>
      );
    }

    let show = false;

    if (this.state.step === step) {
      show = true;
    }

    return (
      <StepItem show={show}>
        <FullStep show={show}>
          <StepHeaderContainer>
            <StepHeader>
              <StepImg>{img}</StepImg>
              <StepHeaderTitle>{title}</StepHeaderTitle>
            </StepHeader>
            {next}
          </StepHeaderContainer>
          <StepContent>{content}</StepContent>
        </FullStep>
        <ShortStep show={!show} onClick={() => this.showStep(step)}>
          <StepImg>{img}</StepImg>
        </ShortStep>
      </StepItem>
    );
  }
}

Step.propTypes = propTypes;

export default Step;
