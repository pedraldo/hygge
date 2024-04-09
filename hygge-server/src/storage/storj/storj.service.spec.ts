import { Test, TestingModule } from '@nestjs/testing';
import { StorjService } from './storj.service';

describe('StorjService', () => {
  let service: StorjService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorjService],
    }).compile();

    service = module.get<StorjService>(StorjService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
