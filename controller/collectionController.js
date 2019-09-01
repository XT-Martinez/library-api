const knex = require('../db/knex');
const collectionModel = require('../models/collectionModel')

module.exports = {

   index: async function (req, res, next) {
      let collections = [];

      try {
         collections = await knex.from('collection');
      } catch (e) {
         return next(e);
      }

      res.json(collections);
   },

   get: async function (req, res, next) {
      let collection = await knex('collection')
         .where({id: req.params.id})
         .first();

      // If nothing is retrieved, return 404 response
      if (typeof collection === 'undefined')
         return next();
         
      res.json(collection);
   },

   create: async function (req, res, next) {
      // Validate request body
      collectionModel.validate(req.body)
      // Insert new collection in the database
      .then(data => { return collectionModel.create(data); })
      // Retrieve the latest created record
      .then(ids => { return collectionModel.get(ids[0]); })
      // Return the created record as a response
      .then(collection => res.json(collection))
      // Throw error to the error handler
      .catch(e => next(e));
   },

   update: async function (req, res, next) {
      // Validate request body
      collectionModel.validate(req.body)
      // Update record in the database
      .then(data => {return collectionModel.update(req.params.id, data)})
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
            .from('collection')
            .where({id: req.params.id})
            .first();
      })
      .then(collection => {
         // Check if record exists
         if (typeof collection === 'undefined')
            next();

          // Return the updated record
         res.json(collection);
      })
      .catch(e => next(e));
   },

   // delete: async function (req, res, next) {
   //    await collectionModel.delete(req.params.id);
   //    res.json({"message": `collection id ${req.params.id} deleted`});
   // }

};