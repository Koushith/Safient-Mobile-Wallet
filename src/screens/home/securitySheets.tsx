import React, {useState, useMemo, useEffect} from 'react';
import {useToast} from 'native-base';
import {
  RequestMasterPassword,
  SecurityOverviewSheet,
  PasswordSheet,
  EmailSheet,
} from '../../components';
import {
  useNavigationStoreSecuritySheetsSelector,
  useFingerprintStoreSecuritySheetsSelector,
  useWalletStoreSecuritySheetsSelector,
  useMagicStoreSecuritySheetsSelector,
  useBundlerStoreSecuritySheetsSelector,
  useSettingsStoreSecuritySheetsSelector,
  useExplorerStoreSecuritySheetsSelector,
  useGuardianStoreSecuritySheetsSelector,
} from '../../state';
import {AppColors, PaymasterStatus} from '../../config';
import {logEvent} from '../../utils/analytics';

export default function SecuritySheets() {
  const toast = useToast();
  const {
    showPasswordSheet,
    showSecurityOverviewSheet,
    showEmailSheet,
    setShowSettingsSheet,
    setShowSecurityOverviewSheet,
    setShowPasswordSheet,
    setShowEmailSheet,
  } = useNavigationStoreSecuritySheetsSelector();
  const {
    loading: fingerprintLoading,
    isSupported: isFingerprintSupported,
    isEnabled: isFingerprintEnabled,
    getMasterPassword,
    setMasterPassword,
    resetMasterPassword,
  } = useFingerprintStoreSecuritySheetsSelector();
  const {
    loading: walletLoading,
    instance,
    getWalletSigner,
    reencryptWalletSigner,
  } = useWalletStoreSecuritySheetsSelector();
  const {
    loading: magicLoading,
    loginWithEmailOTP,
    logoutFromMagic,
  } = useMagicStoreSecuritySheetsSelector();
  const {
    loading: bundlerLoading,
    fetchPaymasterStatus,
    requestPaymasterSignature,
    verifyUserOperationsWithPaymaster,
    signUserOperations,
    relayUserOperations,
    clear: clearBundler,
  } = useBundlerStoreSecuritySheetsSelector();
  const {
    network,
    quoteCurrency: defaultCurrency,
    timePeriod,
  } = useSettingsStoreSecuritySheetsSelector();
  const {
    loading: explorerLoading,
    currencies,
    walletStatus,
    fetchGasEstimate,
    fetchAddressOverview,
  } = useExplorerStoreSecuritySheetsSelector();
  const {
    loading: guardianLoading,
    walletGuardians,
    fetchGuardians,
    buildModifyGuardianOps,
  } = useGuardianStoreSecuritySheetsSelector();
  const [requestMasterPassword, setRequestMasterPassword] = useState<{
    show: boolean;
    action: (pass: string) => void;
  }>({show: false, action: () => {}});
  const [paymasterStatus, setPaymasterStatus] = useState<
    PaymasterStatus | undefined
  >();
  const currencyBalances = useMemo(
    () =>
      currencies.reduce((prev, curr) => {
        return {...prev, [curr.currency]: curr.balance};
      }, {}),
    [currencies],
  );
  const isEmailRecoveryEnabled = useMemo(
    () => walletGuardians.magicAccountGuardian !== null,
    [walletGuardians],
  );

  useEffect(() => {
    fetchGuardians(network, instance.walletAddress);
  }, []);

  const resetPaymasterStatus = () => setPaymasterStatus(undefined);

  const onRequestMasterPasswordClose = () => {
    clearBundler();
    setRequestMasterPassword({show: false, action: () => {}});
  };

  const onSecurityOverviewClose = () => {
    logEvent('SECURITY_SETTINGS_CLOSE');
    setShowSecurityOverviewSheet(false);
  };

  const onEmailSheetClose = () => {
    logEvent('SECURITY_SETTINGS_RECOVERY_EMAIL_CLOSE');
    setShowEmailSheet(false);
    resetPaymasterStatus();
  };

  const onClosePasswordSheet = () => {
    logEvent('SECURITY_SETTINGS_PASSWORD_CLOSE');
    setShowPasswordSheet(false);
  };

  const onPasswordPress = () => {
    logEvent('SECURITY_SETTINGS_PASSWORD_OPEN');
    setShowPasswordSheet(true);
  };

  const onRecoveryEmailPress = async () => {
    logEvent('SECURITY_SETTINGS_RECOVERY_EMAIL_OPEN');
    setShowEmailSheet(true);
    setPaymasterStatus(
      await fetchPaymasterStatus(instance.walletAddress, network),
    );
  };

  const onRecoveryEmailSubmit = async (email: string) => {
    if (isFingerprintEnabled) {
      const masterPassword = await getMasterPassword();
      masterPassword
        ? onConfirmTransaction(email)(masterPassword)
        : clearBundler();
    } else {
      setRequestMasterPassword({
        show: true,
        action: onConfirmTransaction(email),
      });
    }
  };

  const onConfirmTransaction =
    (email: string) => async (masterPassword: string) => {
      setRequestMasterPassword({show: false, action: () => {}});
      const gasEstimate = await fetchGasEstimate(network);
      if (!paymasterStatus || !gasEstimate) {
        toast.show({
          title: 'Could not fetch transaction data. Reset and try again.',
          backgroundColor: AppColors.singletons.warning,
          placement: 'top',
        });
        return;
      }

      const guardianAddress =
        walletGuardians.magicAccountGuardian?.guardianAddress ??
        (await loginWithEmailOTP(email).then(metadata => {
          logoutFromMagic();
          return metadata?.publicAddress;
        }));
      if (!guardianAddress) {
        toast.show({
          title: 'Cancelled email verification',
          backgroundColor: AppColors.singletons.warning,
          placement: 'top',
        });
        return;
      }

      const userOps = buildModifyGuardianOps({
        instance,
        network,
        walletStatus,
        defaultCurrency,
        paymasterStatus,
        gasEstimate,
        guardians: [guardianAddress],
        isGrantingRole: !isEmailRecoveryEnabled,
      });
      const userOpsWithPaymaster = await requestPaymasterSignature(
        userOps,
        network,
      );
      if (!verifyUserOperationsWithPaymaster(userOps, userOpsWithPaymaster)) {
        clearBundler();
        toast.show({
          title: 'Transaction corrupted, contact us for help',
          backgroundColor: AppColors.singletons.warning,
          placement: 'bottom',
        });
        return;
      }

      const signedUserOps = await signUserOperations(
        instance,
        masterPassword,
        network,
        userOpsWithPaymaster,
      );
      if (!signedUserOps) {
        toast.show({
          title: 'Incorrect password',
          backgroundColor: AppColors.singletons.warning,
          placement: 'top',
        });
        clearBundler();
        return;
      }

      toast.show({
        title: 'Transaction sent, this might take a minute...',
        backgroundColor: AppColors.palettes.primary[600],
        placement: 'bottom',
      });
      logEvent('SECURITY_SETTINGS_RECOVERY_EMAIL_UPDATE', {
        enabled: !isEmailRecoveryEnabled,
      });
      relayUserOperations(signedUserOps, network, status => {
        switch (status) {
          case 'PENDING':
            toast.show({
              title: 'Transaction still pending, refresh later',
              backgroundColor: AppColors.palettes.primary[600],
              placement: 'bottom',
            });
            break;

          case 'FAIL':
            toast.show({
              title: 'Transaction failed, contact us for help',
              backgroundColor: AppColors.singletons.warning,
              placement: 'bottom',
            });
            break;

          default:
            toast.show({
              title: 'Transaction completed!',
              backgroundColor: AppColors.singletons.good,
              placement: 'bottom',
            });
            break;
        }

        setShowEmailSheet(false);
        fetchGuardians(network, instance.walletAddress);
        fetchAddressOverview(
          network,
          defaultCurrency,
          timePeriod,
          instance.walletAddress,
        );
        resetPaymasterStatus();
      });
    };

  const onChangePassword = async (password: string, newPassword: string) => {
    try {
      if (await reencryptWalletSigner(password, newPassword)) {
        logEvent('SECURITY_SETTINGS_PASSWORD_UPDATE');
        isFingerprintEnabled &&
          (await setMasterPassword(newPassword, instance.salt));
        setShowPasswordSheet(false);
        toast.show({
          title: 'Password updated',
          backgroundColor: AppColors.singletons.good,
          placement: 'top',
        });
      } else {
        toast.show({
          title: 'Incorrect password',
          backgroundColor: AppColors.singletons.warning,
          placement: 'top',
        });
      }
    } catch (error) {
      toast.show({
        title: 'Unexpected error. Contact us for help.',
        backgroundColor: AppColors.singletons.warning,
        placement: 'top',
      });
    }
  };

  const onFingerprintChange = async (value: boolean) => {
    if (value) {
      setRequestMasterPassword({show: true, action: onEnableFingerprint});
    } else {
      onDisableFingerprint();
    }
  };

  const onEnableFingerprint = async (masterPassword: string) => {
    onRequestMasterPasswordClose();

    if (await getWalletSigner(masterPassword)) {
      logEvent('SECURITY_SETTINGS_TOGGLE_FINGERPRINT', {
        enableFingerprint: true,
      });
      await setMasterPassword(masterPassword, instance.salt);
    } else {
      toast.show({
        title: 'Incorrect password',
        backgroundColor: AppColors.singletons.warning,
        placement: 'top',
      });
    }
  };

  const onDisableFingerprint = async () => {
    const masterPassword = await getMasterPassword();
    if (masterPassword && (await getWalletSigner(masterPassword))) {
      logEvent('SECURITY_SETTINGS_TOGGLE_FINGERPRINT', {
        enableFingerprint: false,
      });
      await resetMasterPassword();
    }
  };

  const onSecurityOverviewBack = () => {
    logEvent('SECURITY_SETTINGS_BACK');
    setShowSettingsSheet(true);
  };

  const onPasswordSheetBack = () => {
    logEvent('SECURITY_SETTINGS_PASSWORD_BACK');
    setShowSecurityOverviewSheet(true);
  };

  const onEmailSheetBack = () => {
    logEvent('SECURITY_SETTINGS_RECOVERY_EMAIL_BACK');
    setShowSecurityOverviewSheet(true);
    resetPaymasterStatus();
  };

  return (
    <>
      <RequestMasterPassword
        isOpen={requestMasterPassword.show}
        onClose={onRequestMasterPasswordClose}
        onConfirm={requestMasterPassword.action}
      />

      <SecurityOverviewSheet
        isOpen={showSecurityOverviewSheet}
        accountLoading={fingerprintLoading || walletLoading}
        recoveryLoading={guardianLoading}
        onClose={onSecurityOverviewClose}
        onBack={onSecurityOverviewBack}
        onPasswordPress={onPasswordPress}
        onFingerprintChange={onFingerprintChange}
        onRecoveryEmailPress={onRecoveryEmailPress}
        isFingerprintSupported={isFingerprintSupported}
        isFingerprintEnabled={isFingerprintEnabled}
        isEmailRecoveryEnabled={isEmailRecoveryEnabled}
      />

      <PasswordSheet
        isOpen={showPasswordSheet}
        isLoading={fingerprintLoading || walletLoading}
        onClose={onClosePasswordSheet}
        onBack={onPasswordSheetBack}
        onSubmit={onChangePassword}
      />

      <EmailSheet
        isOpen={showEmailSheet}
        isEmailRecoveryEnabled={isEmailRecoveryEnabled}
        isLoading={
          fingerprintLoading ||
          magicLoading ||
          bundlerLoading ||
          guardianLoading ||
          explorerLoading
        }
        maskedEmail={walletGuardians.magicAccountGuardian?.maskedEmail ?? ''}
        defaultCurrency={defaultCurrency}
        currencyBalances={currencyBalances}
        paymasterStatus={paymasterStatus}
        network={network}
        onClose={onEmailSheetClose}
        onBack={onEmailSheetBack}
        onSubmit={onRecoveryEmailSubmit}
      />
    </>
  );
}
