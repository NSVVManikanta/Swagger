const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const Sequelize = require('sequelize');
const sequelize= require('../util/database');

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Username already exists',
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  refresh_token: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Odds are really against you',
    },
    defaultValue: uuidv4(),
  },
}, { underscored: true });

User.beforeCreate((user) => {
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  user.refresh_token = uuidv4();
});

User.prototype.comparePassword = function (somePassword) {
  return bcrypt.compareSync(somePassword, this.password);
};

module.exports = User;