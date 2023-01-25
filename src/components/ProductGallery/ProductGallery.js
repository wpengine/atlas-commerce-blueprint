import React, { useState } from 'react';
import styles from '@styles/pages/_Product.module.scss';
import dynamic from 'next/dynamic';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ReactImageMagnify = dynamic(() => import('@blacklab/react-image-magnify'), {
  ssr: false,
});
const Slider = dynamic(() => import('react-slick'), {
  ssr: false,
});

function ProductGallery({ images }) {
  const [productIndex, setProductIndex] = useState(0);

  return (
    <div className={styles.productGallery}>
      <div>
        <ReactImageMagnify
          imageProps={{
            alt: images[productIndex]?.description,
            isfluidwidth: true.toString(),
            src: images[productIndex]?.urlStandard,
          }}
          magnifiedImageProps={{
            src: images[productIndex]?.urlZoom,
            width: 600,
            height: '600',
          }}
          portalProps={{
            height: 300,
            width: 300,
          }}
        />
      </div>

      <Slider dots={false} infinite={false} slidesToShow={4} slidesToScroll={4}>
        {!images.length ? (
          <img alt='Missing product image' src='/ProductDefault.gif' loading='lazy' />
        ) : (
          images.map((image, index) => (
            <img
              src={image?.urlThumbnail}
              className={styles.productGalleryThumbnail}
              onClick={() => setProductIndex(index)}
              key={`slide-image-${index}`}
              alt={image?.description}
              loading='lazy'
            />
          ))
        )}
      </Slider>
    </div>
  );
}

export default ProductGallery;
