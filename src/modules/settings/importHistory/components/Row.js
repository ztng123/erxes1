import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'modules/common/components';
import { confirm } from 'modules/common/utils';

const propTypes = {
  history: PropTypes.object,
  removeHistory: PropTypes.func
};

function HistoryRow({ history, removeHistory }) {
  const { user = {} } = history;
  const { details = {} } = user;

  return (
    <tr>
      <td>{history.success || 0}</td>
      <td>{history.failed || 1}</td>
      <td>{history.total || 1}</td>
      <td>{history.date || 1}</td>
      <td>{details.fullName || '-'}</td>
      <td>
        <Button
          btnStyle="link"
          icon="cancel-1"
          onClick={() =>
            confirm().then(() => {
              removeHistory(history._id);
            })
          }
        />
      </td>
    </tr>
  );
}

HistoryRow.propTypes = propTypes;

export default HistoryRow;
