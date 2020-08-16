import {CheckConstraint} from '../check-constraint/check-constraint';
import {PrimaryKeyConstraint} from '../primary-key/primary-key-constraint';
import {UniqueConstraint} from '../unique-constraint/unique-constraint';

export class TableConstraint {
  public id: string;
  public primaryKeyConstraint: PrimaryKeyConstraint;
  public checkConstraints: Array<CheckConstraint>;
  public uniqueConstraints: Array<UniqueConstraint>;

  constructor(id: string) {
    this.id = id;
  }
}
