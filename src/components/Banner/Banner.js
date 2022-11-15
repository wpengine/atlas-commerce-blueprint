/**
 * The Blueprint's Banner component
 * @return {React.ReactElement} The Banner component.
 */
export default function Banner({ notificationBanner }) {
  if (notificationBanner == undefined) {
    return null;
  } else {
    return (
      <div
        className='notificationBanner'
        style={{
          backgroundColor: notificationBanner?.backgroundColor,
          color: notificationBanner?.fontColor,
          textAlign: 'center',
          paddingTop: '14px',
        }}
        dangerouslySetInnerHTML={{ __html: notificationBanner?.content }}
      />
    );
  }
}
