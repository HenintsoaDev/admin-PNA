import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurApiNumheritComponent } from './utilisateur-api-numherit.component';

describe('UtilisateurApiNumheritComponent', () => {
  let component: UtilisateurApiNumheritComponent;
  let fixture: ComponentFixture<UtilisateurApiNumheritComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilisateurApiNumheritComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilisateurApiNumheritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
