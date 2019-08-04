module.exports = {

   authenticate: (req, res, next) => {
      console.log("Hey, I am a middleware!");
      next();  
   }

};