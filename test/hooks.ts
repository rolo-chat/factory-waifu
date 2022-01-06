import {clearDb, recreateDb} from './sequelize';

before(async () => {
  await recreateDb();
});

afterEach(async () => {
  await clearDb();
});
