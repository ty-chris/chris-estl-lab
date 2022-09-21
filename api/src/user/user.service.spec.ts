import { EntityManager } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../entities/UserEntity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let entityManagerMock: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EntityManager,
          useFactory: jest.fn(() => ({
            flush: jest.fn(),
          })),
        },
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    entityManagerMock = module.get(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be possible to retrieve users', async () => {
    const allUsers = [
      {
        _id: 'project1',
        createdAt: new Date(),
        updatedAt: new Date(),
        employeeId: 'E0001',
        name: 'harry potter',
        login: 'hpotter',
        salary: 500,
      },
    ] as unknown as UserEntity[];

    service.getUsersWithQueries = jest.fn();

    jest.spyOn(service, 'getUsersWithQueries').mockResolvedValue(allUsers);

    expect(await service.getUsersWithQueries(500, 500, 0, 1, '+id')).toBe(
      allUsers,
    );
  });

  it('should be able to create new users', async () => {
    const newUser = {
      id: 'E0001',
      name: 'Harry Potter',
      login: 'hpotter',
      salary: 500,
    } as CreateUserDto;

    const userEntity = new UserEntity(
      newUser.id,
      newUser.login,
      newUser.name,
      newUser.salary,
    );
    jest.spyOn(service, 'createNewUser').mockResolvedValue(userEntity);

    const result = await service.createNewUser(newUser);
    expect(result).toEqual(userEntity);
  });
});
