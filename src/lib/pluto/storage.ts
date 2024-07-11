import {logger} from '../logger';

export class LocalStorageService {
  private log: ReturnType<typeof logger>;

  constructor() {
    this.log = logger('LOCAL STORAGE');
  }

  public setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch(error) {
      this.log(`Error setting item in local storage: ${error}`);
    }
  }

  // Get the value associated with a key from local storage
  public getItem<T>(key: string): T | null {
    try {
      const serializedValue = localStorage.getItem(key);
      if(serializedValue === null) {
        return null;
      }
      return JSON.parse(serializedValue) as T;
    } catch(error) {
      this.log(`Error getting item from local storage: ${error}`);
      return null;
    }
  }

  // Remove a key-value pair from local storage
  public removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch(error) {
      this.log(`Error removing item from local storage: ${error}`);
    }
  }

  // Clear all key-value pairs from local storage
  public clear(): void {
    try {
      localStorage.clear();
    } catch(error) {
      this.log(`Error clearing local storage: ${error}`);
    }
  }

  // Check if a key exists in local storage
  public containsKey(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
