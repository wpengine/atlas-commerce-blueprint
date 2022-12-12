import Link from 'next/link';
import styles from './SearchRecommendations.module.scss';

/**
 * Render the SearchRecommendations component.
 *
 * @returns {React.ReactElement} The SearchRecommendations component.
 */
export default function SearchRecommendations({ categories }) {
  return (
    <div className={styles.recommendations}>
      <h4>Browse by Category</h4>
      <ul>
        {categories?.map((category) => (
          <li key={category?.databaseId ?? 0}>
            <Link href={'/product-category/' + category?.slug ?? '#'}>
              <a>{category?.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
