import { NgModule } from '@angular/core';
import { RenameDiagramComponent } from 'src/app/components/rename-diagram/rename-diagram.component';
import { ShareDiagramComponent } from 'src/app/components/share-diagram/share-diagram.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '../font-awesome/font-awesome.module';
import { MaterialModule } from '../material/material.module';
import { FormularModule } from '../formular/formular.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GenerateLinkComponent } from 'src/app/components/generate-link/generate-link.component';

@NgModule({
  declarations: [RenameDiagramComponent,
    ShareDiagramComponent,
    GenerateLinkComponent],
  imports: [CommonModule,
    FontAwesomeModule,
    MaterialModule,
    FormularModule,
    DragDropModule],
  exports: [RenameDiagramComponent,
    ShareDiagramComponent,
    GenerateLinkComponent]
})
export class PopupModule { }
