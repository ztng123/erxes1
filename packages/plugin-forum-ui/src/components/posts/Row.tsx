import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import Button from '@erxes/ui/src/components/Button';
import FormControl from '@erxes/ui/src/components/form/Control';
import Icon from '@erxes/ui/src/components/Icon';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Tip from '@erxes/ui/src/components/Tip';
import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import { IPost } from '../../types';
import PostForm from '../../containers/PostsList/PostForm';
import { Link } from 'react-router-dom';
import { DetailLink } from '../../styles';
import { DateWrapper } from '@erxes/ui/src/styles/main';
import dayjs from 'dayjs';

type Props = {
  post: IPost;
  remove: (postId: string, emptyBulk: () => void) => void;
  isChecked?: boolean;
  toggleBulk: (target: any, toAdd: boolean) => void;
  emptyBulk: () => void;
};

class Row extends React.Component<Props> {
  renderEditAction(post) {
    const trigger = (
      <Button btnStyle="link">
        <Tip text={__('Edit')} placement="top">
          <Icon icon="edit-3" />
        </Tip>
      </Button>
    );

    const content = props => <PostForm {...props} post={post} />;

    return (
      <ModalTrigger
        title={`Edit Post`}
        size="lg"
        trigger={trigger}
        content={content}
      />
    );
  }

  renderRemoveAction() {
    const { post, remove, emptyBulk } = this.props;

    const onClick = () => remove(post._id, emptyBulk);

    return (
      <Tip text={__('Delete')} placement="top">
        <Button
          id="postDelete"
          btnStyle="link"
          onClick={onClick}
          icon="times-circle"
        />
      </Tip>
    );
  }

  render() {
    const { post, isChecked, toggleBulk } = this.props;
    const {
      title,
      _id,
      state,
      lastPublishedAt,
      createdAt,
      createdBy,
      updatedAt,
      updatedBy,
      commentCount,
      upVoteCount,
      downVoteCount,
      viewCount
    } = post;

    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(post, e.target.checked);
      }
    };

    const onClick = e => {
      e.stopPropagation();
    };

    return (
      <tr>
        <td id="customersCheckBox" onClick={onClick}>
          <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>
          <DetailLink>
            <Link to={`/forums/posts/${_id}`}>{title}</Link>
          </DetailLink>
        </td>
        <td>{state}</td>
        <td>
          <Icon icon="calender" />{' '}
          <DateWrapper>{dayjs(lastPublishedAt).format('ll')}</DateWrapper>
        </td>
        <td>
          <Icon icon="calender" />{' '}
          <DateWrapper>{dayjs(createdAt).format('ll')}</DateWrapper>
        </td>
        <td>{createdBy.username}</td>
        <td>
          <Icon icon="calender" />{' '}
          <DateWrapper>{dayjs(updatedAt).format('ll')}</DateWrapper>
        </td>
        <td>{updatedBy.username}</td>
        <td>{commentCount.toLocaleString()}</td>
        <td>{upVoteCount.toLocaleString()}</td>
        <td>{downVoteCount.toLocaleString()}</td>
        <td>{viewCount.toLocaleString()}</td>
        <td>
          <ActionButtons>
            {this.renderEditAction(post)}
            {this.renderRemoveAction()}
          </ActionButtons>
        </td>
      </tr>
    );
  }
}

export default Row;
