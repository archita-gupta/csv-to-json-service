const { DataTypes } = require('sequelize');
const User = require('./user.model');
const dbService = require('../../common/db/db.service');

class UserSqlService {
    constructor() {
        const sequelize = dbService.getClient();
        this.User = User(sequelize, DataTypes);
    }

    /********************************************
             CRUD OPERATIONS
    ***********************************************/
    async insertBulkUser(users) {
        return await this.User.bulkCreate(users);
    }

    async getUsersByQuery(query) {
        return await this.User.findAll(query);
    }

    async getUserById(id) {
        return await this.User.findOne({ where: { id } });
    }

    async updateUser(id, user) {
        return await this.User.update(user, { where: { id } });
    }
}

module.exports = UserSqlService;
