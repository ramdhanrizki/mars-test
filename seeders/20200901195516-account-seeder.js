'use strict';
const Accounts = require('../models').Accounts;
const Values = require('../models').Values;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let akun = [];
    let value = [];
    for (let i = 1; i <= 41; i++) {
      akun.push({
        id: i,
        name: 'Akun ' + i,
        code: 'akun' + i,
      })

      value.push({
        account_id: i,
        value1: i * 1000,
        value2: (i+1) * 1000,
      })
    }
    // await Accounts.bulkCreate(akun)
    // await Values.bulkCreate(value)
    await queryInterface.bulkInsert('Accounts', akun, {});
    await queryInterface.bulkInsert('Values', value, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Accounts', null, {});
    await queryInterface.bulkDelete('Values', null, {});
  }
};