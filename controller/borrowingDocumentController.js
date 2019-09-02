const knex = require('../db/knex');
const borrowingDocumentModel = require('../models/transactional/borrowingDocumentModel')

module.exports = {

   // index: async function (req, res, next) {
   //    try {
   //       let report = await borrowingDocumentModel.getSummaryReport();
   //       res.json(report);
   //    } catch (e) {
   //       next(e);
   //    }
   // },

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

   getSummaryReportPersonnel: async function (req, res, next) {
      try {
         let collections = await knex("collection").orderBy("id");
         let personnelGroups = await knex("personnel_group").orderBy("id");
         let report = await borrowingDocumentModel.getSummaryReportPersonnel();

         let totals = [];
         let facultyTotals = {sub_total: 0};

         // Set Faculty Totals to 0
         collections.forEach(collection => {
            facultyTotals[collection.prefix] = 0;
         });

         personnelGroups.forEach(personnelGroup => {
            // Define variable that will hold that totals for each personnel group
            let persnlGrpTotals = null;
            // Check if there is available totals from the summary report
            report.forEach(reportTotal => {
               if(reportTotal.personnel_group_id === personnelGroup.id) {
                  // Set the totals retrieve from the summary report to the personnel group totals
                  // persnlGrpTotals = reportTotal;
                  persnlGrpTotals = {sub_total: 0};
                  collections.forEach(collection => {
                     persnlGrpTotals[collection.prefix] = parseInt(reportTotal[collection.prefix]);
                     persnlGrpTotals.sub_total += persnlGrpTotals[collection.prefix];

                     if (personnelGroup.is_faculty) {
                        facultyTotals[collection.prefix] += persnlGrpTotals[collection.prefix];
                     }
                  });
                  facultyTotals.sub_total += persnlGrpTotals.sub_total;
               }
            });

            if(persnlGrpTotals == null) {
               persnlGrpTotals = {sub_total: 0};
               collections.forEach(collection => {
                  persnlGrpTotals[collection.prefix] = 0;
               });
            }

            personnelGroup.totals = persnlGrpTotals;
            
            totals.push(personnelGroup);
         });
         
         res.json({
            personnelGroupTotals:totals,
            facultyTotals: facultyTotals
         });
      } catch (e) {
         next(e);
      }
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