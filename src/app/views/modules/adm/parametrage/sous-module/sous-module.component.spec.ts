import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousModuleComponent } from './sous-module.component';

describe('SousModuleComponent', () => {
  let component: SousModuleComponent;
  let fixture: ComponentFixture<SousModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SousModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SousModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
