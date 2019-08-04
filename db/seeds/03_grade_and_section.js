
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('grade_level').del().then(async function () {
      
      let result = await knex('department').select('id').where({name: "Elementary Students"});

      if (result.length > 0) {
        let department_id = result[0].id;
        
        return knex('grade_level').returning(['id', 'name']).insert([
          {name: "Grade 1", department_id: department_id},
          {name: "Grade 2", department_id: department_id},
          {name: "Grade 3", department_id: department_id},
          {name: "Grade 4", department_id: department_id},
          {name: "Grade 5", department_id: department_id},
          {name: "Grade 6", department_id: department_id},
          {name: "Grade 7", department_id: department_id}
        ])
        .then(function(gradeLevelResult) {
          // console.log(gradeLevelResult);

          let sections = [];
          gradeLevelResult.forEach(gradeLevel => {
            for (i = 1; i <= 6; i++) {
              let grade_index = gradeLevel.name[gradeLevel.name.length - 1];
              let section_letter = '';

              switch (i) {
                case 1: section_letter='A'; break;
                case 2: section_letter='B'; break;
                case 3: section_letter='C'; break;
                case 4: section_letter='D'; break;
                case 5: section_letter='E'; break;
                case 6: section_letter='F'; break;
                default: break;
              }

              sections.push({name: grade_index+section_letter, grade_level_id: gradeLevel.id});
            }
          });

          return knex('section').del().then(function() {
            return knex('section').insert(sections);
          });
        });
      }

    });
};
