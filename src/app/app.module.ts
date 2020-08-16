import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MasterComponent } from './components/master/master.component';
import { SecurityModule } from './modules/security/security.module';
import { NavigatorModule } from './modules/navigator/navigator.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DiamgramBuilderModule } from './modules/diamgram-builder/diamgram-builder.module';
import { FireModule } from './modules/fire/fire.module';
import { VortexModule } from './modules/vortex/vortex.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaveIndicatorComponent } from './components/save-indicator/save-indicator.component';
import { MaterialModule } from './modules/material/material.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MasterComponent,
    SaveIndicatorComponent],
  imports: [
    DragDropModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FireModule,
    SecurityModule,
    NavigatorModule,
    DiamgramBuilderModule,
    VortexModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
