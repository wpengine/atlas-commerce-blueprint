import { gql } from '@apollo/client';

export const BannerFragment = gql`
  fragment BannerFragment on Banner {
    id
    content
    backgroundColor
    fontColor
  }
`;
