import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  ModalTrigger,
  Tip,
  Button,
  Icon,
  Label
} from 'modules/common/components';
import { ArticleForm } from '../../containers';
import {
  RowArticle,
  ArticleTitle,
  ArticleColumn,
  ArticleMeta,
  AuthorName,
  ActionButtons
} from './styles';

const propTypes = {
  article: PropTypes.object.isRequired,
  queryParams: PropTypes.object,
  currentCategoryId: PropTypes.string,
  topicIds: PropTypes.string,
  remove: PropTypes.func.isRequired
};

class ArticleRow extends Component {
  constructor(props) {
    super(props);

    this.remove = this.remove.bind(this);
    this.renderEditAction = this.renderEditAction.bind(this);
  }

  remove() {
    this.props.remove(this.props.article._id);
  }

  renderEditAction(editTrigger) {
    const { article, queryParams, currentCategoryId, topicIds } = this.props;
    const { __ } = this.context;

    const editButton = (
      <Button btnStyle="link">
        <Tip text={__('Edit')}>
          <Icon icon="edit" />
        </Tip>
      </Button>
    );

    return (
      <ModalTrigger
        size="large"
        title="Edit"
        trigger={editTrigger ? editTrigger : editButton}
      >
        <ArticleForm
          article={article}
          queryParams={queryParams}
          currentCategoryId={currentCategoryId}
          topicIds={topicIds}
        />
      </ModalTrigger>
    );
  }

  render() {
    const { article } = this.props;
    const user = article.createdUser;
    const { __ } = this.context;

    const title = (
      <ArticleTitle>
        {article.title}
        {article.status === 'draft' && (
          <Label lblStyle="simple">{article.status}</Label>
        )}
      </ArticleTitle>
    );

    return (
      <RowArticle>
        <ArticleColumn>
          {this.renderEditAction(title)}
          <p>{article.summary}</p>
          <ArticleMeta>
            <img
              alt={user.details.fullName || 'author'}
              src={
                article.createdUser.details.avatar ||
                '/images/avatar-colored.svg'
              }
            />
            {__('Written By')}
            <AuthorName>
              {user.details.fullName || user.username || user.email}
            </AuthorName>
            <Icon icon="wallclock" /> {__('Created')}{' '}
            {moment(article.createdDate).format('ll')}
          </ArticleMeta>
        </ArticleColumn>
        <ActionButtons>
          {this.renderEditAction()}
          <Tip text={__('Delete')}>
            <Button btnStyle="link" onClick={this.remove} icon="cancel-1" />
          </Tip>
        </ActionButtons>
      </RowArticle>
    );
  }
}

ArticleRow.propTypes = propTypes;
ArticleRow.contextTypes = {
  __: PropTypes.func
};

export default ArticleRow;
