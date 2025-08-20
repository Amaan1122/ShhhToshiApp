import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { TonConnectService } from '../services/ton-connect.service';

@Injectable({
  providedIn: 'root',
})
export class WalletGuard implements CanActivate {
  constructor(
    private readonly tonConnectService: TonConnectService,
    private readonly router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isConnected = this.tonConnectService.isWalletConnected();

    if (isConnected) {
      return true;
    } else {
      // Redirect to home with returnUrl
      this.router.navigate(['/home'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
  }
}
