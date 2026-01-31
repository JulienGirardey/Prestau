import { Test, TestingModule } from '@nestjs/testing';
import { BasemodelController } from './basemodel.controller';

describe('BasemodelController', () => {
  let controller: BasemodelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BasemodelController],
    }).compile();

    controller = module.get<BasemodelController>(BasemodelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
