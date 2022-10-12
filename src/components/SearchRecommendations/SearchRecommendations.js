import Link from 'next/link';
import { client } from 'client';

import styles from './SearchRecommendations.module.scss';

/**
 * Render the SearchRecommendations component.
 *
 * @returns {React.ReactElement} The SearchRecommendations component.
 */
export default function SearchRecommendations() {
  const { useQuery } = client;
  const categoryNodes = useQuery()?.productCategories()?.nodes;

  return (
    <div className={styles.recommendations}>
      <h4>Browse by Category</h4>
      <ul>
        {categoryNodes?.map((node) => (
          <li key={node?.databaseId ?? 0}>
            <Link href={'/product-category/' + node?.slug ?? '#'}>
              <a>{node.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
