import {Model, ModelStatic} from 'sequelize';

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
