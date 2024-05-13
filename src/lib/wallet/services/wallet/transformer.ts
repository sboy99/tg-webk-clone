import {z} from 'zod';

export const GetOrCreateUserWalletReqTransformer= z.object({
  telegramId: z.string()
});

export const GetOrCreateUserWalletResTransformer= z.object({
  telegramId: z.string(),
  walletAddress: z.string()
});
