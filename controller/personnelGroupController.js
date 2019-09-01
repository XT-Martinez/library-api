const knex = require('../db/knex');
const personnelGroupModel = require('../models/personnelGroupModel');

module.exports = {

   index: async function (req, res, next) {
      let personnelGroups = [];

      try {
         personnelGroups = await knex.from('personnel_group');
      } catch (e) {
         return next(e);
      }

      res.json(personnelGroups);
   },

   get: async function (req, res, next) {
      let personnelGroup = await knex('personnel_group')
         .where({id: req.params.id})
         .first();

      console.log(personnelGroup);

      // If nothing is retrieved, return 404 response
      if (typeof personnelGroup === 'undefined')
         return next();
         
      res.json(personnelGroup);
   },

   create: async function (req, res, next) {
      // Validate request body
      personnelGroupModel.validate(req.body)
      // Insert new personnelGroup in the database
      .then(data => { return personnelGroupModel.create(data); })
      // Retrieve the latest created record
      .then(ids => { return personnelGroupModel.get(ids[0]); })
      // Return the created record as a response
      .then(personnelGroup => res.json(personnelGroup))
      // Throw error to the error handler
      .catch(e => next(e));
   },

   update: async function (req, res, next) {
      // Validate request body
      personnelGroupModel.validate(req.body)
      // Update record in the database
      .then(data => {return personnelGroupModel.update(req.params.id, data)})
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
            .from('personnel_group')
            .where({id: req.params.id})
            .first();
      })
      .then(personnelGroup => {
         // Check if record exists
         if (typeof personnelGroup === 'undefined')
            next();

          // Return the updated record
         res.json(personnelGroup);
      })
      .catch(e => next(e));
   },

   // delete: async function (req, res, next) {
   //    await personnelGroupModel.delete(req.params.id);
   //    res.json({"message": `personnelGroup id ${req.params.id} deleted`});
   // }

};