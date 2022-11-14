import React from 'react';
import { useQuery } from 'react-apollo';
import { CATEGORIES_BY_PARENT_IDS } from '../../graphql/queries';
import { useSearchParam } from '../../hooks';

export default function CategoryFilterItem({ category }) {
  const { data, loading, error } = useQuery(CATEGORIES_BY_PARENT_IDS, {
    variables: { parentId: [category._id] }
  });

  const [_categoryId, setCategoryId] = useSearchParam('categoryId');

  if (loading) return null;

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  const subCategories = data.forumCategories || [];

  return (
    <div style={{ padding: 0, margin: 0 }}>
      <a
        onClick={() => setCategoryId(category._id)}
        style={{ cursor: 'pointer' }}
      >
        {category.thumbnail && (
          <img
            src={category.thumbnail}
            alt="category thumbnail"
            style={{ display: 'inline-block', width: 50, height: 50 }}
          />
        )}

        {category.name}
      </a>

      <ol style={{ listStyle: 'none', padding: '0 0 0 3em', margin: 0 }}>
        {subCategories.map(c => (
          <li key={c._id} style={{ margin: '5px 0' }}>
            <CategoryFilterItem category={c} />
          </li>
        ))}
      </ol>
    </div>
  );
}
