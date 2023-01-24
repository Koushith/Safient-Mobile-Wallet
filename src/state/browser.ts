import {Platform} from 'react-native';
import create from 'zustand';
import {devtools} from 'zustand/middleware';
import {Linking} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {AppColors} from '../config';

interface BrowserState {
  debounceAndroidAppState: boolean;

  setDebounceAndroidAppState: (value: boolean) => void;
  openBrowser: (link: string) => Promise<void>;

  clear: () => void;
}

const STORE_NAME = 'stackup-browser-store';
const useBrowserStore = create<BrowserState>()(
  devtools(
    (set, get) => ({
      debounceAndroidAppState: false,

      setDebounceAndroidAppState: debounceAndroidAppState => {
        if (Platform.OS === 'android') {
          set({debounceAndroidAppState});
        }
      },

      openBrowser: async link => {
        try {
          if (await InAppBrowser.isAvailable()) {
            get().setDebounceAndroidAppState(true);

            await InAppBrowser.open(link, {
              // iOS Properties
              dismissButtonStyle: 'close',
              preferredBarTintColor: AppColors.background[3],
              preferredControlTintColor: 'white',
              readerMode: false,
              animated: true,
              modalPresentationStyle: 'pageSheet',
              modalTransitionStyle: 'coverVertical',
              modalEnabled: true,
              enableBarCollapsing: false,

              // Android Properties
              showTitle: true,
              toolbarColor: AppColors.background[3],
              secondaryToolbarColor: AppColors.background[3],
              navigationBarColor: AppColors.background[3],
              navigationBarDividerColor: AppColors.background[3],
              enableUrlBarHiding: true,
              enableDefaultShare: true,
              forceCloseOnRedirection: false,
            });
          } else {
            Linking.openURL(link);
          }
        } catch (error) {
          throw error;
        }
      },

      clear: () => {
        set({debounceAndroidAppState: false});
      },
    }),
    {name: STORE_NAME},
  ),
);

export const useBrowserStoreRemoveWalletSelector = () =>
  useBrowserStore(state => ({clear: state.clear}));

export const useBrowserStoreAuthSelector = () =>
  useBrowserStore(state => ({
    debounceAndroidAppState: state.debounceAndroidAppState,
    setDebounceAndroidAppState: state.setDebounceAndroidAppState,
  }));

export const useBrowserStoreAssetsSelector = () =>
  useBrowserStore(state => ({openBrowser: state.openBrowser}));
