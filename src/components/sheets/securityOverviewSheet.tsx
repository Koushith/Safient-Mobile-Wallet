import React from 'react';
import {VStack, Text} from 'native-base';
import {BaseSheet} from '.';
import {
  // SecurityOverview,
  SecurityItem,
  SecuritySwitch,
  ShieldWithCheckLogo,
  FingerprintLogo,
  EmailLogo,
} from '..';

type Props = {
  isOpen: boolean;
  accountLoading: boolean;
  recoveryLoading: boolean;
  onClose: () => void;
  onBack: () => void;
  onPasswordPress: () => void;
  onFingerprintChange: (value: boolean) => void;
  onRecoveryEmailPress: () => void;
  isFingerprintSupported: boolean;
  isFingerprintEnabled: boolean;
  isEmailRecoveryEnabled: boolean;
};

export const SecurityOverviewSheet = ({
  isOpen,
  accountLoading,
  recoveryLoading,
  onClose,
  onBack,
  onPasswordPress,
  onFingerprintChange,
  onRecoveryEmailPress,
  isFingerprintSupported,
  isFingerprintEnabled,
  isEmailRecoveryEnabled,
}: Props) => {
  return (
    <BaseSheet
      title="Security"
      isOpen={isOpen}
      onClose={onClose}
      onBack={onBack}>
      <VStack flex={1} py="24px" px="18px" space="8px">
        {/* <SecurityOverview level="Insufficient" /> */}

        <Text fontWeight={600} fontSize="18px" color="text.5">
          Account security
        </Text>

        <SecurityItem
          heading="Password"
          description="Old fashion yet effective security"
          source={ShieldWithCheckLogo}
          onPress={onPasswordPress}
        />

        {isFingerprintSupported && (
          <SecuritySwitch
            isLoading={accountLoading}
            heading="Fingerprint"
            description="Use your finger to get in"
            source={FingerprintLogo}
            isActive={isFingerprintEnabled}
            onValueChange={onFingerprintChange}
          />
        )}

        <Text fontWeight={600} mt="16px" fontSize="18px" color="text.5">
          Recovery
        </Text>

        <SecurityItem
          isActive={isEmailRecoveryEnabled}
          isLoading={recoveryLoading}
          heading="Email"
          description="Link your account to your email"
          source={EmailLogo}
          onPress={onRecoveryEmailPress}
        />
      </VStack>
    </BaseSheet>
  );
};
