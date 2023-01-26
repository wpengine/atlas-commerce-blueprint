import React, { useState, useMemo, useEffect } from 'react';
import { gql } from '@apollo/client';
import { BlogInfoFragment } from '@fragments/GeneralSettings';
import { ProductFragment } from '@fragments/Products';
import { StoreSettingsFragment } from '@fragments/StoreSettings';
import { BannerFragment } from '@fragments/Banners';
import {
  Banner,
  Header,
  Footer,
  Main,
  Container,
  NavigationMenu,
  SEO,
  ProductMeta,
  ProductPrice,
  ProductDescription,
  ProductGallery,
  ProductNotification,
  RelatedProducts,
  Reviews,
  ReviewForm,
} from '@components';
import {
  computeVariantOrModificationFormFields,
  lookupProductVariants,
  checkPriceAdjuster,
} from '../helpers/productHelpers.js';
import * as MENUS from '@constants/menus';
import useAtlasEcom from '../hooks/useAtlasEcom';
import classNames from 'classnames';
import styles from '@styles/pages/_Product.module.scss';

const cx = classNames.bind(styles);

export default function Component(props) {
  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings ?? {};
  const banner = props?.data?.banners?.nodes[0];
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
  const product = props?.data?.product ?? {};
  const productCategories = props?.data?.productCategories?.nodes ?? [];

  let relatedProductIds = [];
  try {
    relatedProductIds = JSON.parse(product?.relatedProducts);
  } catch (err) {
    console.error(err);
    console.log('There was an error parsing the related product ids');
  }

  const productFormFields = JSON.parse(product?.productFormFieldsJson ?? '[]');
  const variantLookup = JSON.parse(product?.variantLookupJson ?? '{}');
  const modifierLookup = JSON.parse(product?.modifierLookupJson ?? '{}');

  const productName = product?.name;
  const bigCommerceId = product?.bigCommerceID;
  const baseVariantId = product?.variants?.nodes[0]?.bigCommerceVariantID;
  let productImages = product?.images?.nodes ?? [];

  const sortedFormFields = useMemo(
    () => productFormFields.slice().sort((a, b) => a.sort_order - b.sort_order),
    [productFormFields]
  );

  const { addToCart } = useAtlasEcom();

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

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/atlas-commerce-connector-bigcommerce/v1/get-reviews?product_id=${bigCommerceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: '',
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews);
      });
  }, [bigCommerceId]);

  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>;
  }

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
        storeSettings={props?.data?.storeSettings}
      />
      <Banner notificationBanner={banner} />
      <Main>
        <Container classes={cx(styles.product)}>
          {productNotification && (
            <ProductNotification productNotification={productNotification} />
          )}

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
                categories={productCategories}
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
        </Container>
        <Reviews reviews={reviews} product={product} />
        <Container className='review-product'>
          <div className='row row-wrap'>
            <div className='column'>
              <ReviewForm product={product} />
            </div>
          </div>
        </Container>
        {relatedProductIds.length && relatedProductIds[0] !== -1 && (
          <RelatedProducts relatedProductIds={relatedProductIds} />
        )}
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

Component.query = gql`
  ${BlogInfoFragment}
  ${BannerFragment}
  ${ProductFragment}
  ${NavigationMenu.fragments.entry}
  ${StoreSettingsFragment}
  query GetProduct(
    $databaseId: ID!
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $asPreview: Boolean = false
  ) {
    product(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      ...ProductFragment
    }
    productCategories {
      nodes {
        databaseId
        id
        slug
        name
        products {
          nodes {
            slug
            bigCommerceID
          }
        }
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
    storeSettings {
      nodes {
        ...StoreSettingsFragment
      }
    }
    banners {
      nodes {
        ...BannerFragment
      }
    }
    headerMenuItems: menuItems(where: { location: $headerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`;

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    asPreview: ctx?.asPreview,
  };
};
