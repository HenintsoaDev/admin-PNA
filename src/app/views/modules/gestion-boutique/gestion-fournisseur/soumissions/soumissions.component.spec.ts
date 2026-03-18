import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { PassageService } from 'app/services/table/passage.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { SoumissionService } from 'app/services/boutique/fournisseurs/soumission.service';

import { SoumissionsComponent } from './soumissions.component';

describe('SoumissionsComponent', () => {
  let component: SoumissionsComponent;
  let fixture: ComponentFixture<SoumissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoumissionsComponent],
      providers: [
        PassageService,
        {
          provide: AuthService,
          useValue: { initAutority: () => {} }
        },
        {
          provide: BsModalService,
          useValue: { show: () => ({ hide: () => {} }) }
        },
        {
          provide: SoumissionService,
          useValue: { getDetailsSoumission: () => of({ data: { id: 1 } }) }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
