import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { UserEntity } from 'src/entities/UserEntity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const user = {
  employeeId: 'e0001',
  name: 'harry potter',
  login: 'hpotter',
  salary: 500,
} as unknown as UserEntity;

const testUserUpdate = {
  employeeId: 'e0001',
  name: 'ron potter',
  login: 'rpotter',
  salary: 0,
};

const allUsers = [
  {
    employeeId: 'e0001',
    name: 'harry potter',
    login: 'hpotter',
    salary: 500,
  },
] as unknown as UserEntity[];

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(() => Promise.resolve(user)),
            updateUser: jest.fn(() => Promise.resolve(testUserUpdate)),
            createNewUser: jest.fn(() => Promise.resolve(user)),
            remove: jest.fn(() => Promise.resolve()),
            getUsersWithQueries: jest.fn(() => Promise.resolve(allUsers)),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get the users based on query', async () => {
    const res = await controller.findAllWithQuery(400, 500, 0, 1, '+id');
    expect(res).toEqual(allUsers);
  });

  it('should get the one user', async () => {
    const res = await controller.findOne('e0001');
    expect(res).toEqual(user);
  });

  it('should be able to create', async () => {
    const create = {
      id: 'e0001',
      name: 'harry potter',
      login: 'hpotter',
      salary: 500,
    };

    const res = await controller.createUser(create);
    expect(res).toEqual(user);
  });

  it('should be able to update one', async () => {
    const update = {
      name: 'ron potter',
      login: 'rpotter',
      salary: 0,
    };

    const res = await controller.update('e0001', update);
    expect(res).toEqual(testUserUpdate);
  });

  it('should be able to delete one', async () => {
    const res = await controller.delete('e0001');
    expect(res).toBeUndefined();
  });
});
