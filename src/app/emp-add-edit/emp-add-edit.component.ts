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
  minStartDate: Date;
  maxEndDate: Date;

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

    this.minStartDate = new Date();
    this.maxEndDate = new Date();
  }

  ngOnInit(): void {
    this.empForm.patchValue(this.data);
  }

  // Triggered when the value of the start date input changes.
  onStartDateChange() {
    const startDateControl = this.empForm.get('startDate');
    if (startDateControl) {
      const startDate = startDateControl.value;
      this.minStartDate = startDate;
      startDateControl.updateValueAndValidity();
    }
  }

  // Triggered when the value of the end date input changes.
  onEndDateChange() {
    const endDateControl = this.empForm.get('endDate');
    if (endDateControl) {
      const endDate = endDateControl.value;
      this.maxEndDate = endDate;
      endDateControl.updateValueAndValidity();
    }
  }

  // Purposen of this function dates are valid or selectable in the start date calendar
  startDateFilter = (date: Date | null): boolean => {
    return date !== null && date <= (this.maxEndDate || new Date());
  }

  // Purposen of this function dates are valid or selectable in the end date calendar
  endDateFilter = (date: Date | null): boolean => {
    const startDateControl = this.empForm.get('startDate');
    if (startDateControl && startDateControl.value !== null) {
      const selectedStartDate = startDateControl.value;
      const currentDate = new Date();
      // Disable end date if it's the same as the selected start date or greater than the current date
      return date !== null && date > selectedStartDate && date <= currentDate && selectedStartDate !== currentDate;
    }
    return false;
  }

  // Submit form function
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
