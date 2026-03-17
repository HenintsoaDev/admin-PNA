import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { PassageService } from 'app/services/table/passage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { AppelOffreService } from 'app/services/boutique/fournisseurs/appel-offre.service';

import { AppelOffreComponent } from './appel-offre.component';

describe('AppelOffreComponent', () => {
  let component: AppelOffreComponent;
  let fixture: ComponentFixture<AppelOffreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppelOffreComponent],
      imports: [ReactiveFormsModule],
      providers: [
        PassageService,
        {
          provide: AuthService,
          useValue: { initAutority: () => {} }
        },
        {
          provide: ToastrService,
          useValue: { success: () => {}, error: () => {} }
        },
        {
          provide: BsModalService,
          useValue: { show: () => ({ hide: () => {} }) }
        },
        {
          provide: AppelOffreService,
          useValue: {
            getDetailsAppelOffre: () => of({ data: { id: 1, reference: 'REF', titre: 'T', date_limite_soumission: '2026-01-01' } }),
            ajoutAppelOffre: () => of({ code: 200 }),
            modifierAppelOffre: () => of({ code: 200 }),
            supprimerAppelOffre: () => of({ code: 200 })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppelOffreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
