const knex = require('../db/knex');
const borrowingDocumentModel = require('../models/transactional/borrowingDocumentModel')

module.exports = {

   index: async function (req, res, next) {
      try {
         let report = await borrowingDocumentModel.getSummaryReport();
         res.json(report);
      } catch (e) {
         next(e);
      }
   },

   get: async function (req, res, next) {
      try {
         let borrowingDoc = await borrowingDocumentModel.get(req.params.id);
         borrowingDoc.items = await borrowingDocumentModel.getItems(borrowingDoc.id);
         res.json(borrowingDoc);
      } catch (e) {
         return next(e);
      }
   },

   create: async function (req, res, next) {
      // Validate request body
      borrowingDocumentModel.validate(req.body)
      // Post borrowing transaction and create borrowing document
      .then(data => { return borrowingDocumentModel.create(data); })
      // Retrieve the latest created record
      .then(borrowingDoc => res.json(borrowingDoc))
      // Throw error to the error handler
      .catch(e => next(e));
   },

   // update: async function (req, res, next) {
   //    // Validate request body
   //    borrowingDocumentModel.validate(req.body)
   //    // Update record in the database
   //    .then(data => {return borrowingDocumentModel.update(req.params.id, data)})
   //    // Do database update
   //    .then(ids => {
   //       // Check if query returned an array
   //       if (!Array.isArray(ids))
   //          next();

   //       // Check if array is empty
   //       if (ids.length == 0)
   //          next();      

   //       // Retrieve updated record
   //      return knex
   //          .from('collection')
   //          .where({id: req.params.id})
   //          .first();
   //    })
   //    .then(collection => {
   //       // Check if record exists
   //       if (typeof collection === 'undefined')
   //          next();

   //        // Return the updated record
   //       res.json(collection);
   //    })
   //    .catch(e => next(e));
   // },

   // delete: async function (req, res, next) {
   //    await borrowingDocumentModel.delete(req.params.id);
   //    res.json({"message": `collection id ${req.params.id} deleted`});
   // }

};