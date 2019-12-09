import { TestBed } from '@angular/core/testing';

import { CreateDataSetService } from './create-data-set.service';

describe('CreateDataSetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateDataSetService = TestBed.get(CreateDataSetService);
    expect(service).toBeTruthy();
  });
});
