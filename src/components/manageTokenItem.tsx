import React from 'react';
import {HStack, VStack, Text} from 'native-base';
import {BigNumberish} from 'ethers';
import {CurrencySymbols, CurrencyMeta} from '@stackupfinance/config';
import {BaseItem, Switch, CurrencyLogos} from '.';
import {AppColors} from '../config';
import {formatCurrency} from '../utils/currency';

type Props = {
  currency: CurrencySymbols;
  balance: BigNumberish;
  enabled: boolean;
  onValueChange: (value: boolean) => void;
};

export const ManageTokenItem = ({
  currency,
  balance,
  enabled,
  onValueChange,
}: Props) => {
  return (
    <BaseItem
      alt="manageTokenItem"
      source={CurrencyLogos[currency]}
      backgroundColor={AppColors.background[3]}>
      <HStack justifyContent="space-between" alignItems="center">
        <VStack justifyContent="space-between">
          <Text fontWeight={600} fontSize="16px" color="white">
            {CurrencyMeta[currency].name}
          </Text>

          <Text fontWeight={300} fontSize="14px" color="text.1">
            {formatCurrency(balance, currency)}
          </Text>
        </VStack>

        <Switch enabled={enabled} onValueChange={onValueChange} />
      </HStack>
    </BaseItem>
  );
};
