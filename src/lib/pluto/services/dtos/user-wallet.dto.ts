import type {z} from 'zod';

import type {
  CreateUserWalletReqTransformer,
  CreateUserWalletResTransformer,
  GetBalanceResTransformer,
  GetPrivatekeyReqTransformer,
  GetPrivatekeyResTransformer,
  GetUserWalletResTransformer,
  SavePasscodeReqTransformer,
  VerifyPasscodeReqTransformer
} from '../transformers';

// Create User Wallet //
export type TCreateUserWalletReqDto = z.infer<
  typeof CreateUserWalletReqTransformer
>;

export type TCreateUserWalletResDto = z.infer<
  typeof CreateUserWalletResTransformer
>;

// Get User Wallet //
export type TGetUserWalletResDto = z.infer<typeof GetUserWalletResTransformer>;

// Get Balance //
export type TGetBalanceResDto = z.infer<typeof GetBalanceResTransformer>;

// Save Passcode //
export type TSavePasscodeReqDto = z.infer<typeof SavePasscodeReqTransformer>;

// Verify Passcode //
export type TVerifyPasscodeReqDto = z.infer<
  typeof VerifyPasscodeReqTransformer
>;

// Get Privatekey //
export type TGetPrivatekeyReqDto = z.infer<typeof GetPrivatekeyReqTransformer>;
export type TGetPrivatekeyResDto = z.infer<typeof GetPrivatekeyResTransformer>;
