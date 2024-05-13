import {z} from 'zod';
import {GetOrCreateUserWalletReqTransformer, GetOrCreateUserWalletResTransformer} from './transformer';

export type GetOrCreateUserWalletReqDTO = z.infer<typeof GetOrCreateUserWalletReqTransformer>
export type GetOrCreateUserWalletResDTO = z.infer<typeof GetOrCreateUserWalletResTransformer>
