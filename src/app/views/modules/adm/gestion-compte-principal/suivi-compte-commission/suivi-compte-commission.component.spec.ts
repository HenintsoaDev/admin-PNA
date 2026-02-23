import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviCompteCommissionComponent } from './suivi-compte-commission.component';

describe('SuiviCompteCommissionComponent', () => {
  let component: SuiviCompteCommissionComponent;
  let fixture: ComponentFixture<SuiviCompteCommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuiviCompteCommissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviCompteCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
