import React, { useState } from 'react';
import ReactImageMagnify from '@blacklab/react-image-magnify';
import Slider from 'react-slick';
import styles from '@styles/pages/_Product.module.scss';

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
          <img alt='Missing product image' src='/ProductDefault.gif' />
        ) : (
          images.map((image, index) => (
            <img
              src={image?.urlThumbnail}
              className={styles.productGalleryThumbnail}
              onClick={() => setProductIndex(index)}
              key={`slide-image-${index}`}
              alt={image?.description}
            />
          ))
        )}
      </Slider>
    </div>
  );
}

export default ProductGallery;
