import {Sequelize, Transaction} from 'sequelize';

/** Sequelize instance */
export const sequelize = new Sequelize('rolo', 'root', 'root', {
  host: process.env.SQL_HOST ?? '127.0.0.1',
  port: 5432,
  dialect: 'postgres',
  logging: false,
});

/**
 * Recreate the whole database
 * Quick way to make sure that we are working on a clean database
 * /!\ Should only be used when running tests
 */
export async function recreateDb() {
  await sequelize.query(`DROP SCHEMA public CASCADE`);
  await sequelize.query(`CREATE SCHEMA public`);
  await sequelize.sync({force: true});
}

/**
 * Empty all the schemas in the database
 * Quick way to flush the database data while keep the structure
 * /!\ Should only be used when running tests
 */
export async function clearDb() {
  await sequelize.transaction(async (t: Transaction) => {
    for (const model of Object.keys(sequelize.models)) {
      const table = sequelize.models[model].tableName;
      await sequelize.query(`TRUNCATE ${table} CASCADE;`, {raw: true, transaction: t});
    }
  });
}
