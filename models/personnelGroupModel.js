const knex = require('../db/knex');
const joi = require('joi');

class PersonnelGroupModel {

   static async get(id) {
      return await knex('personnel_group').where({id: id}).first();
   }

   static async create(data) {       
      return knex("personnel_group").returning("id").insert({
         name: data.name,
         department_id: data.department_id,
         is_faculty: data.is_faculty
      });
   }

   static async update(id, data) {
      return knex("personnel_group")
         .where({id: id})
         .returning("id")
         .update({
            name: data.name,
            department_id: data.department_id,
            is_faculty: data.is_faculty
         });
   }

   static async validate(data) {
      const schema = joi.object().keys({
         name				: joi.string().label("Name").min(3).max(30).required(),
         department_id  : joi.number().label("Department").required(),
         is_faculty  	: joi.boolean().truthy(1, 'Y').falsy(0, 'N').label("Is Faculty?").required()
		});
		
		return schema.validate(data, {abortEarly: false});
   }

}

module.exports = PersonnelGroupModel;