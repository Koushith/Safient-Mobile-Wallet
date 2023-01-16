import React from 'react';
import {Button, Input, Heading, Text, Box, HStack} from 'native-base';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAt} from '@fortawesome/free-solid-svg-icons/faAt';
import {faKey} from '@fortawesome/free-solid-svg-icons/faKey';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons/faArrowLeft';

import {AppColors, OnboardStackParamList} from '../../config';
import {StackScreenContainer, IconButton, SummaryTable} from '../../components';

import {formatCurrency} from '../../utils/currency';

type Data = {
  email: string;
  newPassword: string;
  confirmPassword: string;
};

type Props = NativeStackScreenProps<OnboardStackParamList, 'EmailRecovery'>;

export default function EmailRecoveryScreen({navigation, route}: Props) {
  return (
    <StackScreenContainer>
      <HStack justifyContent="space-between">
        <IconButton icon={faArrowLeft} />

        <Text fontWeight={500} fontSize="16px" color="text.4">
          2/2
        </Text>
      </HStack>

      <Heading mt="16px" fontWeight={600} fontSize="25px" textAlign="center">
        Use your linked email to reset your password
      </Heading>

      <Text mt="16px" fontSize="16px" color="text.3" textAlign="center">
        {/* {`Use your email ${maskedEmail} to regain access to your wallet`} */}
        {`Use your email xxx to regain access to your wallet`}
      </Text>

      <Input
        mt="27px"
        placeholder="Enter your email address.."
        keyboardType="email-address"
        // onChangeText={onChangeTextHandler('email')}
        leftElement={
          <Box ml="13px">
            <FontAwesomeIcon icon={faAt} color={AppColors.text[5]} size={18} />
          </Box>
        }
      />

      <Input
        mt="8px"
        type="password"
        placeholder="New password..."
        // onChangeText={onChangeTextHandler('newPassword')}
        leftElement={
          <Box ml="13px">
            <FontAwesomeIcon icon={faKey} color={AppColors.text[5]} size={18} />
          </Box>
        }
      />

      <Input
        mt="8px"
        type="password"
        placeholder="Confirm password..."
        // onChangeText={onChangeTextHandler('confirmPassword')}
        leftElement={
          <Box ml="13px">
            <FontAwesomeIcon icon={faKey} color={AppColors.text[5]} size={18} />
          </Box>
        }
      />

      <Box w="100%" mt="18px">
        {/* <SummaryTable
          rows={[
            {
              isLoading,
              key: 'Fee',
              value: formatCurrency(
                paymasterStatus?.fees[defaultCurrency] ?? '0',
                defaultCurrency,
              ),
            },
            {
              key: 'Network',
              value: NetworksConfig[network].name,
              color: NetworksConfig[network].color,
            },
          ]}
        /> */}
      </Box>

      {/* {!isLoading && renderError()} */}

      <Box flex={1} />

      <Button
        w="100%"
        variant="link"
        // onPress={onHelpPress}
        _text={{textAlign: 'center', fontWeight: 600, fontSize: '14px'}}>
        Need help? Start live chat
      </Button>

      <Button mt="8px">Continue</Button>
    </StackScreenContainer>
  );
}
