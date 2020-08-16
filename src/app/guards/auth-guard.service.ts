import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, catchError, tap, first } from 'rxjs/internal/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private _router: Router,
    private _angularFireAuth: AngularFireAuth
  ) {}

  canActivate(
    route: import('@angular/router').ActivatedRouteSnapshot,
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
