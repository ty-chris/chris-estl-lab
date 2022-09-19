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
    if (sortType !== '+' && sortType !== '-') {
      throw new BadRequestException();
    }

    let fieldToSort = sort.slice(1);
    fieldToSort = fieldToSort === 'id' ? 'employeeId' : fieldToSort;

    let users = await this.repository.find(
      { salary: { $gte: minSalary, $lte: maxSalary } },
      { offset: offset, limit: limit },
    );

    users = users.sort(this.dynamicSort(sortType, fieldToSort));
    return users;
  }

  dynamicSort(sortType: string, fieldToSort) {
    var sortOrder = 1;
    if (sortType === '-') {
      sortOrder = -1;
    }
    return function (a, b) {
      var result =
        a[fieldToSort] < b[fieldToSort]
          ? -1
          : a[fieldToSort] > b[fieldToSort]
          ? 1
          : 0;
      return result * sortOrder;
    };
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
