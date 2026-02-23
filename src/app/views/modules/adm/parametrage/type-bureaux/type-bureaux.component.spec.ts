import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeBureauxComponent } from './type-bureaux.component';

describe('TypeBureauxComponent', () => {
  let component: TypeBureauxComponent;
  let fixture: ComponentFixture<TypeBureauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeBureauxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeBureauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
