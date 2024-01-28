import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDataDialogComponent } from './view-data-dialog.component';

describe('ViewDataDialogComponent', () => {
  let component: ViewDataDialogComponent;
  let fixture: ComponentFixture<ViewDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDataDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
