
import styles from './Notification.module.scss';
import { client, PageIdType } from 'client';

/**
 * The Blueprint's Notification component
 * @return {React.ReactElement} The Notification component.
 */
export default function Notification({storeSettings}) {
  const { useQuery } = client;
  const notificationBanner = useQuery().banners({first: 1})?.nodes?.[0];
  if ( notificationBanner == undefined ) {
    return (null)
  } else {
    return (
        <div className='notificationBanner' style={{backgroundColor: notificationBanner?.backgroundColor, color: notificationBanner?.fontColor, textAlign: 'center', paddingTop: '14px'}}
          dangerouslySetInnerHTML={{__html: notificationBanner?.content}}
        />
    )
  }

}
