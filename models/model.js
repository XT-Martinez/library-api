class Model {

   constructor (data) {
      for (var key in data)
         this[key] = data[key];
   }

   getId() {
      return this.id;
   }

}

module.exports = Model;