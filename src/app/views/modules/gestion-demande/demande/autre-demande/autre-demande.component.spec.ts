import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutreDemandeComponent } from './autre-demande.component';

describe('AutreDemandeComponent', () => {
  let component: AutreDemandeComponent;
  let fixture: ComponentFixture<AutreDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutreDemandeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutreDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
