import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldeBureauComponent } from './solde-bureau.component';

describe('SoldeBureauComponent', () => {
  let component: SoldeBureauComponent;
  let fixture: ComponentFixture<SoldeBureauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoldeBureauComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoldeBureauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
