import { EntityManager, QueryOrder } from '@mikro-orm/core';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AbstractRepositoryService } from '../core/AbstractRepository.service';
import { UserEntity } from '../entities/UserEntity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService extends AbstractRepositoryService<UserEntity> {
  entitiesToPersist: UserEntity[] = [];

  constructor(private entityManager: EntityManager) {
    super('UserEntity', entityManager);
  }

  findAll() {
    return this.all();
  }

  async processJsonArray(csvData: CreateUserDto[]): Promise<boolean> {
    let cachedEntities: UserEntity[] = [];
    for (const data of csvData) {
      // Ignore # in first row
      if (data.id[0] !== '#') {
        if (this.validateData(data)) {
          if (typeof data.salary === 'string') {
            data.salary = parseFloat(data.salary);
          }
          const e = UserEntity.fromNewUserModel(data);

          const checkIfExist =
            (await this.exists({
              employeeId: e.employeeId,
            })) ||
            !!cachedEntities.find((cache) => cache.employeeId === e.employeeId);

          const checkLoginIfExists =
            (await this.exists({
              login: e.login,
            })) || !!cachedEntities.find((cache) => cache.login === e.login);

          if (checkIfExist) {
            const found = await this.getEmployeeById(e.employeeId);

            if (checkLoginIfExists && found.login !== e.login) {
              throw new BadRequestException();
            }
            const entity = await this.repository.assign(found, e);

            // Cache Entities to check for unique values before db is flushed
            cachedEntities.push(entity);
          } else {
            if (!checkLoginIfExists) {
              this.repository.persist(e);

              // Cache Entities to check for unique values before db is flushed
              cachedEntities.push(e);
            } else {
              throw new BadRequestException();
            }
          }
        } else {
          console.log('error: validation failed');
          throw new ForbiddenException();
        }
      }
    }

    await this.repository.flush();
    return true;
  }

  async createNewUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    if (this.validateData(createUserDto)) {
      if (typeof createUserDto.salary === 'string') {
        createUserDto.salary = parseFloat(createUserDto.salary);
      }
      const e = UserEntity.fromNewUserModel(createUserDto);

      const checkIfExist = await this.exists({
        employeeId: e.employeeId,
      });

      const checkLoginIfExists = await this.exists({
        login: e.login,
      });

      if (!checkLoginIfExists) {
        return await this.create(e);
      } else {
        throw new BadRequestException();
      }
    } else {
      throw new ForbiddenException();
    }
  }

  async updateUser(id: string, e: UpdateUserDto) {
    const found = await this.getEmployeeById(id);

    const checkIfExists =
      (await this.exists({
        login: e.login,
      })) && found.login !== e.login;

    if (checkIfExists) {
      throw new BadRequestException();
    }

    this.updateByEntity(found, e);
  }

  async getUsersWithQueries(
    minSalary: number,
    maxSalary: number,
    offset: number,
    limit: number,
    sort: string,
  ): Promise<UserEntity[]> {
    const sortType = sort[0];
    if (sortType !== ' ' && sortType !== '-') {
      console.log('bad request');
      throw new BadRequestException();
    }

    let fieldToSort = sort.slice(1);
    fieldToSort = fieldToSort === 'id' ? 'employeeId' : fieldToSort;

    let sortItem = {};
    sortItem[fieldToSort] = sortType === '-' ? QueryOrder.DESC : QueryOrder.ASC;

    const findOptions = {
      offset: parseInt(offset.toString()),
      limit: parseInt(limit.toString()),
      orderBy: sortItem,
    };

    let users = await this.repository.find(
      {
        salary: {
          $gte: parseInt(minSalary.toString()),
          $lte: parseInt(maxSalary.toString()),
        },
      },
      findOptions,
    );
    return users;
  }

  validateData(data): boolean {
    if (!data.id || !data.login || !data.name || !data.salary) {
      return false;
    }

    if (data.salary < 0.0) {
      return false;
    }

    return true;
  }

  getEmployeeById(employeeId) {
    return this.findOne({ employeeId });
  }

  getEmployeeByUsername(login) {
    return this.findOne({ login });
  }
}
