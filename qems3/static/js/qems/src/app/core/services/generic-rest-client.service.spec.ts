import { TestBed } from '@angular/core/testing';

import { GenericRestClientService } from './generic-rest-client.service';

describe('GenericRestClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenericRestClientService = TestBed.get(GenericRestClientService);
    expect(service).toBeTruthy();
  });
});
