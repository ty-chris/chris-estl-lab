import { Entity, Property } from '@mikro-orm/core';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AbstractEntity } from './AbstractEntity';

@Entity({ collection: 'users' })
export class UserEntity extends AbstractEntity {
  @Property({ columnType: 'string', unique: true })
  employeeId!: string;

  @Property({ columnType: 'string', unique: true })
  login!: string;

  @Property({ columnType: 'string' })
  name!: string;

  @Property({ columnType: 'number' })
  salary!: number;

  constructor(id: string, login: string, name: string, salary: number) {
    super();
    this.employeeId = id;
    this.login = login;
    this.name = name;
    this.salary = salary;
  }

  public static fromNewUserModel(newUser: CreateUserDto): UserEntity {
    const user = new UserEntity(
      newUser.id,
      newUser.login,
      newUser.name,
      newUser.salary,
    );
    return user;
  }
}
