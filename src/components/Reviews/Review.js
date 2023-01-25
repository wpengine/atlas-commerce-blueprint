const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function Review({ review, styles }) {
  const dateReviewed = new Date(review.date_reviewed);
  return (
    <ol className={styles.review}>
      <li className={styles.reviewlist}>
        <div className={styles.reviewContainer}>
          <img
            alt=''
            src='https://secure.gravatar.com/avatar/427dbff1e52ec95a065f5a6b34225c84?s=60&amp;d=mm&amp;r=g'
            srcSet='https://secure.gravatar.com/avatar/427dbff1e52ec95a065f5a6b34225c84?s=120&amp;d=mm&amp;r=g 2x'
            className={styles.avatar}
            height='60'
            width='60'
            loading='lazy'
          />
          <div className={styles.reviewText}>
            <div
              className={styles.starRating}
              role='img'
              aria-label={`Rated ${review.rating} out of 5`}
              style={{"--rating":review.rating}}
            >
              <span style={{ width: `${review.rating * 20}%` }}>
                Rated <strong className='rating'>{review.rating}</strong> out of
                5 based on <span className='rating'>1</span> customer rating
              </span>
            </div>
            <p className={styles.reviewNameDate}>
              <strong className={styles.reviewAuthor}>{review.name}</strong>
              <time
                className={styles.publishedDate}
                dateTime={review.date_reviewed}
              >
                {`${
                  months[dateReviewed.getMonth()]
                } ${dateReviewed.getDate()}, ${dateReviewed.getFullYear()}`}
              </time>
            </p>
            <div className='description'>
              <p>
                <strong>{review.title}</strong>
                <br />
                {review.text}
              </p>
            </div>
          </div>
        </div>
      </li>
    </ol>
  );
}
