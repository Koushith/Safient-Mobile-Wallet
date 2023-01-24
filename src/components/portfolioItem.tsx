import React, {PropsWithChildren} from 'react';
import {HStack, VStack, Text, Pressable} from 'native-base';
import hexToRgba from 'hex-to-rgba';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowTrendUp} from '@fortawesome/free-solid-svg-icons/faArrowTrendUp';
import {faArrowTrendDown} from '@fortawesome/free-solid-svg-icons/faArrowTrendDown';
import {ethers, BigNumberish} from 'ethers';
import {CurrencySymbols, CurrencyMeta} from '@stackupfinance/config';
import {BaseItem, CurrencyLogos} from '.';
import {AppColors} from '../config';
import {formatCurrency, percentChange} from '../utils/currency';

type Props = {
  currency: CurrencySymbols;
  quoteCurrency: CurrencySymbols;
  balance: BigNumberish;
  previousBalanceInQuoteCurrency: BigNumberish;
  currentBalanceInQuoteCurrency: BigNumberish;
  isHidden: boolean;
  onPress?: () => void;
};

export const PortfolioItem = ({
  currency,
  quoteCurrency,
  balance,
  previousBalanceInQuoteCurrency,
  currentBalanceInQuoteCurrency,
  isHidden,
  onPress,
}: PropsWithChildren<Props>) => {
  const isTrendUp = ethers.BigNumber.from(currentBalanceInQuoteCurrency).gte(
    previousBalanceInQuoteCurrency,
  );
  const changePercentColor = isTrendUp
    ? AppColors.singletons.good
    : AppColors.singletons.warning;
  const trendIcon = isTrendUp ? (
    <FontAwesomeIcon
      icon={faArrowTrendUp}
      style={{color: AppColors.singletons.good}}
      size={15}
    />
  ) : (
    <FontAwesomeIcon
      icon={faArrowTrendDown}
      style={{color: AppColors.singletons.warning}}
      size={15}
    />
  );

  return (
    <Pressable isDisabled={onPress === undefined} onPress={onPress}>
      {({isPressed}) => (
        <BaseItem
          source={CurrencyLogos[currency]}
          alt="portfolioItem"
          backgroundColor={
            isPressed
              ? hexToRgba(AppColors.background[3], 0.8)
              : AppColors.background[3]
          }>
          <VStack>
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="16px" fontWeight={500}>
                {CurrencyMeta[currency].name}
              </Text>
              <Text fontSize="16px" fontWeight={500}>
                {isHidden
                  ? '•••••••'
                  : formatCurrency(
                      currentBalanceInQuoteCurrency,
                      quoteCurrency,
                    )}
              </Text>
            </HStack>

            <HStack justifyContent="space-between" alignItems="center">
              <Text color="text.3" fontSize="14px">
                {isHidden ? '•••••••••••••' : formatCurrency(balance, currency)}
              </Text>

              <HStack space="8px">
                <Text color={changePercentColor} fontSize="14px">
                  {`${
                    isHidden
                      ? '•••'
                      : `${percentChange(
                          previousBalanceInQuoteCurrency,
                          currentBalanceInQuoteCurrency,
                          quoteCurrency,
                        )}%`
                  }`}{' '}
                  {trendIcon}
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </BaseItem>
      )}
    </Pressable>
  );
};
