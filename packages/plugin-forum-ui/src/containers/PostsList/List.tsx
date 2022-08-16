import React from 'react';
import { useSearchParam } from '../../hooks';
import { useQuery } from 'react-apollo';
import { FORUM_POSTS_COUNT, FORUM_POSTS_QUERY } from '../../graphql/queries';
import { prependListener } from 'process';
import { count } from 'console';

const perPageOptions = [5, 10, 25, 50, 100];

const List: React.FC = () => {
  const [categoryId] = useSearchParam('categoryId');
  const [state] = useSearchParam('state');
  const [categoryIncludeDescendants] = useSearchParam(
    'categoryIncludeDescendants'
  );

  const [perPage] = useSearchParam('perPage');
  const [page] = useSearchParam('page');

  const variables = {
    categoryId,
    state,
    categoryIncludeDescendants: !!categoryIncludeDescendants
  };

  const postQuery = useQuery(FORUM_POSTS_QUERY, {
    variables
  });

  const countQuery = useQuery(FORUM_POSTS_COUNT, { variables });

  if (postQuery.loading) return null;
  if (postQuery.error)
    return <pre>{JSON.stringify(postQuery.error, null, 2)}</pre>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h5>Total: {countQuery.data?.forumPostsCount || 0}</h5>
      </div>

      <div>
        {postQuery.data.forumPosts.map(p => (
          <pre>{JSON.stringify(p)}</pre>
        ))}
      </div>

      <Pagination total={countQuery.data?.forumPostsCount || 0} />
    </div>
  );
};

const Pagination: React.FC<{ total: number }> = ({ total }) => {
  const [_perPage] = useSearchParam('perPage');
  const [_page] = useSearchParam('page');

  const perPage = _perPage || 10;
  const page = _page || 1;

  if (!total) return null;

  return null;
};

export default List;
