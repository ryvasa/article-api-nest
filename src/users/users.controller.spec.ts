import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUsersService = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        password: bcrypt.hashSync(dto.password, 10),
        ...dto,
      };
    }),
    update: jest.fn().mockImplementation((id, dto) => {
      return {
        id,
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    const dto = { name: 'ryan', email: 'ryan@gmail.com', password: '123' };
    expect(controller.create(dto)).toEqual({
      id: expect.any(Number),
      name: dto.name,
      email: dto.email,
      password: expect.any(String),
    });
    expect(mockUsersService.create).toHaveBeenCalledWith(dto);
  });

  // it('should array of user', () => {
  //   const dto = { name: 'ryan', email: 'ryan@gmail.com', password: '123' };
  //   console.log(controller.findAll());
  //   expect(controller.findAll()).toEqual('Array');
  // });
});
