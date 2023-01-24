import create from 'zustand';
import {devtools} from 'zustand/middleware';
import {ethers} from 'ethers';
// import {magicInstance} from '../utils/magic';
// import {RPCError, MagicUserMetadata} from '@magic-sdk/react-native';

interface MagicStateConstants {
  loading: boolean;
}

interface MagicState extends MagicStateConstants {
  loginWithEmailOTP: (email: string) => Promise<MagicUserMetadata | undefined>;
  getMagicSigner: () => ethers.Signer;
  logoutFromMagic: () => void;

  clear: () => void;
}

const defaults: MagicStateConstants = {
  loading: false,
};

const STORE_NAME = 'stackup-magic-store';
const useMagicStore = create<MagicState>()(
  devtools(
    (set, get) => ({
      ...defaults,

      loginWithEmailOTP: async email => {
        try {
          set({loading: true});
          await magicInstance.auth.loginWithEmailOTP({email});
          const userMetaData = await magicInstance.user.getMetadata();

          set({loading: false});
          return userMetaData ?? undefined;
        } catch (error) {
          set({loading: false});
          if (error instanceof RPCError && error.code === -10011) {
            // User canceled login
            return;
          }

          throw error;
        }
      },

      getMagicSigner: () => {
        const provider = new ethers.providers.Web3Provider(
          magicInstance.rpcProvider as any,
        );
        return provider.getSigner();
      },

      logoutFromMagic: async () => {
        return magicInstance.user.logout();
      },

      clear: () => {
        get().logoutFromMagic();
        set({...defaults});
      },
    }),
    {name: STORE_NAME},
  ),
);

export const useMagicStoreRemoveWalletSelector = () =>
  useMagicStore(state => ({clear: state.clear}));

export const useMagicStoreSecuritySheetsSelector = () =>
  useMagicStore(state => ({
    loading: state.loading,
    loginWithEmailOTP: state.loginWithEmailOTP,
    logoutFromMagic: state.logoutFromMagic,
  }));

export const useMagicStoreEmailRecoverySelector = () =>
  useMagicStore(state => ({
    loading: state.loading,
    loginWithEmailOTP: state.loginWithEmailOTP,
    getMagicSigner: state.getMagicSigner,
    logoutFromMagic: state.logoutFromMagic,
  }));
