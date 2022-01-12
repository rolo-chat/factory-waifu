import {Model, ModelStatic, Sequelize} from 'sequelize';

export interface Factory {
  /** Initialize the factory. Let's get to work! */
  init(sequelizeInstance: Sequelize): void;
  /** Define a model generation template */
  define<M extends Model>(
    name: string,
    model: ModelStatic<M>,
    generator: AttributesGenerator<M> | M['_creationAttributes'],
  ): void;
  /** Build an instance of the model (this is not persisted to the DB) */
  build<M extends Model>(
    name: string,
    attributes?: Partial<M['_creationAttributes']>,
    buildOptions?: unknown,
  ): M;
  /** Create an instance of the model (this is persisted to the DB) */
  create<M extends Model>(
    name: string,
    attributes?: Partial<M['_creationAttributes']>,
    buildOptions?: unknown,
  ): Promise<M>;
  /** Build multiple instances of the model (this is not persisted to the DB) */
  buildMany<M extends Model>(
    name: string,
    count: number,
    attributes?: Partial<M['_creationAttributes']>,
    buildOptions?: unknown,
  ): Array<M>;
  /** Create multiple instances of the model (this is persisted to the DB) */
  createMany<M extends Model>(
    name: string,
    count: number,
    attributes?: Partial<M['_creationAttributes']>,
    buildOptions?: unknown,
  ): Promise<Array<M>>;
}

export type AttributesGenerator<M extends Model> = (
  buildOptions: unknown,
) => M['_creationAttributes'];

export interface ModelsStorage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: ModelStorage<any>;
}

export interface ModelStorage<M extends Model> {
  /** Function generating the model template, or template */
  generator: AttributesGenerator<M> | M['_creationAttributes'];
  /** Sequelize model class */
  model: ModelStatic<M>;
}
