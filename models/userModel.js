let db = require('../db/knex');

class User {
   
   constructor(data) {
      this.id = data.id;
      this.fname = data.fname;
      this.lname = data.lname;
   }

   getFormalName() {
      return this.lname + ", " + this.fname;
   }
   
   // Static functions

   static async getUsers() {
      let result = await db.select().from('user');
      let res = [];
      result.forEach(function(v) {
         res.push(new User(v));
      });
      return res;
   }

}

module.exports = User;