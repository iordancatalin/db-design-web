export abstract class AbstractColumnBuilder {
  protected _name: string;
  protected _primaryKey: boolean = false;
  protected _foreignKey: boolean = false;
  protected _nullable: boolean = true;
  protected _autoincrement: boolean = false;
  protected _unique: boolean = false;
  protected _defaultValue: string;
  protected _comment: string;

  public constructor(protected _id: string) {
  }

  public withName(name: string): any {
    this._name = name;
    return this;
  }

  public withPrimaryKey(primaryKey: boolean): any {
    this._primaryKey = primaryKey;
    return this;
  }

  public withForeignKey(foreignKey: boolean): any {
    this._foreignKey = foreignKey;
    return this;
  }

  public withNullable(nullable: boolean): any {
    this._nullable = nullable;
    return this;
  }

  public withAutoincrement(autoincrement: boolean): any {
    this._autoincrement = autoincrement;
    return this;
  }

  public withUnique(unique: boolean): any {
    this._unique = unique;
    return this;
  }

  public withDefaultValue(defaultValue: string): any {
    this._defaultValue = defaultValue;
    return this;
  }

  public withComment(comment: string): any {
    this._comment = comment;
    return this;
  }
}
