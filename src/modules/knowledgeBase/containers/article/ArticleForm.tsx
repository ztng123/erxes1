import gql from 'graphql-tag';
import { ButtonMutate } from 'modules/common/components';
import { IButtonMutateProps } from 'modules/common/types';
import { __ } from 'modules/common/utils';
import { generatePaginationParams } from 'modules/common/utils/router';
import * as React from 'react';
import { ArticleForm } from '../../components';
import { mutations, queries } from '../../graphql';
import { IArticle } from '../../types';

type Props = {
  article: IArticle;
  currentCategoryId: string;
  queryParams: any;
  topicIds: string[];
  closeModal: () => void;
};

const ArticleContainer = (props: Props) => {
  const { article, queryParams, topicIds, currentCategoryId } = props;

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={
          object
            ? mutations.knowledgeBaseArticlesEdit
            : mutations.knowledgeBaseArticlesAdd
        }
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries(
          queryParams,
          currentCategoryId,
          topicIds
        )}
        isSubmitted={isSubmitted}
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
        } an ${name}`}
      />
    );
  };

  const extendedProps = {
    ...props,
    renderButton,
    article,
    currentCategoryId
  };

  return <ArticleForm {...extendedProps} />;
};

const getRefetchQueries = (
  queryParams,
  currentCategoryId: string,
  topicIds: string[]
) => {
  return [
    {
      query: gql(queries.knowledgeBaseArticles),
      variables: {
        ...generatePaginationParams(queryParams),
        categoryIds: [currentCategoryId]
      }
    },
    {
      query: gql(queries.knowledgeBaseCategories),
      variables: { topicIds: [topicIds] }
    },
    {
      query: gql(queries.knowledgeBaseArticlesTotalCount),
      variables: { categoryIds: [currentCategoryId] }
    }
  ];
};

export default ArticleContainer;
