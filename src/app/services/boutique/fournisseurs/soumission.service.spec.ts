import { TestBed } from '@angular/core/testing';

import { SoumissionService } from './soumission.service';

describe('SoumissionService', () => {
  let service: SoumissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoumissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
