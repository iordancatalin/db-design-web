import { DataTypeEnum } from '../enum/data-type-enum';
import { HtmlDataType } from '../model/html/accessory/html-data-type';
import { HtmlDataTypeGroup } from '../model/html/accessory/html-data-type-group';
import { ValidationUtil } from '../ui/validation-util';

export class DataTypeConst {
  private static dataTypeArrayGroup: any;

  private static initialization(): void {
    DataTypeConst.dataTypeArrayGroup = [];
    let dataTypeArray = [];
    dataTypeArray.push(new HtmlDataType(DataTypeEnum.NUMBER, true, true));
    dataTypeArray.push(new HtmlDataType(DataTypeEnum.DATE, false, false));
    DataTypeConst.dataTypeArrayGroup.push(new HtmlDataTypeGroup('General', dataTypeArray));

    dataTypeArray = [];
    dataTypeArray.push(new HtmlDataType(DataTypeEnum.CHAR, true, false));
    dataTypeArray.push(new HtmlDataType(DataTypeEnum.VARCHAR2, true, false));
    dataTypeArray.push(new HtmlDataType(DataTypeEnum.VARCHAR, true, false));
    dataTypeArray.push(new HtmlDataType(DataTypeEnum.NCHAR, true, false));
    dataTypeArray.push(new HtmlDataType(DataTypeEnum.NVARCHAR2, true, false));
    dataTypeArray.push(new HtmlDataType(DataTypeEnum.NVARCHAR, true, false));
    DataTypeConst.dataTypeArrayGroup.push(new HtmlDataTypeGroup('Character', dataTypeArray));

    dataTypeArray = [];
    dataTypeArray.push(new HtmlDataType(DataTypeEnum.CLOB, true, false));
    dataTypeArray.push(new HtmlDataType(DataTypeEnum.NCLOB, true, false));
    dataTypeArray.push(new HtmlDataType(DataTypeEnum.BLOB, true, false));
    DataTypeConst.dataTypeArrayGroup.push(new HtmlDataTypeGroup('Other', dataTypeArray));
  }

  public static getDataTypeArrayGroup(): Array<HtmlDataTypeGroup> {
    if (ValidationUtil.isNullOrUndefined(this.dataTypeArrayGroup)) {
      DataTypeConst.initialization();
    }

    return this.dataTypeArrayGroup;
  }

  public static findDataTypeByName(name: string): HtmlDataType {
    if (!this.dataTypeArrayGroup) { DataTypeConst.initialization(); }

    if (!name || name === '') { return null; }

    const result: Array<HtmlDataType> = this.dataTypeArrayGroup.flatMap(val => val.datatypes).filter(val => val.dataType === name);

    if (result.length === 0) { return null; }

    return result[0].clone();
  }
}
