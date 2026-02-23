import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueVirementsComponent } from './historique-virements.component';

describe('HistoriqueVirementsComponent', () => {
  let component: HistoriqueVirementsComponent;
  let fixture: ComponentFixture<HistoriqueVirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueVirementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueVirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
