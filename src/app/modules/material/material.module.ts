import { NgModule } from '@angular/core';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule, MatButtonModule, MatTabsModule, MatProgressBarModule, MatCheckboxModule } from '@angular/material';

@NgModule({
  declarations: [],
  imports: [MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressBarModule,
    MatCheckboxModule],
  exports: [MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressBarModule,
    MatCheckboxModule]
})
export class MaterialModule { }
