const knex = require('../db/knex');
const joi = require('joi');

class SectionModel {

   static async get(id) {
      return await knex('section').where({id: id}).first();
   }

   static async create(data) {
      try {         
         return knex("section").returning("id").insert({
            name: data.name,
            grade_level_id: data.grade_level_id,
         });
      }
      catch(e) {
         throw e;
      }
   }

   static async update(id, data) {
      try {
         data = await SectionModel.validate(data);
         
         return knex("section")
            .where({id: id})
            .returning("id")
            .update({
               name: data.name,
               grade_level_id: data.grade_level_id
            });
      }
      catch(e) {
         throw e;
      }
   }

   static async validate(data) {
      const schema = joi.object().keys({
         name				: joi.string().label("Name").min(3).max(30).required(),
         grade_level_id	: joi.number().label("Grade Level").required()
		});
		
		return schema.validate(data, {abortEarly: false});
   }

   static delete(id) {
      return knex("section").where({id: id}).del();
   }

}

module.exports = SectionModel;