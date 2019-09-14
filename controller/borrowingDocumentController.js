const knex = require('../db/knex');
const borrowingDocumentModel = require('../models/transactional/borrowingDocumentModel')

module.exports = {

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

   getTest: async function(req, res, next) {
      let report = await borrowingDocumentModel.getSummaryReportStudent();
      res.json(report);
   },

   getSummaryReportStudent: async function (req, res, next) {
      try {
         let collections = await knex("collection").orderBy("id");
         let gradeLevels = await knex("grade_level").orderBy("id");
         let sections = await knex("section").orderBy("id");
         let report = await borrowingDocumentModel.getSummaryReportStudent();

         let totals = [];

         gradeLevels.forEach(gradeLevel => {
            let gradeLevelTotals = { borrower_count: 0, sub_total: 0 };
            gradeLevel.sections = [];

            collections.forEach(collection => {
               gradeLevelTotals[collection.prefix] = 0;
            });
            
            // Filter sections per each grade level
            sections
            .filter(s => s.grade_level_id === gradeLevel.id)
            .forEach(section => {
               // Define variable that will hold that totals for each personnel group
               // let sectionTotals = null;
               let sectionTotals = {borrower_count: 0, sub_total: 0};
               collections.forEach(collection => {
                  sectionTotals[collection.prefix] = 0;
               });
               // Check if there is available totals from the summary report
               report
                  .filter(r => r.section_id === section.id)
                  .forEach(r => {
                     // Set the totals retrieve from the summary report to the personnel group totals
                     // sectionTotals = r;
                     sectionTotals = {borrower_count: 0, sub_total: 0};
                     collections.forEach(collection => {
                        sectionTotals[collection.prefix] = parseInt(r[collection.prefix]);
                        sectionTotals.sub_total += sectionTotals[collection.prefix];

                        gradeLevelTotals[collection.prefix] += sectionTotals[collection.prefix];
                     });
                     sectionTotals.borrower_count += parseInt(r.borrower_count);

                     gradeLevelTotals.sub_total += sectionTotals.sub_total;
                     gradeLevelTotals.borrower_count += sectionTotals.borrower_count;
                  });

               // if(sectionTotals == null) {
                  
               // }
               section.totals = sectionTotals;
               gradeLevel.sections.push(section);
            });

            gradeLevel.totals = gradeLevelTotals;
            totals.push(gradeLevel);
         });
         
         res.json({
            gradeLevelTotals: totals
         });
      } catch (e) {
         next(e);
      }
   },

   getSummaryReportPersonnel: async function (req, res, next) {
      try {
         let collections = await knex("collection").orderBy("id");
         let personnelGroups = await knex("personnel_group").orderBy("id");
         let report = await borrowingDocumentModel.getSummaryReportPersonnel();

         let totals = [];
         let facultyTotals = {borrower_count: 0, sub_total: 0};

         // Set Faculty Totals to 0
         collections.forEach(collection => {
            facultyTotals[collection.prefix] = 0;
         });

         personnelGroups.forEach(personnelGroup => {
            // Define variable that will hold that totals for each personnel group
            let persnlGrpTotals = null;

            report
               .filter(r => r.personnel_group_id === personnelGroup.id)
               .forEach(reportTotal => {
                  // Set the totals retrieve from the summary report to the personnel group totals
                  // persnlGrpTotals = reportTotal;
                  persnlGrpTotals = {borrower_count: 0, sub_total: 0};
                  collections.forEach(collection => {
                     persnlGrpTotals[collection.prefix] = parseInt(reportTotal[collection.prefix]);
                     persnlGrpTotals.sub_total += persnlGrpTotals[collection.prefix];

                     if (personnelGroup.is_faculty) {
                        facultyTotals[collection.prefix] += persnlGrpTotals[collection.prefix];
                     }
                  });
                  
                  persnlGrpTotals.borrower_count += parseInt(reportTotal.borrower_count);

                  if (personnelGroup.is_faculty) {
                     facultyTotals.sub_total += persnlGrpTotals.sub_total;
                     facultyTotals.borrower_count += persnlGrpTotals.borrower_count;
                  }
               });

            if(persnlGrpTotals == null) {
               persnlGrpTotals = {borrower_count: 0, sub_total: 0};
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

   getSummaryReportDepartment: async function (req, res, next) {
      try {
         let collections = await knex("collection").orderBy("id");
         let departments = await knex("department").orderBy("id");
         let report = await borrowingDocumentModel.getSummaryReportDepartment();

         let totals = [];
         let grandTotals = {borrower_count: 0, sub_total: 0};

         // Set Faculty Totals to 0
         collections.forEach(collection => {
            grandTotals[collection.prefix] = 0;
         });

         departments.forEach(department => {
            // Define variable that will hold that totals for each personnel group
            let depTotals = null;

            report
               .filter(r => r.department_id === department.id)
               .forEach(reportTotal => {
                  // Set the totals retrieve from the summary report to the personnel group totals
                  depTotals = {borrower_count: 0, sub_total: 0};
                  collections.forEach(collection => {
                     depTotals[collection.prefix] = parseInt(reportTotal[collection.prefix]);
                     depTotals.sub_total += depTotals[collection.prefix];

                     grandTotals[collection.prefix] += depTotals[collection.prefix];
                  });
                  depTotals.borrower_count += parseInt(reportTotal.borrower_count);

                  grandTotals.sub_total += depTotals.sub_total;
                  grandTotals.borrower_count += depTotals.borrower_count;
               });

            if(depTotals == null) {
               depTotals = {borrower_count: 0, sub_total: 0};
               collections.forEach(collection => {
                  depTotals[collection.prefix] = 0;
               });
            }

            department.totals = depTotals;
            
            totals.push(department);
         });
         
         res.json({
            departmentTotals:totals,
            grandTotals: grandTotals
         });
      } catch (e) {
         next(e);
      }
   },

};