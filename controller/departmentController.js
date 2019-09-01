const knex = require('../db/knex');
const departmentModel = require('../models/departmentModel')

module.exports = {

   index: async function (req, res, next) {
      let departments = [];

      try {
         departments = await knex.from('department');
      } catch (e) {
         return next(e);
      }

      res.json(departments);
   },

   get: async function (req, res, next) {
      let department = await knex('department')
         .where({id: req.params.id})
         .first();

      // If nothing is retrieved, return 404 response
      if (typeof department === 'undefined')
         return next();
         
      res.json(department);
   },

   create: async function (req, res, next) {
      // Validate request body
      departmentModel.validate(req.body)
      // Insert new department in the database
      .then(data => { return departmentModel.create(data); })
      // Retrieve the latest created record
      .then(ids => { return departmentModel.get(ids[0]); })
      // Return the created record as a response
      .then(department => res.json(department))
      // Throw error to the error handler
      .catch(e => next(e));
   },

   update: async function (req, res, next) {
      // Validate request body
      departmentModel.validate(req.body)
      // Update record in the database
      .then(data => {return departmentModel.update(req.params.id, data)})
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
            .from('department')
            .where({id: req.params.id})
            .first();
      })
      .then(department => {
         // Check if record exists
         if (typeof department === 'undefined')
            next();

          // Return the updated record
         res.json(department);
      })
      .catch(e => next(e));
   },

   // delete: async function (req, res, next) {
   //    await departmentModel.delete(req.params.id);
   //    res.json({"message": `Department id ${req.params.id} deleted`});
   // }

};