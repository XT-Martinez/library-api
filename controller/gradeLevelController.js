const knex = require('../db/knex');
const gradeLevelModel = require('../models/gradeLevelModel')

module.exports = {

   index: async function (req, res, next) {
      let gradeLevels = [];

      try {
         gradeLevels = await knex.from('grade_level');
      } catch (e) {
         return next(e);
      }

      res.json(gradeLevels);
   },

   get: async function (req, res, next) {
      let gradeLevel = await knex('grade_level')
         .where({id: req.params.id})
         .first();

      // If nothing is retrieved, return 404 response
      if (typeof gradeLevel === 'undefined')
         return next();
         
      res.json(gradeLevel);
   },

   create: async function (req, res, next) {
      // Validate request body
      gradeLevelModel.validate(req.body)
      // Insert new grade level in the database
      .then(data => { return gradeLevelModel.create(data); })
      // Retrieve the latest created record
      .then(ids => { return gradeLevelModel.get(ids[0]); })
      // Return the created record as a response
      .then(gradeLevel => res.json(gradeLevel))
      // Throw error to the error handler
      .catch(e => next(e));
   },

   update: async function (req, res, next) {
      // Validate request body
      gradeLevelModel.validate(req.body)
      // Update record in the database
      .then(data => {return gradeLevelModel.update(req.params.id, data)})
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
            .from('grade_level')
            .where({id: req.params.id})
            .first();
      })
      .then(gradeLevel => {
         // Check if record exists
         if (typeof gradeLevel === 'undefined')
            next();

          // Return the updated record
         res.json(gradeLevel);
      })
      .catch(e => next(e));
   },

   delete: async function (req, res, next) {

   }

};