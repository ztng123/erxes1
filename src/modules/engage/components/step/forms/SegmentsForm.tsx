import { IButtonMutateProps } from 'modules/common/types';
import { Form } from 'modules/segments/components/common';
import {
  ISegment,
  ISegmentDoc,
  ISegmentField,
  ISegmentWithConditionDoc
} from 'modules/segments/types';
import * as React from 'react';

type Props = {
  fields: ISegmentField[];
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  headSegments: ISegment[];
  count: (segment: ISegmentDoc) => void;
  afterSave: () => void;
};

const SegmentsForm = (props: Props) => {
  const { fields, renderButton, headSegments, count, afterSave } = props;

  return (
    <Form
      fields={fields}
      renderButton={renderButton}
      headSegments={headSegments}
      count={count}
      afterSave={afterSave}
    />
  );
};

export default SegmentsForm;
