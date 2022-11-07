import { gql } from '@apollo/client';

export const ProductQuery = gql`
  query GetProduct($slug: String!) {
    products(where: { name: $slug }) {
      nodes {
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
    }
  }
`;

export const SearchProductQuery = gql`
  query SearchProduct($query: String!) {
    products(where: { search: $query }) {
      nodes {
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
              urlThumbnail
            }
          }
        }
      }
    }
  }
`;

export const RelatedProductsQuery = gql`
  query RelatedProducts($relatedProductIds: [ID]!) {
    products(where: { bigCommerceIDIn: $relatedProductIds }) {
      nodes {
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
        variantLookupJson
        modifierLookupJson
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
    }
  }
`;
