import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('bd', 'tk429368', 'iks', {
  host: 'localhost',
  dialect: 'postgres',
});

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

const trips = sequelize.define('Trip', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  desc: {
    type: Sequelize.STRING(2000),
    allowNull: false,
  },
  short_desc: {
    type: Sequelize.STRING(2000),
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isUrl: true,
    },
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  start_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  end_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}, {
  validate: {
    checkDates() {
      if (this.start_date > this.end_date) {
        throw new Error('Start date must be before end date');
      }
    },
  },
});

const requests = sequelize.define('Request', {
  tripName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  surname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
});

trips.hasMany(requests);
requests.belongsTo(trips, {
  foreignKey: 'tripName',
});

await trips.sync(/*{ force: true }*/);
await requests.sync(/*{ force: true }*/);

export { trips, requests };
