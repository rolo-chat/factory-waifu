/* eslint-disable new-cap */
import {Model, STRING, UUID, UUIDV4} from 'sequelize';
import {sequelize} from './sequelize';

/** Attributes of the SequelizeMeta instances */
interface TestCreationAttributes {
  /** Instance name */
  name: string;
}

/** Attributes of the SequelizeMeta instances */
type TestAttributes = TestCreationAttributes & {
  /** Instance id */
  id: string;
};

/** Class used to stored database migrations that have been executed */
export class Test extends Model<TestAttributes, TestCreationAttributes> implements TestAttributes {
  /** Instance id */
  public id!: string;
  /** Instance name */
  public name!: string;
  /** Date at which the entity was created */
  public readonly createdAt!: Date;
  /** Date at which the entity was last updated */
  public readonly updatedAt!: Date;
}

Test.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4,
    },
    name: {
      allowNull: false,
      type: STRING(100),
    },
  },
  {
    sequelize,
    modelName: 'test',
    tableName: 'test',
  },
);
