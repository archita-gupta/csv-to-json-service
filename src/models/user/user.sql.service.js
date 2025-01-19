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

    async getAgeDistribution() {
        return await this.User.findAll({
            attributes: ['age'],
            raw: true,
            order: [['age', 'ASC']]
        });
    }

    async getUserById(id) {
        return await this.User.findByPk(id, { raw: true });
    }

    async updateUser(id, user) {
        return await this.User.update(user, { 
            where: { id },
            returning: true
        });
    }
}

module.exports = UserSqlService;
