import { gql } from '@apollo/client';

export const ProductsFragment = gql`
  fragment ProductsFragment on Product {
    id
    name
    description
    price
    salePrice
    reviewsRating
    totalSold
    bigCommerceID
    slug
    productFormFieldsJson
    relatedProducts
    variantLookupJson
    modifierLookupJson
    images {
      nodes {
        id
        description
        urlStandard
        urlZoom
        urlThumbnail
        isThumbnail
      }
    }
  }
`;

export const ProductFragment = gql`
  fragment ProductFragment on Product {
    id
    name
    sku
    description
    price
    salePrice
    calculatedPrice
    reviewsRating
    totalSold
    bigCommerceID
    slug
    productFormFieldsJson
    relatedProducts
    variantLookupJson
    modifierLookupJson
    variants(last: 1) {
      nodes {
        bigCommerceVariantID
      }
    }
    images {
      nodes {
        id
        description
        urlStandard
        urlZoom
        urlThumbnail
        isThumbnail
      }
    }
  }
`;
