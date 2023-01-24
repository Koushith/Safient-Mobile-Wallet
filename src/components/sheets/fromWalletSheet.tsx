import React from 'react';
import {Box} from 'native-base';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons/faArrowDown';
import {Networks} from '@stackupfinance/config';
import {BaseSheet} from '.';
import {ImageWithIconBadge, QRCode, WalletAddress, NetworksLogos} from '..';

type Props = {
  isOpen: boolean;
  network: Networks;
  walletAddress: string;
  onBack: () => void;
  onClose: () => void;
};

export const FromWalletSheet = ({
  isOpen,
  network,
  walletAddress,
  onBack,
  onClose,
}: Props) => {
  return (
    <BaseSheet
      title="Transfer from wallet"
      isOpen={isOpen}
      onClose={onClose}
      onBack={onBack}>
      <Box px="19px">
        <Box mt="30px" justifyContent="center" alignItems="center">
          <ImageWithIconBadge
            source={NetworksLogos[network]}
            icon={faArrowDown}
          />
        </Box>

        <Box mt="44px" justifyContent="center" alignItems="center">
          <QRCode value={walletAddress} />
        </Box>

        <WalletAddress value={walletAddress} network={network} />
      </Box>
    </BaseSheet>
  );
};
