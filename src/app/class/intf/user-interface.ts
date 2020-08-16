export interface User 
{
  readonly uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  phoneNumber: string;
  readonly emailVerified: boolean;
  readonly isAnonymous: boolean;
  readonly isNewUser: boolean;
  readonly creationTime: string;
  readonly lastSinginTime: string;
}
