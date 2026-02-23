import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeCarteComponent } from './type-carte.component';

describe('TypeCarteComponent', () => {
  let component: TypeCarteComponent;
  let fixture: ComponentFixture<TypeCarteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeCarteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeCarteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
