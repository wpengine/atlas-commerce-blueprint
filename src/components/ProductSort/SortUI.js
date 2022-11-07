export default function SortUI({ sortOrder, setSortOrder, products }) {
  return (
    <div className='column'>
      <select
        onChange={(event) => setSortOrder(event.target.value)}
        value={sortOrder}
      >
        <option value='index'>Default sorting</option>
        <option value='popularity'>Sort by popularity</option>
        <option value='rating'>Sort by average rating</option>
        <option value='latest'>Sort by latest</option>
        <option value='price-asc'>Sort by price: low to high</option>
        <option value='price-desc'>Sort by price: high to low</option>
      </select>
      &nbsp;&nbsp;Showing all {products.length} results
    </div>
  );
}
