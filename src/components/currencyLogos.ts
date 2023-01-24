import {ImageSourcePropType} from 'react-native';
import {CurrencySymbols} from '@stackupfinance/config';
import {UsdLogo, EthereumLogo, PolygonLogo, BitcoinLogo} from '.';

export const CurrencyLogos: Record<CurrencySymbols, ImageSourcePropType> = {
  USDC: UsdLogo,
  ETH: EthereumLogo,
  MATIC: PolygonLogo,
  BTC: BitcoinLogo,
};
