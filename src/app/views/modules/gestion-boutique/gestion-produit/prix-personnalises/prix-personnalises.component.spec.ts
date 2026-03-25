import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrixPersonnalisesComponent } from './prix-personnalises.component';

describe('PrixPersonnalisesComponent', () => {
  let component: PrixPersonnalisesComponent;
  let fixture: ComponentFixture<PrixPersonnalisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrixPersonnalisesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrixPersonnalisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
