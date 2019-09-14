const express = require('express');
const createError = require('http-errors');

// Import Controllers
const controllers = require('./controller/controllers')
// Import Middlewares
const middlewares = require('./middleware/middlewares');

const mainRouter = express.Router();
const apiRouter = express.Router();

// Main Routers
mainRouter.route('/')
   .get(controllers.indexController.index);

// apiRouter.use(middlewares.authMiddleware.authenticate);
mainRouter.use(middlewares.corsMiddleware);

// Admin routers
mainRouter.use('/api', apiRouter);

// Grade Level Routes
apiRouter.route('/grade_level')
   .get(controllers.gradeLevelController.index)
   .post(controllers.gradeLevelController.create);
apiRouter.route('/grade_level/:id')
   .get(controllers.gradeLevelController.get)
   .put(controllers.gradeLevelController.update)
   .delete(controllers.gradeLevelController.delete);

// Section Routes
apiRouter.route('/section')
   .get(controllers.sectionController.index)
   .post(controllers.sectionController.create);
apiRouter.route('/section/:id')
   .get(controllers.sectionController.get)
   .put(controllers.sectionController.update)
   .delete(controllers.sectionController.delete);

// Department Routes
apiRouter.route('/department')
   .get(controllers.departmentController.index)
   .post(controllers.departmentController.create);
apiRouter.route('/department/:id')
   .get(controllers.departmentController.get)
   .put(controllers.departmentController.update)
   // .delete(controllers.departmentController.delete);

// Collection Routes
apiRouter.route('/collection')
   .get(controllers.collectionController.index)
   .post(controllers.collectionController.create);
apiRouter.route('/collection/:id')
   .get(controllers.collectionController.get)
   .put(controllers.collectionController.update)
   // .delete(controllers.collectionController.delete);

// Personnel Group Routes
apiRouter.route('/personnel_group')
   .get(controllers.personnelGroupController.index)
   .post(controllers.personnelGroupController.create);
apiRouter.route('/personnel_group/:id')
   .get(controllers.personnelGroupController.get)
   .put(controllers.personnelGroupController.update)
   // .delete(controllers.personnelGroupController.delete);

// Borrowing Document Routes
apiRouter.route('/borrowing_doc')
   // .get(controllers.borrowingDocumentController.index)
   .post(controllers.borrowingDocumentController.create);
apiRouter.route('/borrowing_doc/:id')
   .get(controllers.borrowingDocumentController.get)
   // .put(controllers.borrowingDocumentController.update)
   // .delete(controllers.borrowingDocumentController.delete);

// Report Routes
apiRouter.get('/reports/summary_report_personnel',
   controllers.borrowingDocumentController.getSummaryReportPersonnel);

apiRouter.get('/reports/summary_report_department',
   controllers.borrowingDocumentController.getSummaryReportDepartment);

apiRouter.get('/reports/summary_report_student',
   controllers.borrowingDocumentController.getSummaryReportStudent);

mainRouter.use((req, res, next) => next(createError(404)));
mainRouter.use(middlewares.errorHandler);

module.exports = mainRouter;