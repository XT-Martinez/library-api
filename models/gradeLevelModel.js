const db = require('../db/knex');
const Model = require('./model');

class GradeLevelModel extends Model {

   static async get(id) {
      let res = await db('grade_level').where({id: id}).first();
      return new GradeLevelModel(res);
   }

}

module.exports = GradeLevelModel;