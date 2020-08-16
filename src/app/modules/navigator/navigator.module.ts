import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageComponent } from '../../components/storage/storage.component';
import { ProfileComponent } from '../../components/profile/profile.component';
import { SharedComponent } from '../../components/shared/shared.component';
import { NavigatorComponent } from '../../components/navigator/navigator.component';
import { DiagramsHeaderComponent } from '../../components/diagrams-header/diagrams-header.component';
import { DiagramsBodyComponent } from '../../components/diagrams-body/diagrams-body.component';
import { RecentComponent } from '../../components/recent/recent.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormularModule } from '../formular/formular.module';
import { FontAwesomeModule } from '../font-awesome/font-awesome.module';
import { StorageOptionsComponent } from '../../components/storage-options/storage-options.component';
import { PopupModule } from '../popup/popup.module';
import { BrowserModule } from '@angular/platform-browser';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';
import { MaterialModule } from '../material/material.module';
import { CreateDiagramPopupComponent } from 'src/app/components/create-diagram-popup/create-diagram-popup.component';
import { LoaderComponent } from 'src/app/components/loader/loader.component';

@NgModule({
  declarations: [
    StorageComponent,
    ProfileComponent,
    SharedComponent,
    NavigatorComponent,
    DiagramsHeaderComponent,
    DiagramsBodyComponent,
    RecentComponent,
    StorageOptionsComponent,
    CreateDiagramPopupComponent,
    NotificationsComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserModule,
    FontAwesomeModule,
    FormularModule,
    AppRoutingModule,
    PopupModule
  ],
  exports: [
    StorageComponent,
    ProfileComponent,
    SharedComponent,
    NavigatorComponent,
    DiagramsHeaderComponent,
    DiagramsBodyComponent,
    RecentComponent,
    StorageOptionsComponent,
    LoaderComponent
  ]
})
export class NavigatorModule {}
