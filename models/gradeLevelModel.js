const knex = require('../db/knex');
const joi = require('joi');

class GradeLevelModel {

   static async get(id) {
      return await knex('grade_level').where({id: id}).first();
   }

   static async create(data) {
      try {
         data = await GradeLevelModel.validate(data);
         
         return knex("grade_level").returning("id").insert({
            name: data.name,
            department_id: data.department_id
         });
      }
      catch(e) {
         throw e;
      }
   }

   static async update(id, data) {
      try {
         data = await GradeLevelModel.validate(data);
         
         return knex("grade_level")
            .where({id: id})
            .returning("id")
            .update({
               name: data.name,
               department_id: data.department_id
            });
      }
      catch(e) {
         throw e;
      }
   }

   static async validate(data) {
      const schema = joi.object().keys({
         name				: joi.string().label("Name").min(3).max(30).required(),
			department_id	: joi.number().label("Department").required()
		});
		
		return schema.validate(data, {abortEarly: false});
   }

}

module.exports = GradeLevelModel;