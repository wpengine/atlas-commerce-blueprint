
import styles from './Footer.module.scss';
import Link from 'next/link';
import { client } from 'client';

/**
 * The Blueprint's Footer component
 * @return {React.ReactElement} The Footer component.
 */
export default function Footer({storeSettings}) {
    const { useQuery } = client;
    //const storeSettings  = useQuery().storeSettings({ first: 1 })?.nodes?.[0];

  return (
    <footer className={styles.footer} style={{backgroundColor: storeSettings?.storePrimaryColor}}>
      <div className="container">

        <div className={styles.bar}>

          <div className={styles.terms}>
            <div>
              <Link href="/">
                <a title="Privacy" style={{color:storeSettings?.storeSecondaryColor}}>Privacy Policy</a>
              </Link>
            </div>

            <div>
              <Link href="/">
                <a title="Terms" style={{color:storeSettings?.storeSecondaryColor}}>Terms & Conditions</a>
              </Link>
            </div>
          </div>

          <div className={styles.copyright} style={{color:storeSettings?.storeSecondaryColor}}>
            &copy; {new Date().getFullYear()} Blueprint Media &#183; Powered By{' '}
            <a href="https://wpengine.com/atlas" style={{color:storeSettings?.storeSecondaryColor}}>Atlas</a>
          </div>

        </div>


      </div>
    </footer>
  );
}
