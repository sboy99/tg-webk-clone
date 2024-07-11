import {HttpClient} from '../http';
import {WalletService} from './wallet';

export class Services {
  public wallet: WalletService;

  constructor(
    httpClient: HttpClient
  ) {
    this.wallet = new WalletService(httpClient);
  }
}
