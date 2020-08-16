import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { from, Observable, throwError, of, Subject } from 'rxjs/index';
import { map, tap, filter, switchMap } from 'rxjs/internal/operators';
import { User } from '../../class/intf/user-interface';
import { LocalStorageService } from '../local-storage.service';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _currentAccount: User;
  private _onLogout: Subject<any> = new Subject();

  constructor(
    private _angularFireAuth: AngularFireAuth,
    private _localStorageService: LocalStorageService
  ) {}

  public createUserWithEmailAndPassword(
    email: string,
    password: string
  ): Observable<User> {
    return from(
      this._angularFireAuth.auth.createUserWithEmailAndPassword(email, password)
    ).pipe(
      map(userCredential => {
        return {
          uid: userCredential.user.uid,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          phoneNumber: userCredential.user.phoneNumber,
          email: userCredential.user.email,
          emailVerified: userCredential.user.emailVerified,
          isAnonymous: userCredential.user.isAnonymous,
          isNewUser: userCredential.additionalUserInfo.isNewUser,
          creationTime: userCredential.user.metadata.creationTime,
          lastSinginTime: userCredential.user.metadata.lastSignInTime
        };
      })
    );
  }

  public updateProfile(
    displayName?: string,
    photoURL?: string
  ): Observable<void> {
    return from(
      this._angularFireAuth.auth.currentUser.updateProfile({
        displayName,
        photoURL
      })
    );
  }

  public signInUserWithEmailAndPassword(
    email: string,
    password: string
  ): Observable<User> {
    return from(
      this._angularFireAuth.auth.signInWithEmailAndPassword(email, password)
    ).pipe(
      tap(val => this._localStorageService.deleteDiagrams()),
      map(userCredential => this.mapUserCredentialToUser(userCredential)),
      switchMap(user => {
        if (user.emailVerified) {
          return of(user);
        }
        return throwError({
          code: 'auth/email-not-verified',
          message: 'The email address is not verified'
        });
      }),
      tap(user => this.writeCurrentUser(user))
    );
  }

  private writeCurrentUser(user: User) {
    this._localStorageService.writeAccountSynchronously(user);
  }

  mapUserCredentialToUser(userCredential: UserCredential): User {
    return {
      uid: userCredential.user.uid,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
      phoneNumber: userCredential.user.phoneNumber,
      email: userCredential.user.email,
      emailVerified: userCredential.user.emailVerified,
      isAnonymous: userCredential.user.isAnonymous,
      isNewUser: userCredential.additionalUserInfo.isNewUser,
      creationTime: userCredential.user.metadata.creationTime,
      lastSinginTime: userCredential.user.metadata.lastSignInTime
    };
  }

  signInWithGoogle(): Observable<User> {
    return from(
      this._angularFireAuth.auth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider()
      )
    ).pipe(
      map(userCredentionl => this.mapUserCredentialToUser(userCredentionl)),
      tap(user => this.writeCurrentUser(user))
    );
  }

  signInWithFacebook(): Observable<User> {
    return from(
      this._angularFireAuth.auth.signInWithPopup(
        new firebase.auth.FacebookAuthProvider()
      )
    ).pipe(
      map(userCredentionl => this.mapUserCredentialToUser(userCredentionl)),
      tap(user => this.writeCurrentUser(user))
    );
  }

  public signOut(): Observable<void> {
    this._localStorageService.removeCurrentAccount();
    this._localStorageService.deleteDiagrams();
    this._onLogout.next();
    this.cancelCurrentAccount();
    return from(this._angularFireAuth.auth.signOut());
  }

  get onLogout(): Observable<any> {
    return this._onLogout.asObservable();
  }

  public sendEmailVerification(): Observable<any> {
    return from(
      this._angularFireAuth.auth.currentUser.sendEmailVerification()
    ).pipe(tap(_ => this._localStorageService.removeCurrentAccount()));
  }

  cancelCurrentAccount(): void {
    this._currentAccount = null;
  }

  isAccountLogged(): boolean {
    try {
      this._localStorageService.readCurrentAccount();
      return true;
    } catch (e) {
      return false;
    }
  }

  public getAuthenticatedAccount(): User {
    if (!this._currentAccount) {
      this._currentAccount = this._localStorageService.readCurrentAccount();
    }

    return this._currentAccount;
  }

  public sendPasswordResetEmail(email: string): Observable<void> {
    return from(this._angularFireAuth.auth.sendPasswordResetEmail(email));
  }

  public updateAccountProfile(photoURL: string) {
    this._currentAccount.photoURL = photoURL;
    this._localStorageService.writeAccountSynchronously(this._currentAccount);
  }
}
