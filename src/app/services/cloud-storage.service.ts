import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, forkJoin, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudStorageService {
  constructor(private afStorage: AngularFireStorage) {}

  public uploadFile(file: File, uid: string) {
    return this.afStorage.upload(`${uid}/${file.name}`, file);
  }

  public downloadFile(filePath: string): Observable<any> {
    return this.afStorage.ref(filePath).getDownloadURL();
  }

  public downloadFiles(filesPath: Array<string>) {
    return forkJoin(filesPath.map(value => this.downloadFile(value)));
  }
}
