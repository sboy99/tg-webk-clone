import {MOUNT_CLASS_TO} from '../../config/debug';
import {logger} from '../logger';
import {HttpClient} from './http';
import {Services} from './services';
import {LocalStorageService} from './storage';

export class Pluto {
  private log: ReturnType<typeof logger>;
  private localStorage: LocalStorageService;

  public services: Services

  constructor() {
    this.log = logger('PLUTO');
    this.log('constructor');
    this.localStorage = new LocalStorageService();
    const accessToken = this.getAccessTokenFromStorage();
    const refreshToken = this.getRefreshTokenFromStorage();
    this.initServices(accessToken, refreshToken);
  }

  public async connect(
    telegramId: string,
    fullName?: string,
    username?: string
  ) {
    const token= await this.services.wallet.createWallet(
      telegramId,
      fullName,
      username
    );
    this.handleTokenRefresh({
      accessToken: token.accessToken,
      refreshToken: token.refreshToken
    });
    const wallet= await this.services.wallet.getMyWallet();
    return wallet;
  }


  // -------------------------------PRIVATE--------------------------------- //


  private createHttpClient(
    accessToken?: string,
    refreshToken?: string
  ) {
    const baseUrl = 'http://localhost:8000';
    return new HttpClient({
      baseUrl,
      accessToken,
      refreshToken,
      onTokenRefresh: this.handleTokenRefresh.bind(this)
    });
  }

  private initServices(
    accessToken: string,
    refreshToken: string
  ) {
    const httpClient = this.createHttpClient(accessToken, refreshToken);
    this.services = new Services(httpClient);
  }

  private handleTokenRefresh(
    tokens: { accessToken: string, refreshToken: string }
  ) {
    console.log('handleTokenRefresh', tokens);

    this.initServices(tokens.accessToken, tokens.refreshToken);
    this.setAccessTokenInStorage(tokens.accessToken);
    this.setRefreshTokenInStorage(tokens.refreshToken);
  }

  private getAccessTokenFromStorage() {
    return this.localStorage.getItem<string>('accessToken');
  }

  private getRefreshTokenFromStorage() {
    return this.localStorage.getItem<string>('refreshToken');
  }

  private setAccessTokenInStorage(accessToken: string) {
    this.localStorage.setItem('accessToken', accessToken);
  }

  private setRefreshTokenInStorage(refreshToken: string) {
    this.localStorage.setItem('refreshToken', refreshToken);
  }
}

const pluto = new Pluto();
MOUNT_CLASS_TO.pluto = pluto;
export default pluto;
