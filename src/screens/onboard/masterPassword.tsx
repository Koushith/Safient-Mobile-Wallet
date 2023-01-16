import React, {useState} from 'react';
import {Button, Input, Heading, Text, Box, HStack, useToast} from 'native-base';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faKey} from '@fortawesome/free-solid-svg-icons/faKey';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import {AppColors, OnboardStackParamList} from '../../config';
import {StackScreenContainer, IconButton} from '../../components';
import {
  useIntercomStoreMasterPasswordSelector,
  useWalletStoreMasterPasswordSelector,
  useGuardianStoreMasterPasswordSelector,
  useSettingsStoreMasterPasswordSelector,
} from '../../state';
import {logEvent} from '../../utils/analytics';

type Props = NativeStackScreenProps<OnboardStackParamList, 'MasterPassword'>;

export default function MasterPasswordScreen({navigation, route}: Props) {
  const toast = useToast();
  const {openMessenger} = useIntercomStoreMasterPasswordSelector();
  const {loading: walletLoading, verifyEncryptedBackup} =
    useWalletStoreMasterPasswordSelector();
  const {loading: guardianLoading, fetchGuardians} =
    useGuardianStoreMasterPasswordSelector();
  const {network} = useSettingsStoreMasterPasswordSelector();
  const [password, setPassword] = useState('');
  const {enableFingerprint, walletAddress} = route.params;
  const isLoading = walletLoading || guardianLoading;

  const onForgotPasswordPress = async () => {
    const walletGuardians = await fetchGuardians(network, walletAddress);
    if (walletGuardians.magicAccountGuardian) {
      logEvent('MASTER_PASSWORD_FORGET', {enabled: true});
      navigation.navigate('EmailRecovery', {
        walletAddress,
      });
    } else {
      logEvent('MASTER_PASSWORD_FORGET', {enabled: false});
      toast.show({
        title: 'Email recovery not enabled for this account',
        backgroundColor: AppColors.singletons.warning,
        placement: 'top',
      });
    }
  };

  const onHelpPress = () => {
    logEvent('OPEN_SUPPORT', {screen: 'MasterPassword'});
    openMessenger();
  };

  const onBackPress = () => {
    logEvent('MASTER_PASSWORD_BACK');
    navigation.goBack();
  };

  const navigateNextHandler = async () => {
    if (!password) {
      toast.show({
        title: 'Password is required',
        backgroundColor: AppColors.singletons.warning,
        placement: 'top',
      });

      return;
    }

    const verifiedWalletInstance = await verifyEncryptedBackup(
      walletAddress,
      password,
    );
    if (verifiedWalletInstance) {
      logEvent('MASTER_PASSWORD_CONTINUE');
      navigation.navigate('WalletRecovered', {
        enableFingerprint,
        password,
        instance: verifiedWalletInstance,
      });
    } else {
      toast.show({
        title: 'Incorrect password',
        backgroundColor: AppColors.singletons.warning,
        placement: 'top',
      });
    }
  };

  return (
    <StackScreenContainer>
      <HStack justifyContent="space-between">
        <IconButton icon={faArrowLeft} onPress={onBackPress} />

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
        onChangeText={setPassword}
        leftElement={
          <Box ml="13px">
            <FontAwesomeIcon icon={faKey} color={AppColors.text[5]} size={18} />
          </Box>
        }
      />

      <Button
        w="100%"
        variant="link"
        isLoading={isLoading}
        onPress={onForgotPasswordPress}
        _text={{textAlign: 'center', fontWeight: 600, fontSize: '14px'}}>
        Forgot your password?
      </Button>

      <Box flex={1} />

      <Button
        w="100%"
        variant="link"
        onPress={onHelpPress}
        _text={{textAlign: 'center', fontWeight: 600, fontSize: '14px'}}>
        Need help? Start live chat
      </Button>

      <Button isLoading={isLoading} onPress={navigateNextHandler} mt="8px">
        Continue
      </Button>
    </StackScreenContainer>
  );
}
