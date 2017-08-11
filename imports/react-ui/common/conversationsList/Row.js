import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { FlowRouter } from 'meteor/kadira:flow-router';
import strip from 'strip';
import { NameCard, Tags } from '/imports/react-ui/common';
import { Tags as TagsCollection } from '/imports/api/tags/tags';
import Starrer from './StarrerContainer';
import Participate from './ParticipateContainer';
import Assignees from './Assignees';

const propTypes = {
  conversation: PropTypes.object.isRequired,
  toggleBulk: PropTypes.func,
  starred: PropTypes.bool.isRequired,
  channelId: PropTypes.string,
  isRead: PropTypes.bool,
  isParticipated: PropTypes.bool,
};

class Row extends Component {
  constructor(props) {
    super(props);

    this.goDetail = this.goDetail.bind(this);
    this.toggleBulk = this.toggleBulk.bind(this);
    this.renderCheckbox = this.renderCheckbox.bind(this);
  }

  toggleBulk(e) {
    const { toggleBulk, conversation } = this.props;
    toggleBulk(conversation, e.target.checked);
  }

  goDetail() {
    const { conversation, channelId } = this.props;

    FlowRouter.go('inbox/details', { id: conversation._id }, { channelId });
  }

  renderCheckbox() {
    if (!this.props.toggleBulk) {
      return null;
    }

    return (
      <div className="column">
        <input type="checkbox" onChange={this.toggleBulk} />
      </div>
    );
  }

  render() {
    const { conversation, starred, isRead, isParticipated } = this.props;
    const { createdAt, content, messageCount } = conversation;
    const customer = conversation.customer();
    const isReadClass = !isRead ? 'unread' : null;
    const integration = conversation.integration();
    const brandName = integration.brand && integration.brand().name;

    // TODO: use embedded tags list of the conversation object
    const tags = TagsCollection.find({
      _id: { $in: conversation.tagIds || [] },
    }).fetch();

    return (
      <li className={isReadClass}>
        {this.renderCheckbox()}

        <div className="column">
          <NameCard.Avatar size={50} customer={customer} />
        </div>

        <div className="body">
          <header>
            <span className="customer-name">
              {customer && customer._id && customer.name}
            </span>
            <span> opened about </span>
            <time>
              {moment(createdAt).fromNow()}
            </time>
            <Tags tags={tags} size="small" />
          </header>

          <div className="content" onClick={this.goDetail}>
            {strip(content)}
          </div>

          <footer>
            <div className="source">
              <i className="ion-chatbox" />
              <div className="name">
                To {brandName} via {integration && integration.kind}
              </div>
            </div>

            <Assignees conversation={conversation} />

            <div className="info">
              <span>
                <i className="ion-reply" /> {messageCount}
              </span>
              <span>
                <i className="ion-person" /> {conversation.participatorCount()}
              </span>
            </div>
          </footer>
        </div>

        <div className="column">
          <div className="conversation-togglers">
            <Starrer conversation={conversation} starred={starred} />
            <Participate conversation={conversation} participated={isParticipated} />
          </div>
        </div>
      </li>
    );
  }
}

Row.propTypes = propTypes;

export default Row;
