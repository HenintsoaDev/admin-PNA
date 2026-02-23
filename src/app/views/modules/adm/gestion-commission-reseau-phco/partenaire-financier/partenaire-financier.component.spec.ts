import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartenaireFinancierComponent } from './partenaire-financier.component';

describe('PartenaireFinancierComponent', () => {
  let component: PartenaireFinancierComponent;
  let fixture: ComponentFixture<PartenaireFinancierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartenaireFinancierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartenaireFinancierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
