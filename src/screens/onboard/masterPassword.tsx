import React, {useState} from 'react';
import {Button, Input, Heading, Text, Box, HStack, useToast} from 'native-base';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faKey} from '@fortawesome/free-solid-svg-icons/faKey';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import {AppColors, OnboardStackParamList} from '../../config';
import {StackScreenContainer, IconButton} from '../../components';
// import {
//   useIntercomStoreMasterPasswordSelector,
//   useWalletStoreMasterPasswordSelector,
//   useGuardianStoreMasterPasswordSelector,
//   useSettingsStoreMasterPasswordSelector,
// } from '../../state';
// import {logEvent} from '../../utils/analytics';

type Props = NativeStackScreenProps<OnboardStackParamList, 'MasterPassword'>;

export default function MasterPasswordScreen() {
  // const toast = useToast();

  return (
    <StackScreenContainer>
      <HStack justifyContent="space-between">
        <IconButton icon={faArrowLeft} />

        <Text fontWeight={500} fontSize="16px" color="text.4">
          2/2
        </Text>
      </HStack>

      <Heading mt="16px" fontWeight={600} fontSize="25px" textAlign="center">
        Type in your master password
      </Heading>

      <Text mt="16px" fontSize="16px" color="text.3" textAlign="center">
        Your master password is the last step of your wallet recovery
      </Text>

      <Input
        mt="27px"
        type="password"
        placeholder="Type in your master password..."
        // onChangeText={setPassword}
        leftElement={
          <Box ml="13px">
            <FontAwesomeIcon icon={faKey} color={AppColors.text[5]} size={18} />
          </Box>
        }
      />

      <Button
        w="100%"
        variant="link"
        // isLoading={isLoading}
        // onPress={onForgotPasswordPress}
        _text={{textAlign: 'center', fontWeight: 600, fontSize: '14px'}}>
        Forgot your password?
      </Button>

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
