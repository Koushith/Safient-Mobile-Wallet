import Config from 'react-native-config';
// import {NetworkEnvironment} from '@stackupfinance/config';

interface AppEnvironment {
  NETWORK_ENV: string;
  EXPLORER_URL: string;
  BACKUP_URL: string;
  BUNDLER_URL: string;
  NOTIFICATION_URL: string;
  AMPLITUDE_API_KEY: string;
  SENTRY_DSN: string;
  INTERCOM_APP_ID: string;
  RAMP_HOST_API_KEY: string;
  MAGIC_API_KEY: string;
}

export const Env: AppEnvironment = {
  NETWORK_ENV:
    Config.STACKUP_MOBILE_NETWORK_ENV === 'mainnet' ? 'mainnet' : 'testnet',
  EXPLORER_URL: Config.STACKUP_MOBILE_EXPLORER_URL,
  BACKUP_URL: Config.STACKUP_MOBILE_BACKUP_URL,
  BUNDLER_URL: Config.STACKUP_MOBILE_BUNDLER_URL,
  NOTIFICATION_URL: Config.STACKUP_MOBILE_NOTIFICATION_URL,
  AMPLITUDE_API_KEY: Config.STACKUP_MOBILE_AMPLITUDE_API_KEY,
  SENTRY_DSN: Config.STACKUP_MOBILE_SENTRY_DSN,
  INTERCOM_APP_ID: Config.STACKUP_MOBILE_INTERCOM_APP_ID,
  RAMP_HOST_API_KEY: Config.STACKUP_MOBILE_RAMP_HOST_API_KEY,
  MAGIC_API_KEY: Config.STACKUP_MOBILE_MAGIC_API_KEY,
};
