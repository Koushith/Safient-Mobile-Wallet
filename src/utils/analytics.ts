import {Amplitude} from '@amplitude/react-native';
import {CurrencySymbols} from '@stackupfinance/config';
import {Env, CallRequestPayloads} from '../config';

type Events = {
  JOIN_DISCORD: {screen: string};
  OPEN_SUPPORT: {screen: string};

  WELCOME_CREATE: undefined;
  WELCOME_IMPORT: undefined;

  WALLET_IMPORT_CONTINUE: undefined;
  WALLET_IMPORT_BACK: undefined;

  MASTER_PASSWORD_FORGET: {enabled: boolean};
  MASTER_PASSWORD_CONTINUE: undefined;
  MASTER_PASSWORD_BACK: undefined;

  EMAIL_RECOVERY_BACK: undefined;
  EMAIL_RECOVERY_TRANSACTION_CONFIRM: undefined;

  WALLET_RECOVERED_CONTINUE: undefined;
  WALLET_RECOVERED_BACK: undefined;

  PASSWORD_CREATE_WALLET: {enableFingerprint: boolean};
  PASSWORD_BACK: undefined;

  SETTINGS_OPEN: undefined;
  SETTINGS_CLOSE: undefined;
  SETTINGS_REMOVE_WALLET: undefined;

  DEPOSIT_OPEN: undefined;
  DEPOSIT_CLOSE: undefined;
  DEPOSIT_TRANSFER_FROM_WALLET: undefined;
  DEPOSIT_FROM_RAMP: undefined;
  DEPOSIT_TRANSFER_FROM_WALLET_CLOSE: undefined;
  DEPOSIT_TRANSFER_FROM_WALLET_BACK: undefined;

  SEND_SELECT_CURRENCY_OPEN: undefined;
  SEND_SELECT_CURRENCY_CLOSE: undefined;
  SEND_SELECT_CURRENCY_ITEM: {currency: CurrencySymbols};
  SEND_VALUE_BACK: undefined;
  SEND_VALUE_CLOSE: undefined;
  SEND_VALUE_CONTINUE: undefined;
  SEND_SUMMARY_BACK: undefined;
  SEND_SUMMARY_CLOSE: undefined;
  SEND_SUMMARY_CONFIRM: undefined;

  MANAGE_CURRENCY_OPEN: undefined;
  MANAGE_CURRENCY_CLOSE: undefined;
  MANAGE_CURRENCY_ON_CHANGE: {currency: CurrencySymbols; enabled: boolean};

  SWAP_GET_QUOTE: {
    baseCurrency: CurrencySymbols;
    quoteCurrency: CurrencySymbols;
  };
  SWAP_REVIEW_ORDER: undefined;
  SWAP_REVIEW_ORDER_CLOSE: undefined;
  SWAP_CONFIRM: undefined;

  QR_CODE_OPEN: undefined;
  QR_CODE_CLOSE: undefined;
  QR_CODE_SCAN_ADDRESS: undefined;
  QR_CODE_SCAN_WALLET_CONNECT: undefined;
  QR_CODE_SCAN_UNSUPPORTED: undefined;

  WALLET_CONNECT_APPROVE_SESSION: {appName?: string};
  WALLET_CONNECT_REJECT_SESSION: {appName?: string};
  WALLET_CONNECT_APPROVE_CALL_REQUEST: {
    appName?: string;
    method?: CallRequestPayloads['method'];
  };
  WALLET_CONNECT_REJECT_CALL_REQUEST: {
    appName?: string;
    method?: CallRequestPayloads['method'];
  };

  SECURITY_SETTINGS_OPEN: undefined;
  SECURITY_SETTINGS_CLOSE: undefined;
  SECURITY_SETTINGS_BACK: undefined;
  SECURITY_SETTINGS_TOGGLE_FINGERPRINT: {enableFingerprint: boolean};
  SECURITY_SETTINGS_PASSWORD_OPEN: undefined;
  SECURITY_SETTINGS_PASSWORD_CLOSE: undefined;
  SECURITY_SETTINGS_PASSWORD_BACK: undefined;
  SECURITY_SETTINGS_PASSWORD_UPDATE: undefined;
  SECURITY_SETTINGS_RECOVERY_EMAIL_OPEN: undefined;
  SECURITY_SETTINGS_RECOVERY_EMAIL_CLOSE: undefined;
  SECURITY_SETTINGS_RECOVERY_EMAIL_BACK: undefined;
  SECURITY_SETTINGS_RECOVERY_EMAIL_UPDATE: {enabled: boolean};
};

const ampInstance = Amplitude.getInstance();
ampInstance.init(Env.AMPLITUDE_API_KEY);

export function logEvent<E extends keyof Events, P extends Events[E]>(
  event: E,
  properties?: P,
) {
  ampInstance.logEvent(event, properties);
}
