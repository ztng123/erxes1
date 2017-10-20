import React from 'react';
import PropTypes from 'prop-types';
import Avatar from './Avatar';

const propTypes = {
  user: PropTypes.object,
  customer: PropTypes.object,
  singleLine: PropTypes.bool,
  firstLine: PropTypes.node,
  secondLine: PropTypes.node,
  avatarSize: PropTypes.number,
  url: PropTypes.string,
};

function NameCard({ user, customer, firstLine, secondLine, singleLine, avatarSize, url }) {
  let first;
  let second;

  if (user || firstLine || secondLine) {
    first = firstLine || (user.details && user.details.fullName);
    second = !singleLine && (secondLine || `@${user.username}`);
  } else if (customer) {
    first =
      firstLine || customer.name || (singleLine && (customer.name || customer.email || 'N/A'));
    second = !singleLine && (secondLine || customer.email || 'N/A');
  }

  return (
    <div className="name-card">
      <Avatar user={user} customer={customer} size={avatarSize} />
      <div className="text">
        <a href={url ? url : '#'} className="first-line">
          {first}
        </a>
        <div className="second-line">
          {second}
        </div>
      </div>
    </div>
  );
}

NameCard.propTypes = propTypes;
NameCard.Avatar = Avatar;

export default NameCard;
