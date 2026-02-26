import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormesComponent } from './formes.component';

describe('FormesComponent', () => {
  let component: FormesComponent;
  let fixture: ComponentFixture<FormesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
