import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, map, tap } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthChildGuardService implements CanActivateChild {
  constructor(
    private _localStorageService: LocalStorageService,
    private _router: Router,
    private _angularFireAuth: AngularFireAuth
  ) {}

  canActivateChild(
    childRoute: import('@angular/router').ActivatedRouteSnapshot,
    state: import('@angular/router').RouterStateSnapshot
  ): boolean | import('rxjs').Observable<boolean> | Promise<boolean> {
    return this._angularFireAuth.authState.pipe(
      first(),
      map(user => (user ? true : false)),
      tap(value => {
        if (!value) {
          this._router.navigateByUrl('/sign-in');
        }
      })
    );
  }
}
