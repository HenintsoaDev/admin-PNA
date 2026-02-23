import { TestBed } from '@angular/core/testing';

import { InscriptionDigitaleService } from './inscription-digitale.service';

describe('InscriptionDigitaleService', () => {
  let service: InscriptionDigitaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InscriptionDigitaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
