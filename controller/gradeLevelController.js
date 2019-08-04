const db = require('../db/knex');
const GradeLevelModel = require('../models/gradeLevelModel');

module.exports = {

   index: async function (req, res, next) {
      let gradeLevels = [];
      try {
         gradeLevels = await db.from('grade_level').orderBy("name", "ASC");
      } catch (e) {
         // return next(e);
         // console.log(e);
         return next({error: e.toString()});
      }
      if (gradeLevels.length == 0)
         return next();

      res.json(gradeLevels);
   },

   get: async function (req, res, next) {
      let gradeLevel = await GradeLevelModel.get(req.params.id);
      if (gradeLevel === 'undefined')
         return next();
      console.log(gradeLevel.getId());
      res.json(gradeLevel);
   },

   create: async function (req, res, next) {
      
   },

   update: async function (req, res, next) {
      let result = await db.from('grade_level').where({id: req.params.id});

      if (result.length == 0)
         return next();

      let gradeLevel = result[0];

      console.log(gradeLevel);
      res.json(gradeLevel);
   },

   delete: async function (req, res, next) {

   }

};