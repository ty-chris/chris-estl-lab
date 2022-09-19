/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EntityData,
  EntityManager,
  EntityRepository,
  FilterQuery,
  FindOptions,
  RequiredEntityData,
} from '@mikro-orm/core';
import { NotFoundException } from '@nestjs/common';

export class AbstractRepositoryService<T> {
  protected repository: EntityRepository<T>;
  private defaultOptions: FindOptions<T, any> | undefined;

  public constructor(
    entityName: string,
    entityManager: EntityManager,
    options?: FindOptions<T, any> | undefined,
  ) {
    this.defaultOptions = options;
    this.repository = new EntityRepository(entityManager, entityName);
  }

  public async create(entity: RequiredEntityData<T>): Promise<T> {
    const newEntity = this.repository.create(entity);
    await this.repository.persistAndFlush(newEntity);
    return newEntity;
  }

  public async all(
    options?: FindOptions<T, any> | undefined,
  ): Promise<Array<T>> {
    return this.repository.findAll(options || this.defaultOptions);
  }

  public async find(
    query: FilterQuery<T>,
    options?: FindOptions<T, any> | undefined,
  ): Promise<Array<T>> {
    return this.repository.find(query, options || this.defaultOptions);
  }

  public async findOne(
    query: FilterQuery<T>,
    options?: FindOptions<T, any> | undefined,
  ): Promise<T> {
    const entity = await this.repository.findOne(
      query,
      options || this.defaultOptions,
    );
    if (entity === null) throw new NotFoundException();
    return entity;
  }

  public async exists(query: FilterQuery<T>): Promise<boolean> {
    try {
      await this.findOne(query);
      return true;
    } catch {
      return false;
    }
  }

  public async remove(query: FilterQuery<T>): Promise<void> {
    await this.repository.nativeDelete(query);
    await this.flush();
    return;
  }

  public async update(query: FilterQuery<T>, data: EntityData<T>): Promise<T> {
    const entity = await this.findOne(query);
    return this.updateByEntity(entity, data);
  }

  public async updateByEntity(entity: T, data: EntityData<T>): Promise<T> {
    this.repository.assign(entity, data);
    await this.persist(entity);
    return entity;
  }

  public async flush(): Promise<void> {
    return this.repository.flush();
  }

  public async persist(entity: T): Promise<T> {
    await this.repository.persistAndFlush(entity);
    return entity;
  }
}
