import className from 'classnames/bind';
import { Heading, PostInfo, Container, FeaturedImage } from '@components';
import styles from './EntryHeader.module.scss';

let cx = className.bind(styles);

export default function EntryHeader({
  title,
  image,
  date,
  author,
  subTitle,
  className,
}) {
  const hasText = title || date || author || subTitle;

  return (
    <div className={cx(['component', className])}>
      {image && (
        <FeaturedImage image={image} className={cx('image')} priority />
      )}

      {hasText && (
        <div className={cx('text', { 'has-image': image })}>
          <Container>
            {!!title && <Heading className={cx('title')}>{title}</Heading>}
            {
              <PostInfo
                className={cx('byline')}
                subTitle={subTitle}
                author={author}
                date={date}
              />
            }
          </Container>
        </div>
      )}
    </div>
  );
}
