import { Injectable } from '@angular/core';
import { Observable, of, Subscription, from, throwError } from 'rxjs/index';
import {
  switchMap,
  tap,
  take,
  flatMap,
  takeUntil
} from 'rxjs/internal/operators';
import { Position } from '../../class/graphics/position';
import { Relation } from '../../class/model/db/accessory/relation';
import { CheckConstraint } from '../../class/model/db/check-constraint/check-constraint';
import { ColumnBuilder } from '../../class/model/db/column/builder/column-builder';
import { Column } from '../../class/model/db/column/column';
import { DiagramBuilder } from '../../class/model/db/diagram/builder/diagram-builder';
import { Diagram } from '../../class/model/db/diagram/diagram';
import { ForeignKeyConstraint } from '../../class/model/db/foreign-key/foreign-key-constraint';
import { TableBuilder } from '../../class/model/db/table/builder/table-builder';
import { Table } from '../../class/model/db/table/table';
import { UniqueConstraint } from '../../class/model/db/unique-constraint/unique-constraint';
import { HtmlCheckConstraint } from '../../class/model/html/check-constraint/html-check-constraint';
import { HtmlColumn } from '../../class/model/html/column/html-column';
import { HtmlDiagram } from '../../class/model/html/diagram/html-diagram';
import { HtmlForeignKey } from '../../class/model/html/foreign-key/html-foreign-key';
import { HtmlTable } from '../../class/model/html/table/html-table';
import { HtmlUniqueConstraint } from '../../class/model/html/unique-constraint/html-unique-constraint';
import { FirestoreService } from './firestore.service';
import { BasicAccount } from 'src/app/class/model/basic/account/basic-account';
import { getSuperPosition } from 'src/app/class/constants/constants';
import { SaveIndicatorService } from '../save-indicator.service';
import { CommonService } from '../common.service';
import { AuthenticationService } from '../security/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreInterceptorService {
  constructor(
    private firestoreService: FirestoreService,
    private _saveIndicatorService: SaveIndicatorService,
    private _authenticationService: AuthenticationService
  ) {}

  public updateOrCreateHtmlForeignKey(htmlForeignKey: HtmlForeignKey): void {
    const diagramId: string = htmlForeignKey.diagramId;

    if (!htmlForeignKey.name) {
      htmlForeignKey.name = `FK_${CommonService.createId()}`;
    }

    this.showSaveIndicator();
    const subscription: Subscription = this.firestoreService
      .getForeignKey(diagramId, htmlForeignKey.id)
      .subscribe(val => {
        if (val.exists) {
          this.firestoreService
            .updateForeignKey(diagramId, htmlForeignKey.build())
            .then(
              _ => subscription.unsubscribe(),
              _ => subscription.unsubscribe()
            )
            .then(_ => this.hideSaveIndicator());
        } else {
          this.firestoreService
            .createForeignKey(diagramId, htmlForeignKey.build())
            .then(
              _ => subscription.unsubscribe(),
              _ => subscription.unsubscribe()
            )
            .then(_ => this.hideSaveIndicator());
        }
      });
  }

  public updateOrCreateHtmlCheckConstraint(
    htmlCheckConstraint: HtmlCheckConstraint
  ): void {
    const diagramId: string = htmlCheckConstraint.diagramId;
    const tableId: string = htmlCheckConstraint.tableId;

    console.log(htmlCheckConstraint);

    this.showSaveIndicator();
    const subscription: Subscription = this.firestoreService
      .getCheckConstraint(diagramId, tableId, htmlCheckConstraint.id)
      .subscribe(val => {
        if (val.exists) {
          this.firestoreService
            .updateCheckConstraint(
              diagramId,
              tableId,
              htmlCheckConstraint.build()
            )
            .then(
              _ => subscription.unsubscribe(),
              _ => subscription.unsubscribe()
            )
            .then(_ => this.hideSaveIndicator());
        } else {
          this.firestoreService
            .createCheckConstraint(
              diagramId,
              tableId,
              htmlCheckConstraint.build()
            )
            .then(
              _ => subscription.unsubscribe(),
              _ => subscription.unsubscribe()
            )
            .then(_ => this.hideSaveIndicator());
        }
      });
  }

  public updateOrCreateUniqueConstraint(
    htmlUniqueConstraint: HtmlUniqueConstraint
  ): void {
    const diagramId: string = htmlUniqueConstraint.diagramId;
    const tableId: string = htmlUniqueConstraint.tableId;

    this.showSaveIndicator();
    const subscription: Subscription = this.firestoreService
      .getUniqueConstraint(diagramId, tableId, htmlUniqueConstraint.id)
      .subscribe(val => {
        if (val.exists) {
          this.firestoreService
            .updateUniqueConstraint(
              diagramId,
              tableId,
              htmlUniqueConstraint.build()
            )
            .then(
              _ => subscription.unsubscribe(),
              _ => subscription.unsubscribe()
            )
            .then(_ => this.hideSaveIndicator());
        } else {
          this.firestoreService
            .createUniqueConstraint(
              diagramId,
              tableId,
              htmlUniqueConstraint.build()
            )
            .then(
              _ => subscription.unsubscribe(),
              _ => subscription.unsubscribe()
            )
            .then(_ => this.hideSaveIndicator());
        }
      });
  }

  public updateOrCreateTable(htmlTable: HtmlTable): void {
    const diagramId: string = htmlTable.diagramId;

    this.showSaveIndicator();
    const subscription: Subscription = this.firestoreService
      .getTable(diagramId, htmlTable.id)
      .subscribe(val => {
        const buildTable: Table = htmlTable.build();
        if (val.exists) {
          this.firestoreService
            .updateTable(diagramId, buildTable)
            .then(
              _ => subscription.unsubscribe(),
              _ => subscription.unsubscribe()
            )
            .then(_ => this.hideSaveIndicator());
        } else {
          this.firestoreService
            .createTable(diagramId, buildTable)
            .then(
              _ => subscription.unsubscribe(),
              _ => subscription.unsubscribe()
            )
            .then(_ => this.hideSaveIndicator());
        }
      });
  }

  public updateOrCreateDiagram(htmlDiagram: HtmlDiagram): Observable<void> {
    this.showSaveIndicator();
    return this.firestoreService.getDiagram(htmlDiagram.id).pipe(
      switchMap(val => {
        if (val.exists) {
          return this.firestoreService.updateDiagram(htmlDiagram.build());
        } else {
          return this.firestoreService.createDiagram(htmlDiagram.build());
        }
      }),
      tap(_ => this.hideSaveIndicator()),
      take(1)
    );
  }

  public updateDiagramName(id: string, name: string): any {
    return this.firestoreService.updateDiagramName(id, name);
  }

  public updateOrCreateColumn(htmlColumn: HtmlColumn): void {
    const diagramId: string = htmlColumn.diagramId;
    const tableId: string = htmlColumn.tableId;

    this.showSaveIndicator();
    const subscription: Subscription = this.firestoreService
      .getColumn(diagramId, tableId, htmlColumn.id)
      .subscribe(val => {
        if (val.exists) {
          this.firestoreService
            .updateColumn(diagramId, tableId, htmlColumn.build())
            .then(
              _ => subscription.unsubscribe(),
              _ => subscription.unsubscribe()
            )
            .then(_ => this.hideSaveIndicator());
        } else {
          this.firestoreService
            .createColumn(diagramId, tableId, htmlColumn.build())
            .then(
              _ => subscription.unsubscribe(),
              _ => subscription.unsubscribe()
            )
            .then(_ => this.hideSaveIndicator());
        }
      });
  }

  public deleteCheckConstraint(htmlCheckConstraint: HtmlCheckConstraint): void {
    const diagramId: string = htmlCheckConstraint.diagramId;
    const tableId: string = htmlCheckConstraint.tableId;

    this.showSaveIndicator();
    this.firestoreService
      .deleteCheckConstraint(diagramId, tableId, htmlCheckConstraint.id)
      .then(_ => this.hideSaveIndicator());
  }

  public deleteUniqueConstraint(
    htmlUniqueConstraint: HtmlUniqueConstraint
  ): void {
    const diagramId: string = htmlUniqueConstraint.diagramId;
    const tableId: string = htmlUniqueConstraint.tableId;

    this.showSaveIndicator();
    this.firestoreService
      .deleteUniqueConstraint(diagramId, tableId, htmlUniqueConstraint.id)
      .then(_ => this.hideSaveIndicator());
  }

  public deleteColumn(htmlColumn: HtmlColumn): void {
    const diagramId: string = htmlColumn.diagramId;
    const tableId: string = htmlColumn.tableId;

    console.log(tableId);
    console.log(diagramId);
    console.log(htmlColumn);

    this.showSaveIndicator();
    this.firestoreService
      .deleteColumn(diagramId, tableId, htmlColumn.id)
      .then(_ => this.hideSaveIndicator());
  }

  public deleteTableAndFks(
    htmlTable: HtmlTable,
    constraints: Array<HtmlForeignKey>
  ): void {
    const diagramId: string = htmlTable.diagramId;

    this.showSaveIndicator();
    this.firestoreService
      .deleteTableAndFks(
        diagramId,
        htmlTable.build(),
        constraints.map(value => value.id)
      )
      .then(_ => this.hideSaveIndicator());
  }

  public deleteForeignKey(htmlForeignKey: HtmlForeignKey): void {
    const diagramId: string = htmlForeignKey.diagramId;

    this.showSaveIndicator();
    this.firestoreService
      .deleteForeignKey(diagramId, htmlForeignKey.id)
      .then(_ => this.hideSaveIndicator());
  }

  public deleteDiagram(htmlDiagram: HtmlDiagram): void {
    this.showSaveIndicator();
    this.firestoreService
      .deleteDiagram(htmlDiagram.build())
      .then(_ => this.hideSaveIndicator());
  }

  public updateTablePrimaryKeyName(
    primaryKey: string,
    tableId: string,
    diagramId: string
  ) {
    this.showSaveIndicator();
    this.firestoreService
      .updateTablePrimaryKeyName(diagramId, tableId, {
        primaryKeyName: primaryKey
      })
      .then(_ => this.hideSaveIndicator());
  }

  public clearAllDiagram(diagram: HtmlDiagram): Promise<any> {
    const diagramId: string = diagram.id;
    const tables: Array<Table> = !diagram.htmlTables
      ? []
      : diagram.htmlTables.map(val => val.build());
    const foreignKeys: Array<ForeignKeyConstraint> = !diagram.htmlForeignKeys
      ? []
      : diagram.htmlForeignKeys.map(val => val.build());

    this.showSaveIndicator();
    return this.firestoreService
      .clearAllDiagram(diagramId, tables, foreignKeys)
      .then(_ => this.hideSaveIndicator());
  }

  public removeMultipleColumns(htmlColumns: Array<HtmlColumn>): void {
    if (!htmlColumns || !htmlColumns.length) {
      return;
    }

    const diagramId: string = htmlColumns[0].diagramId;
    const tableId: string = htmlColumns[0].tableId;
    const columns: Array<Column> = htmlColumns.map(val => val.build());

    this.showSaveIndicator();
    this.firestoreService
      .removeMultipleColumns(diagramId, tableId, columns)
      .then(_ => this.hideSaveIndicator());
  }

  public removeMultipleForeignKeys(foreignKeys: Array<HtmlForeignKey>): void {
    if (foreignKeys && foreignKeys.length) {
      const diagramId: string = foreignKeys[0].diagramId;
      this.showSaveIndicator();
      this.firestoreService
        .removeMultipleForeignKeys(
          diagramId,
          foreignKeys.map(val => val.build())
        )
        .then(_ => this.hideSaveIndicator());
    }
  }

  public updateMultipleForeignKeys(foreignKeys: Array<HtmlForeignKey>): void {
    if (foreignKeys && foreignKeys.length) {
      const diagramId: string = foreignKeys[0].diagramId;
      this.showSaveIndicator();
      this.firestoreService
        .updateMultipleForeignKeys(
          diagramId,
          foreignKeys.map(val => val.build())
        )
        .then(_ => this.hideSaveIndicator());
    }
  }

  public updateMultipleTables(htmlTables: Array<HtmlTable>): void {
    if (htmlTables && htmlTables.length) {
      const diagramId: string = htmlTables[0].diagramId;
      this.showSaveIndicator();
      this.firestoreService
        .updateMultipleTables(diagramId, htmlTables.map(val => val.build()))
        .then(_ => this.hideSaveIndicator());
    }
  }

  public watchDiagram(diagramId: string): Observable<Diagram> {
    return this.firestoreService
      .watchDiagram(diagramId)
      .pipe(
        switchMap(val => {
          const data: any = val.payload.data();

          if (!val.payload.exists) {
            return throwError('Diagram doesn\'t exists');
          }

          const builder: DiagramBuilder = new DiagramBuilder(val.payload.id)
            .withName(data.name)
            .withCreationDate(new Date(data.creationDate))
            .withOwner(data.owner as BasicAccount)
            .withShareList(data.shareList as Array<BasicAccount>)
            .withPosition(getSuperPosition());

          return of(builder.build());
        })
      )
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public watchTables(diagramId: string): Observable<Array<Table>> {
    return this.firestoreService
      .watchTables(diagramId)
      .pipe(
        switchMap(val => {
          return of(
            val
              .map(value => value.payload.doc)
              .map(value => {
                const data: any = value.data();
                return new TableBuilder(value.id)
                  .withName(data.name)
                  .withPosition(
                    new Position(data.position.left, data.position.top)
                  )
                  .withEditableMode(data.editableMode)
                  .withWidth(data.width)
                  .withComment(data.comment)
                  .withPrimaryKeyName(data.primaryKeyName)
                  .build();
              })
          );
        })
      )
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public watchColumns(
    diagramId: string,
    tableId: string
  ): Observable<Array<Column>> {
    return this.firestoreService
      .watchColumns(diagramId, tableId)
      .pipe(
        switchMap(val => {
          return of(
            val
              .map(value => value.payload.doc)
              .map(value => {
                const data: any = value.data();

                return new ColumnBuilder(value.id)
                  .withType(data.type)
                  .withName(data.name)
                  .withNullable(data.nullable)
                  .withAutoincrement(data.autoincrement)
                  .withUnique(data.unique)
                  .withComment(data.comment)
                  .withPrimaryKey(data.primaryKey)
                  .withForeignKey(data.foreignKey)
                  .withDefaultValue(data.defaultValue)
                  .build();
              })
          );
        })
      )
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public watchForeignKeys(
    diagramId: string
  ): Observable<Array<ForeignKeyConstraint>> {
    return this.firestoreService
      .watchForeignKeys(diagramId)
      .pipe(
        switchMap(val =>
          of(
            val
              .map(value => value.payload.doc)
              .map(value => {
                const data: any = value.data();

                const constraint: ForeignKeyConstraint = new ForeignKeyConstraint(
                  value.id
                );
                constraint.nameWithoutEmit = data.name;
                constraint.commentWithoutEmit = data.comment;
                constraint.childTableId = data.childTableId;
                constraint.parentTableId = data.parentTableId;

                if (data.relations) {
                  constraint.relations = data.relations.map(
                    relation =>
                      new Relation(
                        relation.childColumnId,
                        relation.parentColumnId
                      )
                  );
                }

                return constraint;
              })
          )
        )
      )
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public watchCheckConstraints(
    tableId: string,
    diagramId: string
  ): Observable<Array<CheckConstraint>> {
    return this.firestoreService
      .watchCheckConstraints(tableId, diagramId)
      .pipe(
        switchMap(val =>
          of(
            val
              .map(value => value.payload.doc)
              .map(value => {
                const data: any = value.data();

                const constraint: CheckConstraint = new CheckConstraint(
                  value.id
                );
                constraint.name = data.name;
                constraint.expression = data.expression;

                return constraint;
              })
          )
        )
      )
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public watchUniqueConstraints(
    tableId: string,
    diagramId: string
  ): Observable<Array<UniqueConstraint>> {
    return this.firestoreService
      .watchUniqueConstraints(tableId, diagramId)
      .pipe(
        switchMap(val =>
          of(
            val
              .map(value => value.payload.doc)
              .map(value => {
                const data: any = value.data();

                const constraint: UniqueConstraint = new UniqueConstraint(
                  value.id
                );
                constraint.name = data.name;
                constraint.columns = data.columns;

                return constraint;
              })
          )
        )
      )
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public getAllCurrentAccountDiagrams(): Observable<Array<Diagram>> {
    return this.firestoreService
      .getAllCurrentAccountDiagrams()
      .pipe(
        switchMap(val =>
          of(
            val.docs.map(value => {
              const data = value.data();

              return new DiagramBuilder(value.id)
                .withName(data.name)
                .withCreationDate(data.creationDate)
                .build();
            })
          )
        )
      )
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public getAllSharedWithCurrentAccountDiagrams(): Observable<Array<Diagram>> {
    return this.firestoreService
      .getAllSharedWithCurrentAccountDiagrams()
      .pipe(
        switchMap(val =>
          of(
            val.docs.map(value => {
              const data = value.data();

              return new DiagramBuilder(value.id)
                .withName(data.name)
                .withCreationDate(data.creationDate)
                .build();
            })
          )
        )
      )
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public updateDiagramShareList(id: string, email: string): Observable<any> {
    return this.firestoreService.getDiagram(id).pipe(
      flatMap(value => {
        const shareList = value.data().shareList as Array<string>;

        if (value.data().owner === email) {
          return throwError('Cannot share a diagram with yourself');
        }

        if (shareList.findIndex((val: string) => val === email) === -1) {
          shareList.push(email);
          return from(
            this.firestoreService.updateDiagramShareList(id, shareList)
          );
        }

        return throwError('Diagram already shared with this user');
      }),
      take(1),
      takeUntil(this._authenticationService.onLogout)
    );
  }

  public getCheckConstraints(
    diagramId: string,
    tableId: string
  ): Observable<Array<CheckConstraint>> {
    return this.firestoreService.getCheckConstraints(diagramId, tableId).pipe(
      switchMap(val =>
        of(
          val
            .map(value => value.payload.doc)
            .map(value => {
              const data: any = value.data();

              const constraint: CheckConstraint = new CheckConstraint(value.id);
              constraint.name = data.name;
              constraint.expression = data.expression;

              return constraint;
            })
        )
      ),
      take(1),
      takeUntil(this._authenticationService.onLogout)
    );
  }

  public getUniqueConstraints(
    diagramId: string,
    tableId: string
  ): Observable<Array<UniqueConstraint>> {
    return this.firestoreService.getUniqueConstraints(diagramId, tableId).pipe(
      switchMap(val =>
        of(
          val
            .map(value => value.payload.doc)
            .map(value => {
              const data: any = value.data();

              const constraint: UniqueConstraint = new UniqueConstraint(
                value.id
              );
              constraint.name = data.name;
              constraint.columns = data.columns;

              return constraint;
            })
        )
      ),
      take(1),
      takeUntil(this._authenticationService.onLogout)
    );
  }

  private showSaveIndicator() {
    this._saveIndicatorService.emit(true);
  }

  private hideSaveIndicator() {
    this._saveIndicatorService.emit(false);
  }
}
