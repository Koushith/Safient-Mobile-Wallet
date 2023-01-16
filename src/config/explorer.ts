export interface WalletStatus {
  isDeployed: boolean;
  nonce: number;
}

export interface WalletGuardians {
  guardianAddresses: Array<string> | null;
  magicAccountGuardian: {
    maskedEmail: string;
    guardianAddress: string;
  } | null;
}
