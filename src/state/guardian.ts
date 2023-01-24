import create from 'zustand';
import {devtools} from 'zustand/middleware';
import axios from 'axios';
import {ethers} from 'ethers';
import {wallet, constants} from '@stackupfinance/walletjs';
import {CurrencySymbols, Networks} from '@stackupfinance/config';
import {
  Env,
  GasEstimate,
  NetworksConfig,
  PaymasterStatus,
  WalletStatus,
  WalletGuardians,
} from '../config';
import {gasOverrides, initCodeOverride} from '../utils/userOperations';

interface BuildOpsConfig {
  instance: wallet.WalletInstance;
  network: Networks;
  walletStatus: WalletStatus;
  paymasterStatus: PaymasterStatus;
  gasEstimate: GasEstimate;
  defaultCurrency: CurrencySymbols;
}

interface BuildModifyGuardianOpsConfig extends BuildOpsConfig {
  guardians: Array<string>;
  isGrantingRole: boolean;
}

interface BuildRecoveryOpsConfig extends BuildOpsConfig {
  newOwner: string;
}

interface GuardianStateConstants {
  loading: boolean;
  walletGuardians: WalletGuardians;
}

interface GuardianState extends GuardianStateConstants {
  fetchGuardians: (
    network: Networks,
    address: string,
  ) => Promise<WalletGuardians>;
  buildModifyGuardianOps: (
    config: BuildModifyGuardianOpsConfig,
  ) => Array<constants.userOperations.IUserOperation>;
  buildRecoveryOps: (
    config: BuildRecoveryOpsConfig,
  ) => Array<constants.userOperations.IUserOperation>;

  clear: () => void;
}

const defaults: GuardianStateConstants = {
  loading: false,
  walletGuardians: {
    guardianAddresses: null,
    magicAccountGuardian: null,
  },
};

const STORE_NAME = 'stackup-guardian-store';
const useGuardianStore = create<GuardianState>()(
  devtools(
    set => ({
      ...defaults,

      fetchGuardians: async (network, address) => {
        try {
          set({loading: true});
          const response = await axios.get<WalletGuardians>(
            `${Env.EXPLORER_URL}/v1/address/${address}/guardians`,
            {params: {network}},
          );

          set({loading: false, walletGuardians: response.data});
          return response.data;
        } catch (error) {
          set({loading: false});
          throw error;
        }
      },

      buildModifyGuardianOps: config => {
        const {
          instance,
          network,
          walletStatus,
          paymasterStatus,
          gasEstimate,
          defaultCurrency,
          guardians,
          isGrantingRole,
        } = config;
        const feeValue = ethers.BigNumber.from(
          paymasterStatus.fees[defaultCurrency] ?? '0',
        );
        const allowance = ethers.BigNumber.from(
          paymasterStatus.allowances[defaultCurrency] ?? '0',
        );
        const shouldApprovePaymaster = allowance.lt(feeValue);

        const approvePaymasterOp = shouldApprovePaymaster
          ? wallet.userOperations.get(instance.walletAddress, {
              nonce: walletStatus.nonce,
              ...gasOverrides(gasEstimate),
              ...initCodeOverride(instance, walletStatus.isDeployed),
              callData: wallet.encodeFunctionData.ERC20Approve(
                NetworksConfig[network].currencies[defaultCurrency].address,
                paymasterStatus.address,
                feeValue,
              ),
            })
          : undefined;
        const grantGuardianOps = guardians.map((guardian, i) =>
          wallet.userOperations.get(instance.walletAddress, {
            nonce: walletStatus.nonce + (shouldApprovePaymaster ? 1 : 0) + i,
            ...gasOverrides(gasEstimate),
            ...initCodeOverride(instance, walletStatus.isDeployed),
            callData: isGrantingRole
              ? wallet.encodeFunctionData.grantGuardian(guardian)
              : wallet.encodeFunctionData.revokeGuardian(guardian),
          }),
        );
        const userOperations = [approvePaymasterOp, ...grantGuardianOps].filter(
          Boolean,
        ) as Array<constants.userOperations.IUserOperation>;
        return userOperations;
      },

      buildRecoveryOps: config => {
        const {
          instance,
          network,
          walletStatus,
          paymasterStatus,
          gasEstimate,
          defaultCurrency,
          newOwner,
        } = config;
        const feeValue = ethers.BigNumber.from(
          paymasterStatus.fees[defaultCurrency] ?? '0',
        );
        const allowance = ethers.BigNumber.from(
          paymasterStatus.allowances[defaultCurrency] ?? '0',
        );
        const shouldApprovePaymaster = allowance.lt(feeValue);

        const approvePaymasterOp = shouldApprovePaymaster
          ? wallet.userOperations.get(instance.walletAddress, {
              nonce: walletStatus.nonce,
              ...gasOverrides(gasEstimate),
              ...initCodeOverride(instance, walletStatus.isDeployed),
              callData: wallet.encodeFunctionData.ERC20Approve(
                NetworksConfig[network].currencies[defaultCurrency].address,
                paymasterStatus.address,
                feeValue,
              ),
            })
          : undefined;
        const recoveryOp = wallet.userOperations.get(instance.walletAddress, {
          nonce: walletStatus.nonce + (shouldApprovePaymaster ? 1 : 0),
          ...gasOverrides(gasEstimate),
          ...initCodeOverride(instance, walletStatus.isDeployed),
          callData: wallet.encodeFunctionData.transferOwner(newOwner),
        });
        const userOperations = [approvePaymasterOp, recoveryOp].filter(
          Boolean,
        ) as Array<constants.userOperations.IUserOperation>;
        return userOperations;
      },

      clear: () => {
        set({...defaults});
      },
    }),
    {name: STORE_NAME},
  ),
);

export const useGuardianStoreRemoveWalletSelector = () =>
  useGuardianStore(state => ({clear: state.clear}));

export const useGuardianStoreSecuritySheetsSelector = () =>
  useGuardianStore(state => ({
    loading: state.loading,
    walletGuardians: state.walletGuardians,
    fetchGuardians: state.fetchGuardians,
    buildModifyGuardianOps: state.buildModifyGuardianOps,
  }));

export const useGuardianStoreMasterPasswordSelector = () =>
  useGuardianStore(state => ({
    loading: state.loading,
    fetchGuardians: state.fetchGuardians,
  }));

export const useGuardianStoreEmailRecoverySelector = () =>
  useGuardianStore(state => ({
    walletGuardians: state.walletGuardians,
    buildRecoveryOps: state.buildRecoveryOps,
  }));
