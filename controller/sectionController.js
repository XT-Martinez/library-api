const knex = require('../db/knex');
const sectionModel = require('../models/sectionModel')

module.exports = {

   index: async function (req, res, next) {
      let sections = [];

      try {
         sections = await knex.from('section');
      } catch (e) {
         return next(e);
      }

      res.json(sections);
   },

   get: async function (req, res, next) {
      let section = await knex('section')
         .where({id: req.params.id})
         .first();

      // If nothing is retrieved, return 404 response
      if (typeof section === 'undefined')
         return next();
         
      res.json(section);
   },

   create: async function (req, res, next) {
      // Validate request body
      sectionModel.validate(req.body)
      // Insert new section in the database
      .then(data => { return sectionModel.create(data); })
      // Retrieve the latest created record
      .then(ids => { return sectionModel.get(ids[0]); })
      // Return the created record as a response
      .then(section => res.json(section))
      // Throw error to the error handler
      .catch(e => next(e));
   },

   update: async function (req, res, next) {
      // Validate request body
      sectionModel.validate(req.body)
      // Update record in the database
      .then(data => {return sectionModel.update(req.params.id, data)})
      // Do database update
      .then(ids => {
         // Check if query returned an array
         if (!Array.isArray(ids))
            next();

         // Check if array is empty
         if (ids.length == 0)
            next();      

         // Retrieve updated record
        return knex
            .from('section')
            .where({id: req.params.id})
            .first();
      })
      .then(section => {
         // Check if record exists
         if (typeof section === 'undefined')
            next();

          // Return the updated record
         res.json(section);
      })
      .catch(e => next(e));
   },

   delete: async function (req, res, next) {
      await sectionModel.delete(req.params.id);
      res.json({"message": `Section id ${req.params.id} deleted`});
   }

};