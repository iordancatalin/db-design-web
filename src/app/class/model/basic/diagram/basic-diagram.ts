import { BasicAccount } from '../account/basic-account';
export class BasicDiagram {
  public constructor(public name: string,
                     public owner: string,
                     public creationDate: Date,
                     public shareList: Array<string>) {
  }
}
