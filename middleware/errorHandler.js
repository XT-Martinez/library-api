module.exports = (err, req, res, next) => {

   // Handle validation errors
   if ("name" in err && err.name === 'ValidationError') {
      console.log(err);
      let messages = [];

      err.details.forEach(v => {
         messages.push({
            msg: v.message + '.',
            path: v.path
         });
      });

      res.status(422).json({ValidationMessages: messages});         
   }
   // Handle TypeError
   else if (err instanceof TypeError) {
      res.status(500).json({
         message: err.message,
         stack: err.stack
      });
   }
   // Handle general errors
   else {
      // set locals, only providing error in development
      // res.locals.message = err.message;
      // res.locals.error = req.app.get('env') === 'development' ? err : {};

      res.status(err.status || 500);
      console.error(err);
      res.json({error: err});
   }
};