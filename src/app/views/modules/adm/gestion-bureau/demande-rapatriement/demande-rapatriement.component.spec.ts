import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeRapatriementComponent } from './demande-rapatriement.component';

describe('DemandeRapatriementComponent', () => {
  let component: DemandeRapatriementComponent;
  let fixture: ComponentFixture<DemandeRapatriementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandeRapatriementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeRapatriementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
