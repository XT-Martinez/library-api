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
      if (gradeLevel === 'undefined')
         return next();
         
      res.json(gradeLevel);
   },

   create: async function (req, res, next) {
      gradeLevelModel.create(req.body)
         .then(async (ids) => {
            let gradeLevel = await gradeLevelModel.get(ids[0]);
            res.json(gradeLevel);
         })
         .catch(e => next(e));
   },

   update: async function (req, res, next) {
      // Do database update
      let ids = await gradeLevelModel.update(req.params.id, req.body);

      // Check if query returned an array
      if (!Array.isArray(ids))
         next();

      // Check if array is empty
      if (ids.length == 0)
         next()

      // Retrieve updated record
      let gradeLevel = await knex
         .from('grade_level')
         .where({id: req.params.id})
         .first();

      // Check if record exists
      if (typeof gradeLevel === 'undefined')
         next()

      // Return the updated record
      res.json(gradeLevel);
   },

   delete: async function (req, res, next) {

   }

};