# Factory Waifu

A factory library for node.js + [sequelize](https://sequelize.org/) inspired by [factory-girl](https://github.com/simonexmachina/factory-girl).

The main goal of this project is to offer simple implementation of the concept with up to date dependencies and fully Typescript friendly. For the sake of simplicity, this tool has been designed to be **only compatible with sequelize** as an ORM (sequelize is required to be installed as a dependency of your application).

## Usage

For information on how to build a sequelize class using typescript, please refer to [their documentation](https://sequelize.org/master/manual/typescript.html).

```typescript
/** Sequelize object class */
export class Human extends Model<HumanAttributes, HumanCreationAttributes> implements HumanAttributes {
  public firstName!: string;
  public lastName!: string;
}

/** 
 * We must first define the factory template, the template can be an object or a function
 */
// Object
factory.define('human', Human, {firstName: 'John', lastName: 'Doe'}); 
// Function
factory.define('human', Human, () => ({firstName: 'John', lastName: 'Doe'}));
```

Once the factory has been defined, we can now build/create instances

- Using `build` will cause the object instance to be create, but no data is persisted to the database
- Using `create` however will persist the object to the DB

```typescript
// Create an instance that is not persisted
const human = factory.build('human');
// Create multiples instances that are not persisted
const humans = factory.buildMany('human', 5);

// Create an instance that is persisted (notice that the function is now async)
const human = await factory.create('human');
// Create multiples instances that are persisted (notice that the function is now async)
const humans = factory.createMany('human', 5);
```

It is possible to add some overrides with specific attributes on all the functions

```typescript
const human = factory.build('human', {firstName: 'William'});
const humans = factory.buildMany('human', 5, {lastName: 'Smith'});
// Same for the create functions
```

When using a builder function as template, it is also possible to pass some build parameters.

```typescript
factory.define('human', Human, (params) => {
  return {
    firstName: 'John',
    lastName: 'Doe',
    minor = params.age < 18
  }
});

const human = factory.build('human', {}, {age: 24});
// => {firstName: 'John', lastName: 'Doe', minor: false}

// Same for all other functions, this cna be combined with the attributes overrides. (attributes overrides will always be applied after the build function return)
```
