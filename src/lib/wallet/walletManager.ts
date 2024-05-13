import {WalletService} from './services/wallet/service';

export class WalletManager {
  private walletService: WalletService;

  constructor() {
    this.walletService = new WalletService();
  }

  public async getOrCreateUserWallet(telegramId: string) {
    return this.walletService.getOrCreateUserWallet({telegramId});
  }
}
