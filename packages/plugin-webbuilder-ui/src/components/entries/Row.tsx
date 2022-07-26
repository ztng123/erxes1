import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import { Link } from 'react-router-dom';
import { __ } from 'coreui/utils';
import Button from '@erxes/ui/src/components/Button';
import Icon from '@erxes/ui/src/components/Icon';
import Tip from '@erxes/ui/src/components/Tip';
import React, { useState, useEffect } from 'react';

type Props = {
  entry: any;
  remove: (_id: string) => void;
  contentType: any;
};

function Row(props: Props) {
  const { entry, contentType, remove } = props;
  const { fields = [] } = contentType;
  const { values = [] } = entry;

  const [data, setData] = useState({});

  useEffect(() => {
    values.forEach(val => {
      setData(dat => ({ ...dat, [val.fieldCode]: val.value }));
    });
  }, [values]);

  const renderEditAction = () => {
    return (
      <Link to={`edit/${entry.contentTypeId}/${entry._id}`}>
        <Button btnStyle="link">
          <Tip text={__('Manage')} placement="top">
            <Icon icon="edit-3" />
          </Tip>
        </Button>
      </Link>
    );
  };

  const renderRemoveAction = (item: any) => {
    const onClick = () => remove(item._id);

    return (
      <Tip text={__('Delete')} placement="top">
        <Button btnStyle="link" onClick={onClick} icon="times-circle" />
      </Tip>
    );
  };

  return (
    <tr>
      {fields.map((val, i) => {
        if (i > 2) {
          return;
        }

        return <td key={val.code}>{data[val.code] || ''}</td>;
      })}
      <td>
        <ActionButtons>
          {renderEditAction()}
          {renderRemoveAction(entry)}
        </ActionButtons>
      </td>
    </tr>
  );
}

export default Row;
