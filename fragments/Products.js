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
