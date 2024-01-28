import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfrimationDialogComponent } from './confrimation-dialog.component';

describe('ConfrimationDialogComponent', () => {
  let component: ConfrimationDialogComponent;
  let fixture: ComponentFixture<ConfrimationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfrimationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfrimationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
