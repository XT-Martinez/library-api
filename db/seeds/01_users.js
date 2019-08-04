exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        {fname: "Christian Joel", lname: "Martinez", username: "admin", password: "admin"},
        {fname: "Joyce Ann", lname: "Cababat", username: "bahu", password: "bahu"}
      ]);
    });
};
