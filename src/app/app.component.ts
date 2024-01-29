import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { EmployeeService } from './services/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';
import { ConfrimationDialogComponent } from './confrimation-dialog/confrimation-dialog.component';
import { ViewDataDialogComponent } from './view-data-dialog/view-data-dialog.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'jobTitle',
    'age',
    'startDate',
    'endDate',
    'action',
  ];
  dataSource = new MatTableDataSource<any>([]);
  isDeleteDisabled: boolean = false;
  numberOfRecords: number = 1;
  nameFilter = new FormControl('');
  jobTitleFilter = new FormControl('');
  ageFilter = new FormControl('');
  startDateFilter = new FormControl('');
  endDateFilter = new FormControl('');
  idColumnData: number[] = [];
  noDataMessage: string = '';

  constructor(
    private _dialog: MatDialog,
    private _empService: EmployeeService,
    private _coreService: CoreService
  ) {
  }

  ngOnInit(): void {
    this.getEmployeeList();
  }

  addRow(newRow: any) {
    // Assuming newRow is the new data you want to add
    newRow.numericId = this.dataSource.data.length + 1;
    this.dataSource.data = [...this.dataSource.data, newRow];
  }

  ngAfterViewInit() {
    this.dataSource.filterPredicate = (data, filter) => {
      const nameMatch = data.name.toLowerCase().includes(filter.toLowerCase());
      const jobTitleMatch = data.jobTitle.toLowerCase().includes(filter.toLowerCase());
      const ageMatch = data.age.toString().toLowerCase().includes(filter.toLowerCase());
      const startDateMatch = data.startDate ? data.startDate.toISOString().includes(filter) : false;


      return nameMatch || jobTitleMatch || ageMatch || startDateMatch;
    };

    this.nameFilter.valueChanges.subscribe((value: any) => {
      this.applyFilter(value);
    });

    this.jobTitleFilter.valueChanges.subscribe((value: any) => {
      this.applyFilter(value);
    });

    this.ageFilter.valueChanges.subscribe((value: any) => {
      this.applyFilter(value);
    });
  }

  private applyFilter(value: any) {
    if (this.dataSource) {
      const filterValue = (typeof value === 'string' ? value : '').trim().toLowerCase();
      this.dataSource.filter = filterValue;

      // Check if there are no filtered rows
      if (this.dataSource.filteredData.length === 0) {
        // Update the template or take some action when no data matches the filter
        this.noDataMessage = `No data matching the filter "${filterValue}"`;
      } else {
        // Clear the message if there is filtered data
        this.noDataMessage = '';
      }
    }
  }


  // clearFilter function to clear the coloumns filter
  clearFilter() {
    this.nameFilter.setValue('');
    this.jobTitleFilter.setValue('');
    this.ageFilter.setValue('');
    // this.startDateFilter.setValue('');
    // this.endDateFilter.setValue('');
    this.applyFilter('');
  }

  // Add employee function
  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      width: '800px',
      panelClass: 'modal-width'
    });
    dialogRef.afterClosed().subscribe({
      next: (val: any) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
  }

  // get employee list api
  getEmployeeList() {
    this._empService.getEmployeeList().subscribe({
      next: (res: any) => {
        this.idColumnData = Array.from({ length: res.length }, (_, index) => index + 1);

        if (res.length === 1) {
          this.isDeleteDisabled = true;
        } else {
          this.isDeleteDisabled = false;

        }
        this.dataSource = new MatTableDataSource(res);
      },
      error: console.log,
    });
  }

  // View employee data function
  viewData(row: any): void {
    // Open the dialog and pass data to it
    const dialogRef = this._dialog.open(ViewDataDialogComponent, {
      data: row, // Pass the data to the dialog
      width: '500px'
    });

    // You can subscribe to the afterClosed() event if you want to perform some action after the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      // Perform any additional actions if needed
    });
  }

  // Delete employee data function
  deleteEmployee(id: number) {
    const dialogRef = this._dialog.open(ConfrimationDialogComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this._empService.deleteEmployee(id).subscribe({
          next: (res: any) => {
            this._coreService.openSnackBar('Employee deleted!', 'done');
            this.getEmployeeList();
          },
          error: console.log,
        });
      }
    });
  }

  // Edit employee data function
  openEditForm(data: any) {
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      data,
      width: '800px',
      panelClass: 'modal-width'
    });

    dialogRef.afterClosed().subscribe({
      next: (val: any) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
  }

}
