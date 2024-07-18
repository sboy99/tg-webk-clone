import {z} from 'zod';

import {AssetEnum} from '../../enums';

// Create User Wallet //
export const CreateUserWalletReqTransformer = z.object({
  telegramId: z.string(),
  fullName: z.string().optional(),
  username: z.string().optional()
});
export const CreateUserWalletResTransformer = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
});

// Get User Wallet //
export const GetUserWalletReqTransformer = z.object({
  telegramId: z.string()
});

export const GetUserWalletResTransformer = z.object({
  id: z.string(),
  telegramId: z.string(),
  walletAddress: z.string(),
  createdAt: z.coerce.date()
});

// Get Balance //
export const GetBalanceResTransformer = z.record(
  z.nativeEnum(AssetEnum),
  z.number().nullable()
);

// Save Passcode //
export const SavePasscodeReqTransformer = z.object({
  passcode: z.string()
});

// Verify Passcode //
export const VerifyPasscodeReqTransformer = z.object({
  passcode: z.string()
});

// Get Privatekey //
export const GetPrivatekeyReqTransformer = z.object({
  passcode: z.string()
});
export const GetPrivatekeyResTransformer = z.object({
  privateKey: z.string()
});
