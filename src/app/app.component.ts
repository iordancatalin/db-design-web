import { Component } from "@angular/core";
import { FirestoreInterceptorService } from "./services/firestore/firestore-interceptor.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "database-design-cli";

  constructor(
    private _firestoreInterceptorService: FirestoreInterceptorService
  ) {}
}
