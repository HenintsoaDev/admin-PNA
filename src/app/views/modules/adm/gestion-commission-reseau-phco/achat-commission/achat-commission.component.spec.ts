import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchatCommissionComponent } from './achat-commission.component';

describe('AchatCommissionComponent', () => {
  let component: AchatCommissionComponent;
  let fixture: ComponentFixture<AchatCommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AchatCommissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchatCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
