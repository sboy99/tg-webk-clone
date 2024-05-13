import {RequestHandler} from '../../requestHandler';
import {GetOrCreateUserWalletReqDTO, GetOrCreateUserWalletResDTO} from './dto';
import {GetOrCreateUserWalletReqTransformer, GetOrCreateUserWalletResTransformer} from './transformer';

export class WalletService {
  private requestHandler: RequestHandler;

  constructor() {
    this.requestHandler = this.getRequestHandler();
  }

  public async getOrCreateUserWallet(dto: GetOrCreateUserWalletReqDTO): Promise<GetOrCreateUserWalletResDTO> {
    const body= await GetOrCreateUserWalletReqTransformer.parseAsync(dto);
    const response = await this.requestHandler.post<GetOrCreateUserWalletResDTO>('/wallets', body);
    return GetOrCreateUserWalletResTransformer.parseAsync(response);
  }

  // -------------------------------PRIVATE--------------------------------- //

  private getRequestHandler() {
    return new RequestHandler(
      'http://localhost:8000',
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
