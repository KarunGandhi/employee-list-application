import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { EmployeeService } from '../services/employee.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss'],
})
export class EmpAddEditComponent implements OnInit {
  empForm: FormGroup;
  minFromDate: Date;
  maxFromDate: Date | null;
  minToDate: Date | null;
  maxToDate: Date;

  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {
    this.empForm = this._fb.group({
      name: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      age: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: [''],
    });

    this.minFromDate = new Date(1900, 0, 1);
    this.maxFromDate = new Date();

    this.minToDate = new Date(1900, 0, 1);
    this.maxToDate = new Date();
  }

  ngOnInit(): void {
    this.empForm.patchValue(this.data);
  }

  fromDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    this.minToDate = event.value;
    if (event.value !== null) {
      this.maxToDate = new Date(
        event!.value.getFullYear(),
        event!.value.getMonth(),
        event!.value.getDate() + 30
      );
    }
    this.toggleEndDate();
  }

  toDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    this.maxFromDate = event.value;

    if (event.value !== null) {
      // Set the minimum date for the start date input to be 30 days before the selected date
      this.minFromDate = new Date(
        event.value.getFullYear(),
        event.value.getMonth(),
        event.value.getDate() - 30
      );

      // Set the maximum date for the end date input to be the selected date
      this.maxToDate = event.value;
    }
  }

  getCurrentDate(): Date {
    return new Date();
  }

  toggleEndDate() {
    const currentDate = new Date();
    const startDateControl = this.empForm.get('startDate');

    if (startDateControl) {
      const startDate = startDateControl.value;
      const isCurrentDate = startDate.toDateString() === currentDate.toDateString();
      if (isCurrentDate) {
        this.empForm.get('endDate')!.disable();
      } else {
        this.empForm.get('endDate')!.enable();
      }
    }
  }

// form submit function
  onFormSubmit() {
    if (this.empForm.valid) {
      if (this.data) {
        this._empService
          .updateEmployee(this.data.id, this.empForm.value)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Employee detail updated!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this._empService.addEmployee(this.empForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Employee added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }
}
