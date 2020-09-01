# How To Install
* Clone the project and run **npm install**
* configure your  database connection on */config/config.js*
* Run migration to create table : **sequelize db:migrate**
* Run Seeder to init data : **sequelize db:seed:all**
* Run server using : **npm run start**
* Project will be serve on port 3000. You can access it with http://localhost:3000/api

# Endpoint
1. [POST] http://localhost:3000/api/account
  * Usage : Create new account data
  * Body  : code, name, value1, value2
2. [GET] http://localhost:3000/api/account
  * Usage : Get All Account Data
3. [GET] http://localhost:3000/api/account/:id
  * Usage : Get account data by id
4. [PUT] http://localhost:3000/api/account/:id
  * Usage : Update account data
  * Params : id
  * body   : code, name, value1, value2
5. [DELETE] http://localhost:3000/api/account/:id
  * Usage : Delete account data
  * params : id
6. [GET] http://localhost:3000/api/account-summary
  * Usage : Get Summary of account and Values (Soal nomor 5)
7. [GET] http://localhost:3000/api/download-excel
  * Usage : Download Excel Data using exceljs

# Author
 * Ramdhan Rizki J
 * ramdhanrizkij@gmail.com