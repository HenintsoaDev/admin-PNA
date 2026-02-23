import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviComptePrincipalComponent } from './suivi-compte-principal.component';

describe('SuiviComptePrincipalComponent', () => {
  let component: SuiviComptePrincipalComponent;
  let fixture: ComponentFixture<SuiviComptePrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuiviComptePrincipalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviComptePrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
