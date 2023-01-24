import React, {useState} from 'react';
import {Box, Heading, Input, Text, Button, useToast} from 'native-base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAt} from '@fortawesome/free-solid-svg-icons/faAt';
import {ethers} from 'ethers';
import {
  CurrencySymbols,
  CurrencyBalances,
  CurrencyMeta,
  Networks,
} from '@stackupfinance/config';
import {BaseSheet} from '.';
import {SummaryTable} from '..';
import {AppColors, NetworksConfig, PaymasterStatus} from '../../config';
import {isValidEmail} from '../../utils/email';
import {formatCurrency} from '../../utils/currency';

type Props = {
  isOpen: boolean;
  isEmailRecoveryEnabled: boolean;
  isLoading: boolean;
  maskedEmail: string;
  defaultCurrency: CurrencySymbols;
  currencyBalances: CurrencyBalances;
  paymasterStatus: PaymasterStatus | undefined;
  network: Networks;
  onClose: () => void;
  onBack: () => void;
  onSubmit: (email: string) => void;
};

type Data = {
  email: string;
};

export const EmailSheet = ({
  isOpen,
  isEmailRecoveryEnabled,
  isLoading,
  maskedEmail,
  defaultCurrency,
  paymasterStatus,
  currencyBalances,
  network,
  onBack,
  onClose,
  onSubmit,
}: Props) => {
  const toast = useToast();
  const [data, setData] = useState<Data>({
    email: '',
  });

  const feeValue = paymasterStatus?.fees[defaultCurrency] ?? '0';
  const defaultCurrencyBalance = currencyBalances[defaultCurrency] ?? '0';
  const hasInsufficientFee = ethers.BigNumber.from(defaultCurrencyBalance).lt(
    feeValue,
  );
  const renderError = () => {
    let message;
    if (hasInsufficientFee) {
      message = `Not enough ${CurrencyMeta[defaultCurrency].name} to pay fees`;
    }

    return message ? (
      <Text mt="8px" fontWeight={600} color={AppColors.singletons.warning}>
        {message}
      </Text>
    ) : undefined;
  };

  const onChangeTextHandler = (field: keyof Data) => (text: string) => {
    setData({...data, [field]: text});
  };

  const onPress = () => {
    const {email} = data;

    if (!isEmailRecoveryEnabled && !email) {
      toast.show({
        title: 'All fields are required',
        backgroundColor: AppColors.singletons.warning,
        placement: 'top',
      });
    } else if (!isEmailRecoveryEnabled && !isValidEmail(email)) {
      toast.show({
        title: 'Email is not valid',
        backgroundColor: AppColors.singletons.warning,
        placement: 'top',
      });
    } else {
      onSubmit(email);
    }
  };

  return (
    <BaseSheet title="Email" isOpen={isOpen} onClose={onClose} onBack={onBack}>
      <Box height="100%" pt="36px" pb="47px" px="18px" alignItems="center">
        <Heading fontWeight={600} fontSize="25px" textAlign="center">
          {isEmailRecoveryEnabled
            ? 'Unlink your email and crypto account'
            : 'Link your email and crypto account together'}
        </Heading>

        <Text mt="23px" fontSize="16px" color="text.3" textAlign="center">
          {isEmailRecoveryEnabled
            ? `You will not be able to recover this account with the email ${maskedEmail}`
            : ' This will submit a transaction so that you can recover your wallet with an email'}
        </Text>

        {!isEmailRecoveryEnabled && (
          <Input
            mt="26px"
            placeholder="Enter your email address.."
            keyboardType="email-address"
            onChangeText={onChangeTextHandler('email')}
            leftElement={
              <Box ml="13px">
                <FontAwesomeIcon
                  icon={faAt}
                  color={AppColors.text[5]}
                  size={18}
                />
              </Box>
            }
          />
        )}

        <Box w="100%" mt={isEmailRecoveryEnabled ? '26px' : '14px'}>
          <SummaryTable
            rows={[
              {
                isLoading,
                key: 'Fee',
                value: formatCurrency(feeValue, defaultCurrency),
              },
              {
                key: 'Network',
                value: NetworksConfig[network].name,
                color: NetworksConfig[network].color,
              },
            ]}
          />
        </Box>

        {renderError()}

        <Box flex={1} />

        <Button
          w="100%"
          isDisabled={hasInsufficientFee}
          isLoading={isLoading}
          colorScheme={isEmailRecoveryEnabled ? 'tertiary' : 'primary'}
          onPress={onPress}>
          {isEmailRecoveryEnabled
            ? 'Disable email recovery'
            : 'Enable email recovery'}
        </Button>
      </Box>
    </BaseSheet>
  );
};
