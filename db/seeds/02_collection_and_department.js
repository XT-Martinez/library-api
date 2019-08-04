
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('collection').del().then(function () {
    // Inserts seed entries
    return knex('collection').insert([
      {prefix: 'S',     name: "Scholastic / Lexile"},
      {prefix: 'F',     name: "Fiction"},
      {prefix: 'C',     name: "Gen. Circulation"},
      {prefix: 'FIL',   name: "Filipiniana non-fiction"},
      {prefix: 'FIL_F', name: "Filipiniana fiction"},
      {prefix: 'B',     name: "Biography"},
      {prefix: 'GN',    name: "Graphic Novel"},
      {prefix: 'CL',    name: "Children's Literature"},
      {prefix: 'TC',    name: "Teacher's reference"},
      {prefix: 'CH',    name: "Chinese collection"}
    ])
    .then(function() {
      return knex('department').del().then(function() {
        return knex('department').insert([
          // Academe Department
          {name: "Elementary Students", is_faculty: false, is_student: true},
          {name: "Junior HS Students", is_faculty: false, is_student: true},
          {name: "Senior HS Students", is_faculty: false, is_student: true},
          // Faculty Department
          {name: "Elementary Faculty Department", is_faculty: true, is_student: false},
          {name: "Highschool Faculty Department", is_faculty: true, is_student: false},
          {name: "Elementary Chinese Department", is_faculty: true, is_student: false},
          {name: "Highschool Chinese Department", is_faculty: true, is_student: false},
          // Other Department
          {name: "Non-Teaching", is_faculty: false, is_student: false},
          {name: "Administration", is_faculty: false, is_student: false},
          {name: "General Services", is_faculty: false, is_student: false}
        ]);
      })
    });
  });
};
