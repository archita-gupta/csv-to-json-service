const _ = require('lodash');
const fs = require('fs');
const helper = require('../../helpers/helper');
const UserSqlService = require('../models/user/user.sql.service');

class ApiService {
  constructor() {
    this.userSqlService = new UserSqlService();
  }

  async convertToJson() {
    try {
      const csvFile = process.env.FILE_PATH || './sample.csv';
      if(_.isEmpty(csvFile)){
        return { status: 'error', msg: 'Received invalid file path' };
      }
      let content = '';
      let records = [];
      // Read csv file
      const stream = fs.createReadStream(csvFile, { encoding: 'utf-8' });
      stream.on('data', (data) => {
        content += data;
      });
      // Perform update operatin on file data
      records = await new Promise((resolve, reject) => {
        stream.on('end', () => {
          records = content.split('\n');
          const modifiedRecords = this._updatedRecords(records);
          resolve(modifiedRecords);
        });
        stream.on('error', (error) => {
          reject(error);
        });
      });
      // Insert records in db
      await this._insertRecordsInBatches(records);
      // Calculate age distribution of users
      await this._caculateAgeDistribution();
      
      return { status: 'success', msg: 'CSV data converted to JSON', data: records };
    } catch (error) {
      console.error('convertToJson Err: ', error);
      return { status: 'error', msg: 'Error converting CSV to JSON' };
    }
  }

  /*********************************************************************
   *                    SERVICE PRIVATE METHODS
   *********************************************************************/

  /**
   * Modify the records to make it JSON compatible
   * @param {Array} records 
   */
  _updatedRecords(records){
    if(records.length === 0){
      return [];
    }
    let result = [];
    const [ headers, ...data ] = records;
    // Retreive labels of csv and adding into an array
    const labels = headers.split(',').map(item => item.trim());
    // Build response object
    for(let i = 0; i< data.length; i++){
      if(!_.isEmpty(data[i])){
        // Convert the comma separated data values to array
        data[i] = data[i].split(','); 
        // Building the template object as per the labels given in csv array
        // Post building the template object, we assign the data values to make a json object
        let templateObj = {};
        for(let j = 0; j < labels.length; j++){
          // Case for handling nested objects
          if(labels[j].includes('.')){
            templateObj = helper.handleNestedObject(labels[j], data[i][j], templateObj);
          } else {// Default case
            templateObj[labels[j]] = data[i][j]?.trim() || '';
          }
        }
        result.push(templateObj);
      }
    }
    return result;
  }


  /**
   * Insert records in db in batches
   * @param {Array} records 
   */
  async _insertRecordsInBatches(records) {
    try {
      const batches = [];
      for (let i = 0; i < records.length; i += process.env.BATCH_SIZE) {
        const batch = records.slice(i, i + process.env.BATCH_SIZE).map(record => {
          const { name, age, address, ...additional_info } = record;
          // Creating db object as per the table schema
          return {
            name: name?.firstName + ' ' + name?.lastName,
            age: parseInt(age) || 0,
            address: !_.isEmpty(address) ? address : null,
            additional_info: !_.isEmpty(additional_info) ? additional_info : null
          };
        });
        batches.push(batch);
      }   
      for (const [index, batch] of batches.entries()) {
        await this.userSqlService.insertBulkUser(batch);
        console.log(`Completed insertion batch ${index + 1}/${batches.length}`);
      }
    } catch (error) {
      console.error('_insertRecordsInBatches Err:', error);
    }
  }

  /**
   * Calcualte user's age distribution
   */
  async _caculateAgeDistribution(){
    try{
      // Fetch all users age from db
      const dbData = await this.userSqlService.getAgeDistribution();
      if(dbData.length === 0){
        console.log('No users data found in db');
        return;
      }
      // Define age groups
      const ageGroups = [
        { name: '< 20', min: 0, max: 20 },
        { name: '20 to 40', min: 21, max: 40 },
        { name: '40 to 60', min: 41, max: 60 },
        { name: '> 60', min: 60, max: Infinity },
      ];
      const totalUsers = dbData.length;
      // Finding the total count of users in each age group and calculating the percentage
      const distribution = ageGroups.map(group => {
        const count = dbData.filter(user => user.age >= group.min && user.age < group.max).length;
        const percentage = ((count / totalUsers) * 100).toFixed(2);
        return { 'Age Group': group.name, 'Distribution %': percentage };
      });
      console.log('---------- < User Age Distribution > ----------');
      console.table(distribution);
    } catch(error){
      console.error('caculateAgeDistribution Err: ', error);
    }
  }

  /** OLD VERSION
   * Insert records into database
   * @param {Array} records 
   */
  async _insertRecordsInDb(records){
    try{
      let data = [];
      for(let i = 0; i < records.length; i++){
        const { name, age, address, ...additional_info } = records[i];
        // Create db object
        let dbObj = {};
        dbObj['name'] = name?.firstName + ' ' + name?.lastName;
        dbObj['age'] = age ?? parseInt(age);
        dbObj['address'] = address ?? JSON.stringify(address);
        dbObj['additional_info'] = additional_info ?? JSON.stringify(additional_info);
        data.push(dbObj);
      }
      // Insert all records in db
      await this.userSqlService.insertBulkUser(data);
    } catch(error){
      console.error('insertRecordsInDb Err: ', error);
    }
  }

}

module.exports = new ApiService();
