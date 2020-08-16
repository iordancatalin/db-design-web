import {AbstractCheckConstraint} from '../../../model-abstract/check-constraint/abstract-check-constraint';
import {BasicCheckConstraint} from '../../basic/check-constraint/basic-check-constraint';
export class CheckConstraint extends AbstractCheckConstraint {
  public constructor(id: string) {
    super(id);
  }

  public toBasicObject(): BasicCheckConstraint {
    return new BasicCheckConstraint(this.name, this.expression);
  }
}
