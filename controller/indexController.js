module.exports = {
   index: function (req, res, next) {
      res.status(200).json({msg: "Hello World"});
   }
};