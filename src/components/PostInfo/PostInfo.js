import { FormatDate } from '@components';

export default function PostInfo({ date, author, subTitle, className }) {
  if (!date && !author && !subTitle) {
    return null;
  }

  return (
    <div className={className}>
      {date && (
        <time dateTime={date}>
          <FormatDate date={date} />
        </time>
      )}
      {date && author && <>&nbsp;</>}
      {author && <span>by {author}</span>}
      {subTitle && <span>{subTitle}</span>}
    </div>
  );
}
