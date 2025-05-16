import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  getStorage(storageKey: string) {
    const item = localStorage.getItem(storageKey);

    if (!item) return null;

    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  }

  setStorage(storageKey: string, storageValue: any) {
    localStorage.setItem(storageKey, JSON.stringify(storageValue));
  }

  removeItemStorage(storageKey: string) {
    localStorage.removeItem(storageKey);
  }
}
