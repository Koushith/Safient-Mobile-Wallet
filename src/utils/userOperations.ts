import {ethers} from 'ethers';
import {wallet, constants} from '@stackupfinance/walletjs';
import {GasEstimate} from '../config';

export const gasOverrides = (gasEstimate: GasEstimate) => {
  const maxPriorityFeePerGas = ethers.BigNumber.from(
    gasEstimate.maxPriorityFeePerGas,
  ).toNumber();
  const maxFeePerGas = ethers.BigNumber.from(
    gasEstimate.maxFeePerGas,
  ).toNumber();

  return {
    preVerificationGas: 0,
    verificationGas: constants.userOperations.defaultGas * 3,
    maxPriorityFeePerGas,
    maxFeePerGas,
  };
};

export const initCodeOverride = (
  instance: wallet.WalletInstance,
  isDeployed: boolean,
) => {
  return {
    initCode: isDeployed
      ? constants.userOperations.nullCode
      : wallet.proxy
          .getInitCode(
            instance.initImplementation,
            instance.initOwner,
            instance.initGuardians,
          )
          .toString(),
  };
};
