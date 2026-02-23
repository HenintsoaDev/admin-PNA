import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeCreditComponent } from './demande-credit.component';

describe('DemandeCreditComponent', () => {
  let component: DemandeCreditComponent;
  let fixture: ComponentFixture<DemandeCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandeCreditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
