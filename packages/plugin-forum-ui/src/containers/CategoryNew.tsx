import React from 'react';
import Form from '../components/Form';
import { useMutation } from 'react-apollo';
import { CREATE_ROOT_CATEGORY } from '../graphql/mutations';
import { useHistory } from 'react-router-dom';
import { allCategoryQueries } from '../graphql/queries';

const CategoryNew: React.FC = () => {
  const [mutation] = useMutation(CREATE_ROOT_CATEGORY, {
    onError: e => alert(JSON.stringify(e, null, 2)),
    refetchQueries: allCategoryQueries
  });

  const history = useHistory();

  const onSubmit = async v => {
    try {
      const {
        data: {
          forumCreateCategory: { _id }
        }
      } = await mutation({
        variables: v
      });

      history.push(`./${_id}`);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <h2>Create new root category</h2>
      <Form noParent onSubmit={onSubmit} />
    </div>
  );
};

export default CategoryNew;
