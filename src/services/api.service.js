const _ = require('lodash');
const fs = require('fs');
const { QueryTypes } = require('sequelize');
const { client: db } = require('../common/db/db.service');
const helper = require('../../helpers/helper');
const UserSqlService = require('../models/user/user.sql.service');

class ApiService {
  constructor() {
    this.userSqlService = new UserSqlService();
  }
  async convertToJson() {
    try {
      const csvFile = process.env.FILE_PATH || '';
      if(_.isEmpty(csvFile)){
        return { status: 'error', msg: 'Received invalid file path' };
      }
      let content = '';
      let records = [];
      const stream = fs.createReadStream(csvFile, { encoding: 'utf-8' });
      stream.on('data', (data) => {
        content += data;
      });
      records = await new Promise((resolve, reject) => {
        stream.on('end', () => {
          records = content.split('\n');
          const modifiedRecords = this.updatedRecords(records);
          resolve(modifiedRecords);
        });
        stream.on('error', (error) => {
          reject(error);
        });
      });
      // Create db object
      await this.insertRecordsInDb(records);
      const ageDistribution = await this.caculateAgeDistribution(records);
      

      return { status: 'success', msg: 'CSV data converted to JSON', data: records };
    } catch (error) {
      console.error('convertToJson Err: ', error);
      return { status: 'error', msg: 'Error converting CSV to JSON' };
    }
  }

  updatedRecords(records){
    if(records.length === 0){
      return [];
    }
    let result = [];
    const [ headers, ...data ] = records;
    const labels = headers.split(',').map(item => item.trim());
    // Build response object
    for(let i = 0; i< data.length; i++){
      if(!_.isEmpty(data[i])){
        data[i] = data[i].split(','); // Convert the comma separated data values to array
        let templateObj = {};
        // Assign the data values to each of the labels of csv sequentially
        for(let j = 0; j < labels.length; j++){
          // Case for nested objects
          if(labels[j].includes('.')){
            templateObj = helper.handleNestedObject(labels[j], data[i][j], templateObj);
          } else{
            templateObj[labels[j]] = data[i][j]?.trim() || '';
          }
        }
        result.push(templateObj);
      }
    }
    
    return result;
  }

  async insertRecordsInDb(records){
    try{
      let data = [];
      for(let i = 0; i < records.length; i++){
        const { name, age, address, ...additional_info } = records[i];
        let dbObj = {};
        dbObj['name'] = name?.firstName + ' ' + name?.lastName;
        dbObj['age'] = age ?? parseInt(age);
        dbObj['address'] = address ?? JSON.stringify(address);
        dbObj['additional_info'] = additional_info ?? JSON.stringify(additional_info);
        data.push(dbObj);
      }
      console.log('data', data);
      await this.userSqlService.insertBulkUser(data);
    } catch(error){
      console.error('insertRecordsInDb Err: ', error);
      return 0;
    }
  }

  async caculateAgeDistribution(records){
    try{
      if(records.length === 0){
        return 0;
      }
      const dbData = await db.query('SELECT age FROM users');
    } catch(error){
      console.error('caculateAgeDistribution Err: ', error);
      return 0;
    }
  }
}

module.exports = new ApiService(); module.exports = new ApiService(); 
