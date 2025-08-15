import { Injectable } from '@angular/core';
import { WebApp } from 'telegram-web-app';

@Injectable({ providedIn: 'root' })
export class TelegramService {
  private readonly webApp: WebApp | undefined;

  constructor() {
    if (window.Telegram.WebApp) {
      this.webApp = window.Telegram.WebApp;
      this.webApp.ready();
    }
  }

  getUser() {
    return this.webApp?.initDataUnsafe?.user;
  }

  close() {
    this.webApp?.close();
  }
}
