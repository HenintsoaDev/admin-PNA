import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoumissionsComponent } from './soumissions.component';

describe('SoumissionsComponent', () => {
  let component: SoumissionsComponent;
  let fixture: ComponentFixture<SoumissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoumissionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoumissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
