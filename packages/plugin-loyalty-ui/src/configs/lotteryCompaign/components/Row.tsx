import { FormControl, TextInfo, ModalTrigger, Icon } from '@erxes/ui/src/components';
import React from 'react';
import Form from '../containers/Form';
import { ILotteryCompaign } from '../types';
import { Link } from 'react-router-dom';

type Props = {
  lotteryCompaign: ILotteryCompaign;
  history: any;
  isChecked: boolean;
  toggleBulk: (lotteryCompaign: ILotteryCompaign, isChecked?: boolean) => void;
};

class Row extends React.Component<Props> {
  modalContent = props => {
    const { lotteryCompaign } = this.props;

    const updatedProps = {
      ...props,
      lotteryCompaign
    }

    return (
      <Form {...updatedProps} />
    )
  };

  render() {
    const { lotteryCompaign, history, toggleBulk, isChecked } = this.props;

    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(lotteryCompaign, e.target.checked);
      }
    };

    const onClick = e => {
      e.stopPropagation();
    };

    const {
      _id,
      title,
      startDate,
      endDate,
      finishDateOfUse,
      status,

    } = lotteryCompaign;

    const trigger = (
      <tr key={_id}>
        <td onClick={onClick}>
          <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>{title}</td>
        <td>{new Date(startDate).toLocaleDateString()}</td>
        <td>{new Date(endDate).toLocaleDateString()}</td>
        <td>{new Date(finishDateOfUse).toLocaleDateString()}</td>
        <td>
          <TextInfo>{status}</TextInfo>
        </td>
        <td onClick={onClick}>
          <Link to={`/erxes-plugin-loyalty/lotteries?compaignId=${_id}`}>
            <Icon icon='list-2' />
          </Link>
          <span> </span>
          <Link to={`/erxes-plugin-loyalty/lottery/${_id}`}>
            <Icon icon='award' />
          </Link>
        </td>
      </tr>
    )

    return (
      <ModalTrigger
        size={'lg'}
        title="Edit lottery compaign"
        trigger={trigger}
        autoOpenKey="showProductModal"
        content={this.modalContent}
      />

    );
  }
}

export default Row;
