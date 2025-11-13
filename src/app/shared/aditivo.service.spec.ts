import { TestBed } from '@angular/core/testing';

import { AditivoService } from './aditivo.service';

describe('AditivoService', () => {
  let service: AditivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AditivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
