
exports.seed = async function (knex, Promise) {
	// Deletes ALL existing entries
	await knex('grade_level').del();
	let elemDept = await knex('department').select('id').where({ name: "Elementary Student" }).first();

	// Create default school year
	await knex('school_year').del();
	let sy_id = await knex('school_year').returning("id").insert({
		start_sy: 2019,
		end_sy: 2020,
		is_active: 1
	});
	
	await knex('grade_level').returning(['id', 'name']).insert([
		{ name: "Grade 1", department_id: elemDept.id, sy_id: sy_id[0] },
		{ name: "Grade 2", department_id: elemDept.id, sy_id: sy_id[0] },
		{ name: "Grade 3", department_id: elemDept.id, sy_id: sy_id[0] },
		{ name: "Grade 4", department_id: elemDept.id, sy_id: sy_id[0] },
		{ name: "Grade 5", department_id: elemDept.id, sy_id: sy_id[0] },
		{ name: "Grade 6", department_id: elemDept.id, sy_id: sy_id[0] }
	]);

	let jrHsDept = await knex('department').select('id').where({ name: "Junior HS Student" }).first();

	await knex('grade_level').returning(['id', 'name']).insert([
		{ name: "Grade 7", department_id: jrHsDept.id, sy_id: sy_id[0] },
		{ name: "Grade 8", department_id: jrHsDept.id, sy_id: sy_id[0] },
		{ name: "Grade 9", department_id: jrHsDept.id, sy_id: sy_id[0] },
		{ name: "Grade 10", department_id: jrHsDept.id, sy_id: sy_id[0] }
	]);

	let srHsDept = await knex('department').select('id').where({ name: "Senior HS Student" }).first();

	await knex('grade_level').returning(['id', 'name']).insert([
		{ name: "Grade 11", department_id: srHsDept.id, sy_id: sy_id[0] },
		{ name: "Grade 12", department_id: srHsDept.id, sy_id: sy_id[0] }
	]);

	let gradeLevelResult = await knex('grade_level');
		
	if (Array.isArray(gradeLevelResult)) {
		let sections = [];
		gradeLevelResult.forEach(gradeLevel => {
			let arr = gradeLevel.name.split(' ');
			let grade_index = arr[arr.length - 1];
			let section_letter = '';
			for (i = 1; i <= 6; i++) {
				// let grade_index = gradeLevel.name[gradeLevel.name.length - 1];
				switch (i) {
					case 1: section_letter = 'A'; break;
					case 2: section_letter = 'B'; break;
					case 3: section_letter = 'C'; break;
					case 4: section_letter = 'D'; break;
					case 5: section_letter = 'E'; break;
					case 6: section_letter = 'F'; break;
					default: break;
				}
				
				sections.push({ name: grade_index + section_letter, grade_level_id: gradeLevel.id });
			}
		});
		
		await knex('section').del();
		await knex('section').insert(sections);
	}

};
