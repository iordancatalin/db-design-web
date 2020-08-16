import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private static FIRESTORE_SERVICE: FirestoreService;

  constructor(private firestoreService: FirestoreService) {
    CommonService.FIRESTORE_SERVICE = firestoreService;
  }

  public static createId(): string {
    return CommonService.FIRESTORE_SERVICE.createId();
  }
}
