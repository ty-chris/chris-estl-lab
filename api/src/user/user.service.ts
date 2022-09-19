import { EntityManager, QueryOrder } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { AbstractRepositoryService } from 'src/core/AbstractRepository.service';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService extends AbstractRepositoryService<UserEntity> {
  constructor(private entityManager: EntityManager) {
    super('UserEntity', entityManager);
  }

  findAll() {
    return this.all();
  }

  async processJsonArray(csvData): Promise<boolean> {
    csvData.forEach((data) => {
      // Ignore # in first row
      if (data.id[0] !== '#') {
        if (this.validateData(data)) {
          if (typeof data.salary === 'string') {
            data.salary = parseInt(data.salary);
          }
          const e = UserEntity.fromNewUserModel(data);
          const newEntity = this.repository.create(e);
          this.repository.persist(newEntity);
        } else {
          console.log('error: validation failed');
          throw new ForbiddenException();
        }
      }
    });

    this.repository.flush();
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
          $gt: parseInt(minSalary.toString()),
          $lt: parseInt(maxSalary.toString()),
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

  getEmployeeById(id) {
    return this.findOne({ id });
  }

  getEmployeeByUsername(login) {
    return this.findOne({ login });
  }
}
