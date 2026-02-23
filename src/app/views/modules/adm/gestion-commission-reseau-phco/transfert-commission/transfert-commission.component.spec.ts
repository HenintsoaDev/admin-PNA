import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertCommissionComponent } from './transfert-commission.component';

describe('TransfertCommissionComponent', () => {
  let component: TransfertCommissionComponent;
  let fixture: ComponentFixture<TransfertCommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransfertCommissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransfertCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
