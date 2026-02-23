import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionRegionalComponent } from './direction-regional.component';

describe('DirectionRegionalComponent', () => {
  let component: DirectionRegionalComponent;
  let fixture: ComponentFixture<DirectionRegionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectionRegionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectionRegionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
