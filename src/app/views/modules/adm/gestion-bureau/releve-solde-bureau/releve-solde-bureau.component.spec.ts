import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleveSoldeBureauComponent } from './releve-solde-bureau.component';

describe('ReleveSoldeBureauComponent', () => {
  let component: ReleveSoldeBureauComponent;
  let fixture: ComponentFixture<ReleveSoldeBureauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleveSoldeBureauComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleveSoldeBureauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
