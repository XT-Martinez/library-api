const knex = require('../db/knex');
const joi = require('joi');

class CollectionModel {

   static async get(id) {
      return await knex('collection').where({id: id}).first();
   }

   static async create(data) {       
      return knex("collection").returning("id").insert({
         prefix: data.prefix,
         name: data.name
      });
   }

   static async update(id, data) {
      return knex("collection")
         .where({id: id})
         .returning("id")
         .update({
            prefix: data.prefix,
            name: data.name
         });
   }

   static async validate(data) {
      const schema = joi.object().keys({
         name				: joi.string().label("Name").min(3).max(30).required(),
         prefix      	: joi.string().label("Prefix").min(1).max(5).required()
		});
		
		return schema.validate(data, {abortEarly: false});
   }

}

module.exports = CollectionModel;