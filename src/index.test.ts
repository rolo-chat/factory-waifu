import {expect} from 'chai';
import faker from 'faker';
import {factory} from './index';
import {sequelize, Test} from 'test';

describe('factory', () => {
  let template: Test['_creationAttributes'];

  before(() => {
    factory.init(sequelize);
  });

  beforeEach(() => {
    template = {name: faker.name.firstName()};
    factory.define('test', Test, template);
  });

  describe('build', () => {
    it('should build an instance with a template', () => {
      const result = factory.build<Test>('test');

      expect(result).to.be.an.instanceOf(Test);
      expect(result.name).to.equal(template.name);
    });

    it('should build an instance with a template generator function', () => {
      factory.define('generator', Test, () => template);

      const result = factory.build<Test>('generator');

      expect(result).to.be.an.instanceOf(Test);
      expect(result.name).to.equal(template.name);
    });

    it('should build an instance with an override of attributes', () => {
      const name = faker.name.firstName();

      const result = factory.build<Test>('test', {name});

      expect(result).to.be.an.instanceOf(Test);
      expect(result.name).to.equal(name);
    });

    it('should pass build options to the generator', () => {
      const buildOptions = faker.lorem.slug();

      factory.define('generator', Test, (options: string) => {
        expect(options).to.equal(buildOptions);
        return template;
      });

      factory.build<Test>('generator', undefined, buildOptions);
    });
  });

  describe('create', () => {
    it('should create an instance with a template', async () => {
      const result = await factory.create<Test>('test');

      expect(result).to.be.an.instanceOf(Test);
      expect(result.name).to.equal(template.name);
    });

    it('should build an instance with a template generator function', async () => {
      factory.define('generator', Test, () => template);

      const result = await factory.create<Test>('generator');

      expect(result).to.be.an.instanceOf(Test);
      expect(result.name).to.equal(template.name);
    });

    it('should create the object in DB', async () => {
      await factory.create<Test>('test');

      const result = await Test.findOne({where: {name: template.name}});

      expect(result).to.be.an.instanceOf(Test);
    });
  });

  describe('buildMany', () => {
    it('should build multiple instances', () => {
      const result = factory.buildMany<Test>('test', 5);

      expect(result).to.be.instanceOf(Array);
      expect(result).to.have.length(5);
      result.forEach((instance) => expect(instance).to.be.instanceOf(Test));
    });
  });

  describe('createMany', () => {
    it('should create multiple instances', async () => {
      const result = await factory.createMany<Test>('test', 5);

      expect(result).to.be.instanceOf(Array);
      expect(result).to.have.length(5);
      result.forEach((instance) => expect(instance).to.be.instanceOf(Test));
    });

    it('should create multiple instances in DB', async () => {
      await factory.createMany<Test>('test', 5);

      const result = await Test.findAll({where: {name: template.name}});

      expect(result).to.be.instanceOf(Array);
      expect(result).to.have.length(5);
      result.forEach((instance) => expect(instance).to.be.instanceOf(Test));
    });
  });
});
