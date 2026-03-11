import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictSanitaireComponent } from './district-sanitaire.component';

describe('DistrictSanitaireComponent', () => {
  let component: DistrictSanitaireComponent;
  let fixture: ComponentFixture<DistrictSanitaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistrictSanitaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistrictSanitaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
