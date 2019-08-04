const express = require('express');
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



apiRouter.route('/grade_level')
   .get(controllers.gradeLevelController.index)
   .post(controllers.gradeLevelController.create);
apiRouter.route('/grade_level/:id')
   .get(controllers.gradeLevelController.get)
   .put(controllers.gradeLevelController.update)
   .delete(controllers.gradeLevelController.delete);

module.exports = mainRouter;