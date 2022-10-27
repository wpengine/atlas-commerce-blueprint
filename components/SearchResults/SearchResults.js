import { FaSearch } from 'react-icons/fa';
import { ProductSummary } from '../ProductSummary';
import { LoadingSearchResult } from '../LoadingSearchResult';
import styles from './SearchResults.module.scss';
import classNames from 'classnames';

/**
 * Renders the search results list.
 *
 * @param {Props} props The props object.
 * @param {object[]} props.searchResults The search results list.
 * @param {boolean} props.isLoading Whether the search results are loading.
 * @returns {React.ReactElement} The SearchResults component.
 */

const cx = classNames.bind(styles);

export default function SearchResults({ searchResults, isLoading }) {
  // If there are no results, or are loading, return null.
  if (!isLoading && searchResults === null) {
    return null;
  }

  // If there are no results, return a message.
  if (!isLoading && !searchResults?.length) {
    return (
      <div className={styles['no-results']}>
        <FaSearch className={styles['no-results-icon']} />
        <div className={styles['no-results-text']}>No results</div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.shopTitle}>
        <h1>Results</h1>
      </div>

      <div className={cx('row', 'row-wrap', styles.shop)}>
        {searchResults?.map((node) => (
          <ProductSummary key={node.id} product={node} />
        ))}
      </div>

      {isLoading === true && (
        <>
          <LoadingSearchResult />
          <LoadingSearchResult />
          <LoadingSearchResult />
        </>
      )}
    </>
  );
}
