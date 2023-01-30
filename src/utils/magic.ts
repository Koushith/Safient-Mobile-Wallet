import {Magic} from '@magic-sdk/react-native';
import {Env} from '../config';

export const magicInstance = new Magic(Env.MAGIC_API_KEY);
