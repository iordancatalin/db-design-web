import { Injectable } from '@angular/core';
import {
  Action,
  AngularFirestore,
  AngularFirestoreDocument,
  DocumentChangeAction,
  DocumentSnapshot
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, from } from 'rxjs/index';
import { Util } from '../../class/common/util';
import {
  CHECK_CONSTRAINTS_COLLECTION,
  COLUMNS_COLLECTION,
  DIAGRAMS_COLLECTION,
  FOREIGN_KEYS_COLLECTION,
  TABLES_COLLECTION,
  UNIQUE_CONSTRAINTS_COLLECTION
} from '../../class/constants/firestore-constrants';
import { Column } from '../../class/model/db/column/column';
import { CheckConstraint } from '../../class/model/db/check-constraint/check-constraint';
import { ForeignKeyConstraint } from '../../class/model/db/foreign-key/foreign-key-constraint';
import { UniqueConstraint } from '../../class/model/db/unique-constraint/unique-constraint';
import { Diagram } from '../../class/model/db/diagram/diagram';
import { Table } from '../../class/model/db/table/table';
import WriteBatch = firebase.firestore.WriteBatch;
import { AuthenticationService } from '../security/authentication.service';
import { BasicDiagram } from 'src/app/class/model/basic/diagram/basic-diagram';
import { takeUntil } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(
    private firestore: AngularFirestore,
    private _authenticationService: AuthenticationService
  ) {}

  public createCheckConstraint(
    diagramId: string,
    tableId: string,
    constraint: CheckConstraint
  ): Promise<any> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(CHECK_CONSTRAINTS_COLLECTION)
      .doc(constraint.id)
      .set(Util.toJSObject(constraint.toBasicObject()));
  }

  public createUniqueConstraint(
    diagramId: string,
    tableId: string,
    constraint: UniqueConstraint
  ): Promise<any> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(UNIQUE_CONSTRAINTS_COLLECTION)
      .doc(constraint.id)
      .set(Util.toJSObject(constraint.toBasicObject()));
  }

  public createColumn(
    diagramId: string,
    tableId: string,
    column: Column
  ): Promise<any> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(COLUMNS_COLLECTION)
      .doc(column.id)
      .set(Util.toJSObject(column.toBasicObject()));
  }

  private createColumnWithBatch(
    diagramId: string,
    tableId: string,
    column: Column,
    batch: WriteBatch
  ): void {
    const docRef: AngularFirestoreDocument<any> = this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(COLUMNS_COLLECTION)
      .doc(column.id);

    batch.set(docRef.ref, Util.toJSObject(column.toBasicObject()));
  }

  private createCheckConstraintWithBatch(
    diagramId: string,
    tableId: string,
    constraint: CheckConstraint,
    batch: WriteBatch
  ): void {
    const docRef: AngularFirestoreDocument<any> = this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(CHECK_CONSTRAINTS_COLLECTION)
      .doc(constraint.id);

    batch.set(docRef.ref, Util.toJSObject(constraint.toBasicObject()));
  }

  private createUniqueConstraintWithBatch(
    diagramId: string,
    tableId: string,
    constraint: UniqueConstraint,
    batch: WriteBatch
  ): void {
    const docRef: AngularFirestoreDocument<any> = this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(UNIQUE_CONSTRAINTS_COLLECTION)
      .doc(constraint.id);

    batch.set(docRef.ref, Util.toJSObject(constraint.toBasicObject()));
  }

  public createTable(diagramId: string, table: Table): Promise<any> {
    const batch: WriteBatch = this.firestore.firestore.batch();
    const tableId: string = table.id;
    const columns: Array<Column> = table.columns;
    const checkConstraints: Array<CheckConstraint> = table.checkConstraints;
    const uniqueConstraints: Array<UniqueConstraint> = table.uniqueConstraints;

    const docRef: AngularFirestoreDocument<any> = this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId);

    batch.set(docRef.ref, Util.toJSObject(table.toBasicObject()));

    columns.forEach(column =>
      this.createColumnWithBatch(diagramId, tableId, column, batch)
    );
    checkConstraints.forEach(constraint =>
      this.createCheckConstraintWithBatch(diagramId, tableId, constraint, batch)
    );
    uniqueConstraints.forEach(constraint =>
      this.createUniqueConstraintWithBatch(
        diagramId,
        tableId,
        constraint,
        batch
      )
    );

    return batch.commit();
  }

  private createTableWithBatch(
    diagramId: string,
    table: Table,
    batch: WriteBatch
  ): void {
    const tableId: string = table.id;
    const columns: Array<Column> = table.columns;
    const checkConstraints: Array<CheckConstraint> = table.checkConstraints;
    const uniqueConstraints: Array<UniqueConstraint> = table.uniqueConstraints;

    const docRef: AngularFirestoreDocument<any> = this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId);

    batch.set(docRef.ref, Util.toJSObject(table.toBasicObject()));

    columns.forEach(column =>
      this.createColumnWithBatch(diagramId, tableId, column, batch)
    );
    checkConstraints.forEach(constraint =>
      this.createCheckConstraintWithBatch(diagramId, tableId, constraint, batch)
    );
    uniqueConstraints.forEach(constraint =>
      this.createUniqueConstraintWithBatch(
        diagramId,
        tableId,
        constraint,
        batch
      )
    );
  }

  public createForeignKey(
    diagramId: string,
    foreignKey: ForeignKeyConstraint
  ): Promise<any> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(FOREIGN_KEYS_COLLECTION)
      .doc(foreignKey.id)
      .set(Util.toJSObject(foreignKey.toBasicObject()));
  }

  private createForeignKeyWithBatch(
    diagramId: string,
    foreignKey: ForeignKeyConstraint,
    batch: WriteBatch
  ): void {
    const docRef: AngularFirestoreDocument<any> = this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(FOREIGN_KEYS_COLLECTION)
      .doc(foreignKey.id);

    batch.set(docRef.ref, Util.toJSObject(foreignKey.toBasicObject()));
  }

  public createDiagram(diagram: Diagram): Promise<any> {
    diagram.creationDate = new Date();

    const batch: WriteBatch = this.firestore.firestore.batch();
    const diagramId: string = diagram.id;
    const foreignKeys: Array<ForeignKeyConstraint> = diagram.foreignKeys;
    const tables: Array<Table> = diagram.tables;
    const docRef: AngularFirestoreDocument<any> = this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId);
    const baicDiagram: BasicDiagram = diagram.toBasicObject();

    baicDiagram.owner = this._authenticationService.getAuthenticatedAccount().email;
    batch.set(docRef.ref, Util.toJSObject(baicDiagram));

    foreignKeys.forEach(val =>
      this.createForeignKeyWithBatch(diagramId, val, batch)
    );
    tables.forEach(table => this.createTableWithBatch(diagramId, table, batch));

    return batch.commit();
  }

  public getCheckConstraint(
    diagramId: string,
    tableId: string,
    constraintId: string
  ): Observable<any> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(CHECK_CONSTRAINTS_COLLECTION)
      .doc(constraintId)
      .get()
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public getUniqueConstraint(
    diagramId: string,
    tableId: string,
    constraintId: string
  ): Observable<any> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(UNIQUE_CONSTRAINTS_COLLECTION)
      .doc(constraintId)
      .get()
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public getColumn(
    diagrmId: string,
    tableId: string,
    columnId: string
  ): Observable<any> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagrmId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(COLUMNS_COLLECTION)
      .doc(columnId)
      .get()
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public getTable(diagramId: string, tableId: string): Observable<any> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .get()
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public getForeignKey(
    diagramId: string,
    foreignKeyId: string
  ): Observable<any> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(FOREIGN_KEYS_COLLECTION)
      .doc(foreignKeyId)
      .get()
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public getDiagram(diagramId: string): Observable<any> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .get()
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public updateCheckConstraint(
    diagramId: string,
    tableId: string,
    constraint: CheckConstraint
  ): Promise<void> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(CHECK_CONSTRAINTS_COLLECTION)
      .doc(constraint.id)
      .update(Util.toJSObject(constraint.toBasicObject()));
  }

  public updateUniqueConstraint(
    diagramId: string,
    tableId: string,
    constraint: UniqueConstraint
  ): Promise<void> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(UNIQUE_CONSTRAINTS_COLLECTION)
      .doc(constraint.id)
      .update(Util.toJSObject(constraint.toBasicObject()));
  }

  public updateTable(diagramId: string, table: Table): Promise<void> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(table.id)
      .update(Util.toJSObject(table.toBasicObject()));
  }

  public updateForeignKey(
    diagramId: string,
    foreignKey: ForeignKeyConstraint
  ): Promise<void> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(FOREIGN_KEYS_COLLECTION)
      .doc(foreignKey.id)
      .update(Util.toJSObject(foreignKey.toBasicObject()));
  }

  public updateColumn(
    diagramId: string,
    tableId: string,
    column: Column
  ): Promise<any> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(COLUMNS_COLLECTION)
      .doc(column.id)
      .update(Util.toJSObject(column.toBasicObject()));
  }

  public updateDiagram(diagram: Diagram): Promise<void> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagram.id)
      .update(Util.toJSObject(diagram.toBasicObject()));
  }

  public deleteCheckConstraint(
    diagramId: string,
    tableId: string,
    constraintId: string
  ): Promise<void> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(CHECK_CONSTRAINTS_COLLECTION)
      .doc(constraintId)
      .delete();
  }

  public deleteUniqueConstraint(
    diagramId: string,
    tableId: string,
    constraintId: string
  ): Promise<void> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(UNIQUE_CONSTRAINTS_COLLECTION)
      .doc(constraintId)
      .delete();
  }

  public deleteColumn(
    diagramId: string,
    tableId: string,
    columnId: string
  ): Promise<void> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(COLUMNS_COLLECTION)
      .doc(columnId)
      .delete();
  }

  public deleteTableAndFks(
    diagramId: string,
    table: Table,
    constraints: Array<string>
  ): Promise<void> {
    const batch: WriteBatch = this.firestore.firestore.batch();
    const tableId: string = table.id;
    const diagramDocRef: AngularFirestoreDocument<
      any
    > = this.firestore.collection(DIAGRAMS_COLLECTION).doc(diagramId);
    const docRef: AngularFirestoreDocument<any> = this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId);

    if (table.columns) {
      table.columns
        .map(val => val.id)
        .forEach(val =>
          this.deleteColumnWithBatch(diagramId, tableId, val, batch)
        );
    }

    if (table.checkConstraints) {
      table.checkConstraints
        .map(val => val.id)
        .forEach(val =>
          this.deleteCheckConstraintWithBatch(diagramId, tableId, val, batch)
        );
    }

    if (table.uniqueConstraints) {
      table.uniqueConstraints
        .map(val => val.id)
        .forEach(val =>
          this.deleteUniqueConstraintWithBatch(diagramId, tableId, val, batch)
        );
    }

    constraints.forEach(constraintId =>
      batch.delete(
        diagramDocRef.collection(FOREIGN_KEYS_COLLECTION).doc(constraintId).ref
      )
    );

    batch.delete(docRef.ref);

    return batch.commit();
  }

  public clearAllDiagram(
    diagramId: string,
    tables: Array<Table>,
    foreignKeys: Array<ForeignKeyConstraint>
  ): Promise<any> {
    const batch: WriteBatch = this.firestore.firestore.batch();

    if (tables) {
      tables.forEach(val => this.deleteTableWithBatch(diagramId, val, batch));
    }

    if (foreignKeys) {
      foreignKeys
        .map(val => val.id)
        .forEach(val => this.deleteForeignKeyWitchBatch(diagramId, val, batch));
    }

    return batch.commit();
  }

  private deleteTableWithBatch(
    diagramId: string,
    table: Table,
    batch: WriteBatch
  ): void {
    const tableId: string = table.id;
    const docRef: AngularFirestoreDocument<any> = this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId);

    if (table.columns) {
      table.columns
        .map(val => val.id)
        .forEach(val =>
          this.deleteColumnWithBatch(diagramId, tableId, val, batch)
        );
    }

    if (table.checkConstraints) {
      table.checkConstraints
        .map(val => val.id)
        .forEach(val =>
          this.deleteCheckConstraintWithBatch(diagramId, tableId, val, batch)
        );
    }

    if (table.uniqueConstraints) {
      table.uniqueConstraints
        .map(val => val.id)
        .forEach(val =>
          this.deleteUniqueConstraintWithBatch(diagramId, tableId, val, batch)
        );
    }

    batch.delete(docRef.ref);
  }

  private deleteForeignKeyWitchBatch(
    diagramId: string,
    constraintId: string,
    batch: WriteBatch
  ): void {
    const docRef: AngularFirestoreDocument<any> = this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(FOREIGN_KEYS_COLLECTION)
      .doc(constraintId);

    batch.delete(docRef.ref);
  }

  private deleteColumnWithBatch(
    diagramId: string,
    tableId: string,
    columnId: string,
    batch: WriteBatch
  ): void {
    const docRef: AngularFirestoreDocument<any> = this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(COLUMNS_COLLECTION)
      .doc(columnId);

    batch.delete(docRef.ref);
  }

  private deleteCheckConstraintWithBatch(
    diagramId: string,
    tableId: string,
    constraintId: string,
    batch: WriteBatch
  ): void {
    const docRef: AngularFirestoreDocument<any> = this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(CHECK_CONSTRAINTS_COLLECTION)
      .doc(constraintId);

    batch.delete(docRef.ref);
  }

  private deleteUniqueConstraintWithBatch(
    diagramId: string,
    tableId: string,
    constraintId: string,
    batch: WriteBatch
  ): void {
    const docRef: AngularFirestoreDocument<any> = this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(UNIQUE_CONSTRAINTS_COLLECTION)
      .doc(constraintId);

    batch.delete(docRef.ref);
  }

  public deleteDiagram(diagram: Diagram): Promise<any> {
    const batch: WriteBatch = this.firestore.firestore.batch();
    const diagramId: string = diagram.id;
    const docRef: AngularFirestoreDocument<any> = this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId);

    if (diagram.tables) {
      diagram.tables.forEach(val =>
        this.deleteTableWithBatch(diagramId, val, batch)
      );
    }

    if (diagram.foreignKeys) {
      diagram.foreignKeys
        .map(val => val.id)
        .forEach(val => this.deleteForeignKeyWitchBatch(diagramId, val, batch));
    }

    batch.delete(docRef.ref);

    return batch.commit();
  }

  public deleteForeignKey(
    diagramId: string,
    constraintId: string
  ): Promise<void> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(FOREIGN_KEYS_COLLECTION)
      .doc(constraintId)
      .delete();
  }

  public updateTablePrimaryKeyName(
    diagramId: string,
    tableId: string,
    primaryKey: any
  ) {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .set(primaryKey, { merge: true });
  }

  public watchDiagram(
    diagramId: string
  ): Observable<Action<DocumentSnapshot<{}>>> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .snapshotChanges()
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public watchTables(
    diagramId: string
  ): Observable<DocumentChangeAction<any>[]> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .snapshotChanges()
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public watchColumns(
    diagramId: string,
    tableId: string
  ): Observable<DocumentChangeAction<any>[]> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(COLUMNS_COLLECTION)
      .snapshotChanges()
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public watchForeignKeys(
    diagramId: string
  ): Observable<DocumentChangeAction<any>[]> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(FOREIGN_KEYS_COLLECTION)
      .snapshotChanges()
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public watchCheckConstraints(
    tableId: string,
    diagramId: string
  ): Observable<DocumentChangeAction<any>[]> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(CHECK_CONSTRAINTS_COLLECTION)
      .snapshotChanges()
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public watchUniqueConstraints(
    tableId: string,
    diagramId: string
  ): Observable<DocumentChangeAction<any>[]> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(UNIQUE_CONSTRAINTS_COLLECTION)
      .snapshotChanges()
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public removeMultipleColumns(
    diagramId: string,
    tableId: string,
    columns: Array<Column>
  ): Promise<void> {
    const batch: WriteBatch = this.firestore.firestore.batch();

    columns
      .map(val => val.id)
      .forEach(id => this.deleteColumnWithBatch(diagramId, tableId, id, batch));

    return batch.commit();
  }

  public removeMultipleForeignKeys(
    diagramId: string,
    constraints: Array<ForeignKeyConstraint>
  ): Promise<void> {
    const batch: WriteBatch = this.firestore.firestore.batch();

    constraints
      .map(val => val.id)
      .forEach(id => this.deleteForeignKeyWitchBatch(diagramId, id, batch));

    return batch.commit();
  }

  public updateMultipleForeignKeys(
    diagramId: string,
    constraints: Array<ForeignKeyConstraint>
  ): Promise<void> {
    const batch: WriteBatch = this.firestore.firestore.batch();
    constraints.forEach(constraint =>
      this.updateForeignKeyWithBatch(diagramId, constraint, batch)
    );

    return batch.commit();
  }

  public updateForeignKeyWithBatch(
    diagramId: string,
    constraint: ForeignKeyConstraint,
    batch: WriteBatch
  ): void {
    const docRef: AngularFirestoreDocument<any> = this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(FOREIGN_KEYS_COLLECTION)
      .doc(constraint.id);

    batch.update(docRef.ref, Util.toJSObject(constraint.toBasicObject()));
  }

  public updateMultipleTables(
    diagramId: string,
    tables: Array<Table>
  ): Promise<void> {
    const batch: WriteBatch = this.firestore.firestore.batch();
    tables.forEach(val => this.updateTableWithBatch(diagramId, val, batch));

    return batch.commit();
  }

  public updateTableWithBatch(
    diagramId: string,
    table: Table,
    batch: WriteBatch
  ): void {
    const docRef: AngularFirestoreDocument<any> = this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(table.id);

    batch.update(docRef.ref, Util.toJSObject(table.toBasicObject()));
  }

  public getAllCurrentAccountDiagrams(): Observable<
    firebase.firestore.QuerySnapshot
  > {
    return from(
      this.firestore
        .collection(DIAGRAMS_COLLECTION)
        .ref.where(
          'owner',
          '==',
          this._authenticationService.getAuthenticatedAccount().email
        )
        .orderBy('name')
        .get()
    ).pipe(takeUntil(this._authenticationService.onLogout));
  }

  public getAllSharedWithCurrentAccountDiagrams(): Observable<
    firebase.firestore.QuerySnapshot
  > {
    return from(
      this.firestore
        .collection(DIAGRAMS_COLLECTION)
        .ref.where(
          'shareList',
          'array-contains',
          this._authenticationService.getAuthenticatedAccount().email
        )
        .orderBy('name')
        .get()
    ).pipe(takeUntil(this._authenticationService.onLogout));
  }

  public updateDiagramName(id: string, name: string): Observable<void> {
    return from(
      this.firestore
        .collection(DIAGRAMS_COLLECTION)
        .doc(id)
        .update({ name: name })
    );
  }

  public updateDiagramShareList(id: string, list: Array<string>) {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(id)
      .update({ shareList: Util.toJSObject(list) });
  }

  public getCheckConstraints(
    diagramId: string,
    tableId: string
  ): Observable<any> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(CHECK_CONSTRAINTS_COLLECTION)
      .snapshotChanges()
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public getUniqueConstraints(
    diagramId: string,
    tableId: string
  ): Observable<any> {
    return this.firestore
      .collection(DIAGRAMS_COLLECTION)
      .doc(diagramId)
      .collection(TABLES_COLLECTION)
      .doc(tableId)
      .collection(UNIQUE_CONSTRAINTS_COLLECTION)
      .snapshotChanges()
      .pipe(takeUntil(this._authenticationService.onLogout));
  }

  public createId(): string {
    return this.firestore.createId();
  }
}
