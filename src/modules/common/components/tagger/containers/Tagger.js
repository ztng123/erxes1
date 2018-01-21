import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql, graphql } from 'react-apollo';
import Tagger from '../components/Tagger';

const TaggerContainer = props => {
  const { tagsQuery, tagMutation } = props;

  const tag = (variables, callback) => {
    tagMutation({
      variables
    })
      .then(() => {
        callback();
      })
      .catch(error => {
        callback(error);
      });
  };

  const updatedProps = {
    ...props,
    loading: tagsQuery.loading,
    tags: tagsQuery.tags || [],
    tag
  };

  return <Tagger {...updatedProps} />;
};

TaggerContainer.propTypes = {
  tagsQuery: PropTypes.object,
  tagMutation: PropTypes.func
};

const tagsQuery = gql`
  query($type: String!) {
    tags(type: $type) {
      _id
      name
      colorCode
    }
  }
`;

const tagMutation = gql`
  mutation tagsTag(
    $type: String!
    $targetIds: [String!]!
    $tagIds: [String!]!
  ) {
    tagsTag(type: $type, targetIds: $targetIds, tagIds: $tagIds)
  }
`;

const queries = {
  customer: 'customers',
  company: 'companies',
  engageMessage: 'engageMessages'
};

export default compose(
  graphql(tagsQuery, {
    name: 'tagsQuery',
    options: props => ({
      variables: { type: props.type }
    })
  }),
  graphql(tagMutation, {
    name: 'tagMutation',
    options: props => ({
      refetchQueries: [
        queries[props.type] ? queries[props.type] : `${props.type}`
      ]
    })
  })
)(TaggerContainer);
