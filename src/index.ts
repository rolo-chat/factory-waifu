import {Model, ModelStatic, Sequelize} from 'sequelize';
import {AttributesGenerator, ModelsStorage, ModelStorage, Factory} from './index.interface';

let sequelize: Sequelize | undefined;

const models: ModelsStorage = {};

export const factory: Factory = {
  /** Initialize the factory. Let's get to work! */
  init(sequelizeInstance: Sequelize) {
    sequelize = sequelizeInstance;
  },

  /** Define a model generation template */
  define: <M extends Model>(
    name: string,
    model: ModelStatic<M>,
    generator: AttributesGenerator<M> | M['_creationAttributes'],
  ) => {
    models[name] = {model, generator};
  },

  /** Build an instance of the model (this is not persisted to the DB) */
  build: <M extends Model>(
    name: string,
    attributes?: Partial<M['_creationAttributes']>,
    buildOptions?: unknown,
  ) => {
    if (!sequelize) throw new Error('Factory is not initialized');
    const model = models[name] as ModelStorage<M>;
    if (!model) throw new Error(`No model registered under "${name}"`);
    // Generate a base template
    const template =
      typeof model.generator === 'function'
        ? (model.generator as AttributesGenerator<M>)(buildOptions)
        : model.generator;
    return model.model.build({...template, ...attributes});
  },

  /** Create an instance of the model (this is persisted to the DB) */
  create: async <M extends Model>(
    name: string,
    attributes?: Partial<M['_creationAttributes']>,
    buildOptions?: unknown,
  ) => {
    const instance = factory.build<M>(name, attributes, buildOptions);
    return await instance.save();
  },

  /** Build multiple instances of the model (this is not persisted to the DB) */
  buildMany: <M extends Model>(
    name: string,
    count: number,
    attributes?: Partial<M['_creationAttributes']>,
    buildOptions?: unknown,
  ) => {
    const instances = [];
    for (let i = 0; i < count; i++) {
      instances.push(factory.build<M>(name, attributes, buildOptions));
    }
    return instances;
  },

  /** Create multiple instances of the model (this is persisted to the DB) */
  createMany: async <M extends Model>(
    name: string,
    count: number,
    attributes?: Partial<M['_creationAttributes']>,
    buildOptions?: unknown,
  ) => {
    const instances = factory.buildMany(name, count, attributes, buildOptions);
    return await Promise.all(
      instances.map((instance) => {
        return instance.save();
      }),
    );
  },
};
