const knex = require('../db/knex');
const joi = require('joi');

class DepartmentModel {

   static async get(id) {
      return await knex('department').where({id: id}).first();
   }

   static async create(data) {       
      return knex("department").returning("id").insert({
         name: data.name,
         is_personnel: data.is_personnel,
      });
   }

   static async update(id, data) {       
      return knex("department")
         .where({id: id})
         .returning("id")
         .update({
            name: data.name,
            is_personnel: data.is_personnel
         });
   }

   static async validate(data) {
      const schema = joi.object().keys({
         name				: joi.string().label("Name").min(3).max(30).required(),
         is_personnel	: joi.boolean().truthy(1, 'Y').falsy(0, 'N').label("Is Personnel?").required()
		});
		
		return schema.validate(data, {abortEarly: false});
   }

}

module.exports = DepartmentModel;