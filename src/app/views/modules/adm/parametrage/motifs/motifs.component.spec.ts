import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotifsComponent } from './motifs.component';

describe('MotifsComponent', () => {
  let component: MotifsComponent;
  let fixture: ComponentFixture<MotifsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotifsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotifsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
