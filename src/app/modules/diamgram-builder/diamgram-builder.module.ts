import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbuilderComponent } from '../../components/dbuilder/dbuilder.component';
import { PkDirective } from '../../directives/pk.directive';
import { DbTableComponent } from '../../components/db-table/db-table.component';
import { DiagramComponent } from '../../components/diagram/diagram.component';
import { PickDiagramComponent } from '../../components/pick-diagram/pick-diagram.component';
import { DbColumnComponent } from '../../components/db-column/db-column.component';
import { DheaderComponent } from '../../components/dheader/dheader.component';
import { DiagramToolsComponent } from '../../components/diagram-tools/diagram-tools.component';
import { DiagramOptionsComponent } from '../../components/diagram-options/diagram-options.component';
import { FindTableComponent } from '../../components/find-table/find-table.component';
import { TableMoreComponent } from '../../components/table-more/table-more.component';
import { RelationPopupComponent } from '../../components/relation-popup/relation-popup.component';
import { DataTypeComponent } from '../../components/data-type/data-type.component';
import { DbuilderDefaultComponent } from '../../components/dbuilder-default/dbuilder-default.component';
import { ColumnComponent } from '../../components/more/column/column.component';
import { CheckConstraintComponent } from '../../components/more/check-constraint/check-constraint.component';
import { UniqueConstraintComponent } from '../../components/more/unique-constraint/unique-constraint.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '../font-awesome/font-awesome.module';
import { FormularModule } from '../formular/formular.module';
import { LoadStorageComponent } from 'src/app/components/load-storage/load-storage.component';
import { MaterialModule } from '../material/material.module';
import { LoadStorageDiagramsComponent } from 'src/app/components/load-storage-diagrams/load-storage-diagrams.component';
import { PopupModule } from '../popup/popup.module';
import { GenerateSqlComponent } from 'src/app/components/generate-sql/generate-sql.component';
import { LoaderComponent } from 'src/app/components/loader/loader.component';
import { NavigatorModule } from '../navigator/navigator.module';

@NgModule({
  declarations: [
    LoadStorageComponent,
    LoadStorageDiagramsComponent,
    DbuilderComponent,
    PkDirective,
    DbTableComponent,
    DiagramComponent,
    PickDiagramComponent,
    DbColumnComponent,
    DheaderComponent,
    DiagramToolsComponent,
    DiagramOptionsComponent,
    FindTableComponent,
    TableMoreComponent,
    RelationPopupComponent,
    DataTypeComponent,
    DbuilderDefaultComponent,
    ColumnComponent,
    CheckConstraintComponent,
    UniqueConstraintComponent,
    GenerateSqlComponent],
  imports: [
    CommonModule,
    DragDropModule,
    FontAwesomeModule,
    FormularModule,
    MaterialModule,
    PopupModule,
    NavigatorModule
  ]
})
export class DiamgramBuilderModule {}
