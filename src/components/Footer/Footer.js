import classNames from 'classnames/bind';
import { Container, NavigationMenu, Socials } from '@components';
import styles from './Footer.module.scss';

let cx = classNames.bind(styles);

export default function Footer({ title, menuItems }) {
  const year = new Date().getFullYear();

  return (
    <footer className={cx('component')}>
      <Container>
        <NavigationMenu menuItems={menuItems} />
        <Socials />
        <p className={cx('copyright')}>
          {`${title} © ${year}. Powered by WP Engine`}
        </p>
      </Container>
    </footer>
  );
}
