import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeProfilComponent } from './type-profil.component';

describe('TypeProfilComponent', () => {
  let component: TypeProfilComponent;
  let fixture: ComponentFixture<TypeProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeProfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
