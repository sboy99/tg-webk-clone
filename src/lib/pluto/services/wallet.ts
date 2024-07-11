import {HttpClient} from '../http';
import {TCreateUserWalletResDto, TGetUserWalletResDto} from './dtos';
import {CreateUserWalletResTransformer, GetUserWalletResTransformer} from './transformers';

export class WalletService {
  constructor(private readonly httpClient: HttpClient) {}

  // -------------------------------PUBLIC--------------------------------- //

  public async createWallet(
    telegramId:string,
    fullName?:string,
    username?:string
  ) : Promise<TCreateUserWalletResDto> {
    const result= await this.httpClient.post('/wallets', {
      telegramId,
      fullName,
      username
    });
    return CreateUserWalletResTransformer.parseAsync(result);
  }

  public async getMyWallet() :Promise<TGetUserWalletResDto> {
    const result= await this.httpClient.get('/wallets/me');
    return GetUserWalletResTransformer.parseAsync(result);
  }
}
