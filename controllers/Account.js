const values = require('../models/values');
const numWords = require('number-to-words')
const Accounts = require('../models').Accounts;
const Values = require('../models').Values;
const Excel = require('exceljs');

module.exports = {
  list(req, res) {
    return Accounts
      .findAll({
        include: [{
          model: Values,
          as: 'values'
        }],
        order: [
          ['createdAt', 'DESC'],
        ],
      })
      .then((account) => res.status(200).json({
        status: 200,
        message: 'success',
        result: account
      }))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return Accounts
      .findByPk(req.params.id, {
        include: [{
          model: Values,
          as: 'values'
        }],
      })
      .then((account) => {
        if (!account) {
          return res.status(404).json({
            status: 404,
            message: 'Account tidak ditemukan',
            result: []
          });
        }
        return res.status(200).json({
          status: 200,
          message: 'success',
          result: account
        })
      })
      .catch((error) => res.status(400).send(error));
  },

  async add(req, res) {
    let lastA = await Accounts.findOne({
      order: [ [ 'id', 'DESC' ]],
    });
    let lastV = await Values.findOne({
      order: [ [ 'id', 'DESC' ]],
    });
    return Accounts
      .create({
        id: lastA.id + 1,
        code: req.body.code,
        name: req.body.name,
      })
      .then((account) => {
        Values.create({
          id: lastV.id + 1,
          account_id: account.id,
          value1: req.body.value1,
          value2: req.body.value2
        })
        res.status(201).json({
          status: 201,
          message: 'Berhasil menambahkan data account',
          result: account
        })
      })
      .catch((error) => res.status(400).json({
        status: 400,
        message: 'Gagal menyimpan data account',
        error: error
      }));
  },

  update(req, res) {
    return Accounts
      .findByPk(req.params.id)
      .then(account => {
        if (!account) {
          return res.status(404).json({
            status: 400,
            message: 'Data account tidak ditemukan',
            result: []
          });
        }
        return account
          .update({
            code: req.body.code || account.code,
            name: req.body.name || account.name,
          })
          .then(() => {
            Values.findOne({
                'accound_id': account.id
              })
              .then(value => {
                value.update({
                  value1: req.body.value1 || value.value1,
                  value2: req.body.value2 || value.value2
                })
              })
            res.status(200).json({
              status: 200,
              message: 'success',
              result: account
            })
          })
          .catch((error) => res.status(400).json({
            status: 400,
            message: 'Gagal update data account',
            error: error
          }))
      })
      .catch((error) => res.status(400).json({
        status: 400,
        message: 'Gagal update data account',
        error: error
      }))
  },

  async delete(req, res) {
    return Accounts
      .findByPk(req.params.id)
      .then(async account => {
        if (!account) {
          return res.status(400).send({
            status: 400,
            message: 'Data account tidak ditemukan',
            result: []
          });
        }
        try {
          await account.destroy()
          return Values.findOne({
              accound_id: req.params.id
            })
            .then(value => {
              if (value) {
                value.destroy()
              }
            })
            .cach((e) => res.status(400).json({
              status: 400,
              mesage: 'Gagal menghapus data account',
              result: []
            }))
        } catch (e) {
          return res.status(400).json({
            status: 400,
            message: 'Gagal menghapus data'
          })
        }
        return res.status(200).json({
          status: 200,
          message: 'Berhasil menghapus data account',
          result: []
        })
      })
      .catch((error) => res.status(400).json({
        status: 400,
        message: 'Gagal update data account',
        error: error
      }))
  },

  async summary(req, res) {
    try {
      const total = await Accounts.count()
      const totalPage = Math.ceil(total / 10);
      let result = [];
      let gvalue1 = 0;
      let gvalue2 = 0;
      let gavg = 0;
      for (let page = 1; page <= totalPage; page++) {
        let temp = [];
        let resp = await Accounts.findAll({
          offset: (page - 1) * 10,
          limit: 10,
          include: [{
            model: Values,
            as: 'values'
          }]
        })
        let tvalue1 = 0;
        let tvalue2 = 0;
        let tavg = 0;
        resp.forEach(item => {
          tvalue1 += item.values.value1;
          tvalue2 += item.values.value2;
          tavg += (item.values.value1 + item.values.value2) / 2
          temp.push({
            name: item.name,
            code: item.code,
            value1: item.values.value1,
            value2: item.values.value2,
            avg: (item.values.value1 + item.values.value2) / 2
          })
        });
        return res.send(resp);
        gvalue1 += tvalue1
        gvalue2 += tvalue2
        gavg += tavg
        temp.push({
          name: 'TOTAL',
          value1: tvalue1,
          value2: tvalue2,
          avg: tavg
        })
        result.push({
          name: numWords.toWordsOrdinal(page),
          details: temp
        })
      }
      result.push({
        name: 'GRAND TOTAL',
        value1: gvalue1,
        value2: gvalue2,
        avg: gavg
      })
      return res.status(200).json({
        code: 200,
        success: true,
        message: "Get Accounts",
        data: result
      })
    } catch (e) {
      console.log(e)
      return res.status(400)
        .json({
          code: 400,
          success: false,
          message: 'Terjadi kesalahan dengan server',
        })
    }
  },

  async downloadExcel(req, resp) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('PT_Mars_Tes');
    
    // add column headers
    worksheet.columns = [
      { header: 'NO', key: 'no_id' },
      { header: 'Account', key: 'name' },
      { header: 'Code', key: 'code' },
      { header: 'Value1', key: 'value1' },
      { header: 'Value2', key: 'value2' },
      { header: 'AVG', key: 'avg' },
    ];

    try {
      const total = await Accounts.count()
      const totalPage = Math.ceil(total / 10);
      let result = [];
      let gvalue1 = 0;
      let gvalue2 = 0;
      let gavg = 0;
      let i = 1;
      for (let page = 1; page <= totalPage; page++) {
        let response = await Accounts.findAll({
          offset: (page - 1) * 10,
          limit: 10,
          include: [{
            model: Values,
            as: 'values'
          }]
        })
        let tvalue1 = 0;
        let tvalue2 = 0;
        let tavg = 0;
        response.forEach(item => {
          tvalue1 += item.values.value1;
          tvalue2 += item.values.value2;
          tavg += (item.values.value1 + item.values.value2) / 2
          result.push({
            no_id:i,
            name: item.name,
            code: item.code,
            value1: item.values.value1,
            value2: item.values.value2,
            avg: (item.values.value1 + item.values.value2) / 2
          })
          i++;
        });
        gvalue1 += tvalue1
        gvalue2 += tvalue2
        gavg += tavg
        result.push({
          no_id:'',
          name: 'TOTAL',
          value1: tvalue1,
          value2: tvalue2,
          avg: tavg
        })
      }
      result.push({
        no_id: '',
        name: 'GRAND TOTAL',
        value1: gvalue2,
        value2: gvalue2,
        avg: gavg
      })
      
      worksheet
        .addRows(result);

      let fileName = 'mars_'+new Date+'.xlsx';
      resp.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      resp.setHeader("Content-Disposition", "attachment; filename=" + fileName);
  
      await workbook.xlsx.write(resp);
  
      resp.end();

    } catch (e) {
      console.log(e)
      return res.status(400)
        .json({
          code: 400,
          success: false,
          message: 'Terjadi kesalahan dengan server',
        })
    }

    // Add row using key mapping to columns
    worksheet.addRow(
      { package_name: "ABC", author_name: "Author 1" },
      { package_name: "XYZ", author_name: "Author 2" }
    );
  }
};