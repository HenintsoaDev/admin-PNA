import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldeDistributeurComponent } from './solde-distributeur.component';

describe('SoldeDistributeurComponent', () => {
  let component: SoldeDistributeurComponent;
  let fixture: ComponentFixture<SoldeDistributeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoldeDistributeurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoldeDistributeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
