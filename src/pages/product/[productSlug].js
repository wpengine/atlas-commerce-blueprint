import { getNextStaticProps, is404 } from '@faustjs/next';
import { client } from 'client';
import {
  ContentWrapper,
  Footer,
  Header,
  Notification,
  EntryHeader,
  Main,
  SEO,
  TaxonomyTerms,
  Button,
  ProductSummary,
  Review,
  ReviewForm,
} from 'components';
import ProductFormField from 'components/ProductFormField/ProductFormField';

import styles from 'styles/pages/_Product.module.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { pageTitle } from 'utils';

import { useRouter } from 'next/router';
import Link from 'next/link';

import { useState, useMemo } from 'react';
import Slider from 'react-slick';
import { classNames } from 'utils';

import ReactImageMagnify from 'react-image-magnify';

import useTEcom from 'hooks/useTEcom';

export function ProductComponent({ product }) {
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;
  const storeSettings  = useQuery().storeSettings({ first: 1 })?.nodes?.[0];

  const productCategories = product.productCategories().nodes;
  const productBrand = product.brand?.node;
  
  const relatedProductIds = JSON.parse(product.relatedProducts ?? '[]');
  const relatedProducts = useQuery().products({ where: { bigCommerceIDIn: relatedProductIds }})?.nodes;

  const productFormFields = JSON.parse(product.productFormFieldsJson ?? '[]');
  const variantLookup = JSON.parse(product.variantLookupJson ?? '{}');
  const modifierLookup = JSON.parse(product.modifierLookupJson ?? '{}');

  // console.log({ productFormFields, variantLookup, modifierLookup });
  
  const productName = product.name;
  const bigCommerceId = product.bigCommerceID;
  const baseVariantId = product.variants({ last: 1 })?.nodes[0]?.bigCommerceVariantID;
  let productImages = product.images().nodes;
  
  const sortedFormFields = useMemo(() => (
    productFormFields.slice().sort((a, b) => a.sort_order - b.sort_order)
  ), [productFormFields]);
  
  const { cartData, addToCart } = useTEcom();
  
  const [productNotification, setProductNotification] = useState();
  
  const [values, setValues] = useState(() => {
    const fields = productFormFields.reduce((acc, field) => {
      acc[`${field.prodOptionType}[${field.id}]`] = (
        field.option_values?.reduce((defaultValue, option) => {
          if (option.is_default) {
            return option.id;
          }
          return defaultValue;
        }, null)
        ?? field.config?.default_value
      );
      return acc;
    }, {});
    
    return {
      ...fields,
      quantity: 1,
    };
  });
  
  const valuesKeys = Object.keys(values);
  
  const variantLookupId = valuesKeys.reduce((acc, key) => {
    let match;
    if (match = key.match(/^variant\[(.*)\]$/)) {
      acc.push(match[1] + '.' + values[key])
    }
    return acc;
  }, []).sort().join(';');
  
  const variantProduct = variantLookup[variantLookupId];
  const displayProduct = variantProduct ?? product;
  
  const inventoryTracking = product.inventoryTracking;
  let inventoryLevel = product.inventoryLevel;
  
  if (inventoryTracking === 'variant' && variantProduct) {
    inventoryLevel = variantProduct.inventory;
  } else if (inventoryTracking === 'none') {
    inventoryLevel = null;
  }
  
  if (variantProduct?.img) {
    productImages = [{
      urlStandard: variantProduct.img,
      urlZoom: variantProduct.img,
      urlThumbnail: variantProduct.img,
    }].concat(productImages.slice(1));
  }
  
  let purchaseDisabled = variantProduct?.purchasing_disabled || inventoryLevel === 0;
  let priceAdjuster = 0;
  let purchaseDisabledMessage = 'The selected product combination is currently unavailable.';
  
  valuesKeys.forEach((key) => {
    let match;
    if (match = key.match(/^modifier\[(.*)\]$/)) {
      const modifierLookupId = match[1] + '.' + values[key];
      const modifier = modifierLookup[modifierLookupId];
      if (modifier) {
        if (modifier.purchasing_disabled?.status === true) {
          purchaseDisabled = true;

          if (modifier.purchasing_disabled.message) {
            purchaseDisabledMessage = modifier.purchasing_disabled.message;
          }
        }
        priceAdjuster += modifier.price_adjuster;
      }
    }
  });
  
  const salePrice = variantProduct?.salePrice ?? product.salePrice;
  const price = (variantProduct?.price ?? product.price) + priceAdjuster;
  const calculatedPrice = (variantProduct?.calculatedPrice ?? product.calculatedPrice) + priceAdjuster;
  
  // console.log({ values, variantProduct, inventoryLevel });
  
  function handleChange(event) {
    setValues((prevValues) => ({
      ...prevValues,
      [event.target.name]: event.target.value,
    }));
  }
  
  function handleFieldChange(key, value) {
    setValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  }
  
  function handleSubmit(event) {
    event.preventDefault();
    
    const variantOptionValues = [];
    const modifierOptionValues = [];
    
    Object.keys(values).forEach((key) => {
      const match = key.match(/^(variant|modifier)\[(.*)\]$/);
      const value = values[key];
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
        quantity: Number(values.quantity),
        product_id: bigCommerceId,
        variant_id: variantProduct?.variant_id ?? baseVariantId,
        variant_option_values: variantOptionValues,
        modifiers: modifierOptionValues,
      },
    ]).then((data) => {
      // console.log({ 'addToCart()': data });
      
      setProductNotification((
        data.status === 200
        ? { message: `"${productName}" has been added to your cart.` }
        : { message: data.message, className: 'notificationError' }
      ));
      
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

      <Header
        storeSettings={storeSettings}
      />
      <Notification
        storeSettings={storeSettings}
      />


      <Main>
        <div className={classNames(['container', styles.product])}>
          {
            productNotification
            ? (
              <div className={classNames([styles.notification, styles[productNotification.className]])}>
                <div className={styles.message}>{productNotification.message}</div>
                <a href={cartData?.redirect_urls?.cart_url}>View cart</a>
              </div>
            )
            : null
          }
          
          <div className="row">
            <div className="column column-40">
              <ProductGallery images={productImages} />
            </div>

            <div className="column">
              {
                salePrice !== 0
                ? <span className={styles.onsale}>Sale!</span>
                : null
              }

              <h1>{product?.name}</h1>

              <p className="price" style={{
                fontSize: '1.41575em',
                margin: '1.41575em 0',
              }}>
                {
                  salePrice === 0
                  ? '$' + calculatedPrice.toFixed(2)
                  : <><del>${price.toFixed(2)}</del> ${calculatedPrice.toFixed(2)}</>
                }
              </p>

              <p dangerouslySetInnerHTML={{ __html: product?.description }} />

              <div className="product_meta">
                <p>SKU: {displayProduct.sku}</p>

                {
                  productCategories?.length
                  ? <p>
                      Categories: {' '}
                      {product.productCategories().nodes.map((category, index) => (
                        <>
                          {index === 0 ? '' : ', '}
                          <Link href={`/product-category/${category.slug}`}><a>{category.name}</a></Link>
                        </>
                      ))}
                    </p>
                  : null
                }

                {
                  productBrand
                  ? <p>Brand: {productBrand.name}</p>
                  : null
                }
                
                <form onSubmit={handleSubmit}>
                  {sortedFormFields.map((field) => (
                    <ProductFormField field={field} value={values[`${field.prodOptionType}[${field.id}]`]} onChange={handleFieldChange} key={field.id} />
                  ))}
                
                  <div>
                    <label style={{ display: 'block' }}>Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      max={inventoryLevel}
                      step="1"
                      name="quantity"
                      value={values.quantity}
                      onChange={handleChange}
                      disabled={purchaseDisabled}
                      className={styles.quantity}
                    />
                  </div>
                      
                  {
                    purchaseDisabled
                    ? <div className={styles.purchaseDisabled}>{purchaseDisabledMessage}</div>
                    : null
                  }
                
                  <Button
                    styleType="secondary"
                    className={styles.addToCart}
                    disabled={purchaseDisabled}
                  >
                    Add to cart
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className={classNames(['container', 'related-products'])}>
          <div className="row row-wrap">
            <div className="column">
              <h1>[count] reviews for {product?.name}</h1>
              <Review

              />
            </div>

          </div>
        </div>
        <div className={classNames(['container', 'review-product'])}>
          <div className="row row-wrap">
            <div className="column">
              <ReviewForm />
            </div>
          </div>
        </div>
        
        {
          relatedProducts?.length > 0
          ? (
            <div className={classNames(['container', 'related-products'])}>
              <h1>Related Products</h1>
              <div className="row row-wrap">
                {relatedProducts.map((product) => (
                  <ProductSummary product={product} key={product.slug} />
                ))}
              </div>
            </div>
          )
          : null
        }
      </Main>

      <Footer
        storeSettings={storeSettings}
      />
    </>
  );
}

function ProductGallery({ images }) {
  const [productIndex, setProductIndex] = useState(0);

  return (
    <div className={styles.productGallery}>
      <div>
        <ReactImageMagnify {...{
          smallImage: {
            alt: '',
            isFluidWidth: true,
            src: images[productIndex]?.urlStandard
          },
          largeImage: {
            src: images[productIndex]?.urlZoom,
            width: 960,
            height: 1080
          }
        }} />
      </div>

      <Slider
        dots={false}
        infinite={false}
        slidesToShow={4}
        slidesToScroll={4}
      >
        {images.map((image, index) => (
          <img
            src={image.urlThumbnail}
            className={styles.productGalleryThumbnail}
            onClick={() => setProductIndex(index)}
            key={index}
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
    return client.client.query.product({ id: context.params.productSlug, idType: 'SLUG' });
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
