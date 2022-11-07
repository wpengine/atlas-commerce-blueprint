import { gql } from '@apollo/client';

export const ProductsFragment = gql`
  fragment ProductsFragment on Product {
    id
    name
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
      edges {
        node {
          id
          description
          urlStandard
          urlZoom
        }
      }
    }
  }
`;

export const ProductFragment = gql`
  fragment ProductFragment on Product {
    id
    name
    sku
    price
    salePrice
    calculatedPrice
    reviewsRating
    totalSold
    bigCommerceID
    slug
    productFormFieldsJson
    productCategories {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
    relatedProducts
    variantLookupJson
    modifierLookupJson
    variants(last: 1) {
      nodes {
        bigCommerceVariantID
      }
    }
    images {
      edges {
        node {
          id
          description
          urlStandard
          urlZoom
          urlThumbnail
        }
      }
    }
  }
`;
