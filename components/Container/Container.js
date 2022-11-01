import classNames from 'classnames';
import styles from './Container.module.scss';

const cx = classNames.bind(styles);

export default function Container({ children, classes }) {
  return (
    <div className={cx('container', styles.component, classes)}>{children}</div>
  );
}
