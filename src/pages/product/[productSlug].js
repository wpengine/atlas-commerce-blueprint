import { getNextStaticProps } from '@faustjs/next';
import { client } from 'client';
import {
  Footer,
  Header,
  Notification,
  Main,
  SEO,
  ProductSummary,
  ProductMeta,
  ProductPrice,
  ProductDescription,
} from 'components';

import styles from 'styles/pages/_Product.module.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { pageTitle } from 'utils';

import { useRouter } from 'next/router';

import { useState, useMemo } from 'react';
import Slider from 'react-slick';
import { classNames } from 'utils';

import ReactImageMagnify from '@blacklab/react-image-magnify';

import useAtlasEcom from 'hooks/useAtlasEcom';

import {
  computeVariantOrModificationFormFields,
  lookupProductVariants,
  checkPriceAdjuster,
} from '../../helpers/productHelpers.js';

export function ProductComponent({ product }) {
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;
  const storeSettings = useQuery().storeSettings({ first: 1 })?.nodes?.[0];

  const relatedProductIds = JSON.parse(product.relatedProducts ?? '[]');
  const relatedProducts = useQuery().products({
    where: { bigCommerceIDIn: relatedProductIds },
  })?.nodes;

  const productFormFields = JSON.parse(product.productFormFieldsJson ?? '[]');
  const variantLookup = JSON.parse(product.variantLookupJson ?? '{}');
  const modifierLookup = JSON.parse(product.modifierLookupJson ?? '{}');

  const productName = product.name;
  const bigCommerceId = product.bigCommerceID;
  const baseVariantId = product.variants({ last: 1 })?.nodes[0]
    ?.bigCommerceVariantID;
  let productImages = product.images().nodes;

  const sortedFormFields = useMemo(
    () => productFormFields.slice().sort((a, b) => a.sort_order - b.sort_order),
    [productFormFields]
  );

  const { cartData, addToCart } = useAtlasEcom();

  const [productNotification, setProductNotification] = useState();

  const [variantOrModFields, setVariantOrModFields] = useState(
    computeVariantOrModificationFormFields(productFormFields)
  );

  const variantValueKeys = Object.keys(variantOrModFields);

  const productVariant = lookupProductVariants(
    variantValueKeys,
    variantLookup,
    variantOrModFields
  );

  if (productVariant?.img) {
    productImages = [
      {
        urlStandard: productVariant.img,
        urlZoom: productVariant.img,
        urlThumbnail: productVariant.img,
      },
    ].concat(productImages.slice(1));
  }

  let priceAdjuster = checkPriceAdjuster(variantValueKeys, modifierLookup);

  const salePrice = productVariant?.salePrice ?? product.salePrice;
  const price = (productVariant?.price ?? product.price) + priceAdjuster;
  const calculatedPrice =
    (productVariant?.calculatedPrice ?? product.calculatedPrice) +
    priceAdjuster;

  function handleChange(event) {
    setVariantOrModFields((prevValues) => ({
      ...prevValues,
      [event.target.name]: event.target.value,
    }));
  }

  function handleFieldChange(key, value) {
    setVariantOrModFields((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const variantOptionValues = [];
    const modifierOptionValues = [];

    Object.keys(variantOrModFields).forEach((key) => {
      const match = key.match(/^(variant|modifier)\[(.*)\]$/);
      const value = variantOrModFields[key];
      if (match) {
        if (match[1] === 'variant') {
          variantOptionValues.push({
            parentOptionID: Number(match[2]),
            optionValueID: value,
          });
        } else if (match[1] === 'modifier') {
          modifierOptionValues.push({
            modifierOptionID: Number(match[2]),
            optionValue: typeof value !== 'number' ? value : '',
            optionValueID: typeof value === 'number' ? value : '',
          });
        }
      }
    });

    addToCart([
      {
        quantity: Number(variantOrModFields.quantity),
        product_id: bigCommerceId,
        variant_id: productVariant?.variant_id ?? baseVariantId,
        variant_option_values: variantOptionValues,
        modifiers: modifierOptionValues,
      },
    ]).then((data) => {
      setProductNotification(
        data.status === 200
          ? { message: `"${productName}" has been added to your cart.` }
          : { message: data.message, className: 'notificationError' }
      );

      window.scrollTo(0, 0);
    });
  }

  return (
    <>
      <SEO
        title={pageTitle(
          generalSettings,
          product?.title(),
          generalSettings?.title
        )}
        imageUrl={product?.featuredImage?.node?.sourceUrl?.()}
      />

      <Header storeSettings={storeSettings} />
      <Notification storeSettings={storeSettings} />

      <Main>
        <div className={classNames(['container', styles.product])}>
          {productNotification ? (
            <div
              className={classNames([
                styles.notification,
                styles[productNotification.className],
              ])}
            >
              <div className={styles.message}>
                {productNotification.message}
              </div>
              <a href={cartData?.redirect_urls?.cart_url}>View cart</a>
            </div>
          ) : null}

          <div className='row'>
            <div className='column column-40'>
              <ProductGallery images={productImages} />
            </div>

            <div className='column'>
              {salePrice !== 0 ? (
                <span className={styles.onsale}>Sale!</span>
              ) : null}

              <h1>{product?.name}</h1>

              <ProductPrice
                salePrice={salePrice}
                price={price}
                calculatedPrice={calculatedPrice}
              />

              <ProductDescription description={product?.description} />

              <ProductMeta
                product={product}
                sortedFormFields={sortedFormFields}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleFieldChange={handleFieldChange}
                productVariant={productVariant}
                variantOrModFields={variantOrModFields}
                variantValueKeys={variantValueKeys}
                modifierLookup={modifierLookup}
              />
            </div>
          </div>
        </div>

        {relatedProducts?.length > 0 ? (
          <div className={classNames(['container', 'related-products'])}>
            <h1>Related Products</h1>
            <div className='row row-wrap'>
              {relatedProducts.map((product) => (
                <ProductSummary
                  product={product}
                  key={`related-product-${product.slug}`}
                />
              ))}
            </div>
          </div>
        ) : null}
      </Main>

      <Footer storeSettings={storeSettings} />
    </>
  );
}

function ProductGallery({ images }) {
  const [productIndex, setProductIndex] = useState(0);

  return (
    <div className={styles.productGallery}>
      <div>
        <ReactImageMagnify
          imageProps={{
            alt: images[productIndex].description,
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
        {images.map((image, index) => (
          <img
            src={image.urlThumbnail}
            className={styles.productGalleryThumbnail}
            onClick={() => setProductIndex(index)}
            key={`slide-image-${index}`}
            alt={image.description}
          />
        ))}
      </Slider>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const { query } = router;
  const { useQuery } = client;
  const product = useQuery().product({ id: query.productSlug, idType: 'SLUG' });

  return <ProductComponent product={product} />;
}

export async function getStaticProps(context) {
  const product = await client.client.inlineResolved(() => {
    return client.client.query.product({
      id: context.params.productSlug,
      idType: 'SLUG',
    });
  });

  return getNextStaticProps(context, {
    Page,
    client,
    notFound: !product,
    revalidate: 1,
    // notFound: await is404(context, { client }),
  });
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
