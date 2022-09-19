import {
  BaseEntity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

export abstract class AbstractEntity extends BaseEntity<AbstractEntity, 'id'> {
  @PrimaryKey({ fieldName: '_id' })
  public _id!: ObjectId;

  @SerializedPrimaryKey()
  public id!: string; // won't be saved in the database

  @Property({ version: true, columnType: 'integer', fieldName: '__v' })
  public version = 0;

  @Property({ columnType: 'timestamp' })
  public createdAt = new Date();

  @Property({ columnType: 'timestamp', onUpdate: () => new Date() })
  public updatedAt = new Date();

  public constructor() {
    super();
  }
}
