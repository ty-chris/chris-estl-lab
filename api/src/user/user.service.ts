import { EntityManager, QueryOrder } from '@mikro-orm/core';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AbstractRepositoryService } from 'src/core/AbstractRepository.service';
import { UserEntity } from 'src/entities/UserEntity';
import { CreateUserDto } from './dto/create-user.dto';

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
    for (const data of csvData) {
      // Ignore # in first row
      if (data.id[0] !== '#') {
        if (this.validateData(data)) {
          if (typeof data.salary === 'string') {
            data.salary = parseFloat(data.salary);
          }
          const e = UserEntity.fromNewUserModel(data);

          const checkIfExist = await this.exists({
            employeeId: e.employeeId,
          });
          console.log('checkIfExist', checkIfExist);
          // if (checkIfExist) {
          //   console.log('update', e.employeeId);
          //   const found = await this.getEmployeeById(e.employeeId);
          //   const entity = await this.repository.assign(found, e);
          // } else {
          console.log('create', e.employeeId);
          this.repository.persist(e);
          // }
        } else {
          console.log('error: validation failed');
          throw new ForbiddenException();
        }
      }
    }

    await this.repository.flush();
    return true;
  }

  async getUsersWithQueries(
    minSalary: number,
    maxSalary: number,
    offset: number,
    limit: number,
    sort: string,
  ) {
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
