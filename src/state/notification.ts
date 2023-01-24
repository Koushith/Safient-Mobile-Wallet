import create from 'zustand';
import {persist, devtools} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import axios from 'axios';
import {
  Env,
  NotificationMessageData,
  AndroidNotificationGroups,
  AndroidNotificationChannels,
} from '../config';

interface NotificationStateConstants {
  loading: boolean;
  isEnabled: boolean;
  walletGroupId: AndroidNotificationGroups;
  activityChannelId: AndroidNotificationChannels;
  fcmToken?: string;
}

interface NotificationState extends NotificationStateConstants {
  updateFCMToken: (walletAddress: string) => Promise<void>;
  requestPermission: () => Promise<void>;
  setMessageHandler: () => void;
  createChannels: () => void;

  clear: () => void;

  hasHydrated: boolean;
  setHasHydrated: (flag: boolean) => void;
}

const defaults: NotificationStateConstants = {
  loading: false,
  isEnabled: false,
  walletGroupId: 'wallet',
  activityChannelId: 'activity',
  fcmToken: undefined,
};

const STORE_NAME = 'stackup-notification-store';
const useNotificationStore = create<NotificationState>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaults,

        updateFCMToken: async walletAddress => {
          const previousFcmToken = get().fcmToken;

          try {
            set({loading: true});

            const fcmToken = await messaging().getToken();
            await axios.post(`${Env.NOTIFICATION_URL}/v1/fcm/token`, {
              previousFcmToken,
              fcmToken,
              walletAddress,
            });
            set({loading: false, fcmToken});
          } catch (error) {
            set({loading: false});
            throw error;
          }
        },

        requestPermission: async () => {
          try {
            set({loading: true});
            const settings = await notifee.requestPermission();
            set({
              loading: false,
              isEnabled:
                settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED,
            });
          } catch (error) {
            set({loading: false});
            throw error;
          }
        },

        setMessageHandler: () => {
          const onMessageReceived = async (
            message: FirebaseMessagingTypes.RemoteMessage,
          ) => {
            const data = message.data as NotificationMessageData;
            await notifee.displayNotification({
              title: data.title,
              body: data.description,
              ios: {
                sound: 'default',
              },
              android: {
                channelId: data.channelId,
                smallIcon: 'ic_launcher_round',
                pressAction: {id: 'default'},
              },
            });
          };

          const foregroundUnsub = messaging().onMessage(onMessageReceived);
          messaging().setBackgroundMessageHandler(onMessageReceived);

          return foregroundUnsub;
        },

        createChannels: async () => {
          set({loading: true});
          const {walletGroupId, activityChannelId} = get();

          await notifee.createChannelGroup({
            id: walletGroupId,
            name: 'Wallet',
          });
          await notifee.createChannel({
            id: activityChannelId,
            groupId: walletGroupId,
            name: 'Activity',
            sound: 'default',
            vibration: true,
            vibrationPattern: [300, 500],
          });
          set({loading: false});
        },

        clear: () => {
          const fcmToken = get().fcmToken;
          fcmToken &&
            axios.delete(`${Env.NOTIFICATION_URL}/v1/fcm/token`, {
              params: {fcmToken},
            });
          set({...defaults});
        },

        hasHydrated: false,
        setHasHydrated: flag => {
          set({hasHydrated: flag});
        },
      }),
      {
        name: STORE_NAME,
        getStorage: () => AsyncStorage,
        partialize: state => {
          const {loading, hasHydrated, ...persisted} = state;
          return persisted;
        },
        onRehydrateStorage: () => state => {
          state?.setHasHydrated(true);
        },
      },
    ),
    {name: STORE_NAME},
  ),
);

export const useNotificationStoreRemoveWalletSelector = () =>
  useNotificationStore(state => ({clear: state.clear}));

export const useNotificationStoreAuthSelector = () =>
  useNotificationStore(state => ({
    updateFCMToken: state.updateFCMToken,
    requestPermission: state.requestPermission,
  }));

export const useNotificationStoreAppSelector = () =>
  useNotificationStore(state => ({
    setMessageHandler: state.setMessageHandler,
    createChannels: state.createChannels,
  }));
