import { gql } from '@apollo/client';

export const BannerQuery = gql`
  query GetBanner {
    banners {
      nodes {
        id
        content
        backgroundColor
        fontColor
      }
    }
  }
`;
