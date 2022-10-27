import { gql } from '@apollo/client';

export const StoreSettingsFragment = gql`
  fragment StoreSettingsFragment on StoreSetting {
    storeLogo
    storePrimaryColor
    storeSecondaryColor
  }
`;
