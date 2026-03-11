import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeStructureComponent } from './type-structure.component';

describe('TypeStructureComponent', () => {
  let component: TypeStructureComponent;
  let fixture: ComponentFixture<TypeStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeStructureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
