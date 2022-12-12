import { gql } from '@apollo/client';

export const ProductCategoryFragment = gql`
  fragment ProductCategoryFragment on ProductCategory {
    databaseId
    id
    slug
    name
    products {
      nodes {
        bigCommerceID
      }
    }
  }
`;
