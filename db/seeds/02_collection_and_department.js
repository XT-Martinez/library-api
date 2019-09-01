
exports.seed = async function(knex, Promise) {	
	// Delete all existing collection
	await knex('collection').del();
	// Insert default collection records
	await knex('collection').insert([
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

	await knex('department').del();
	await knex('department').insert([
		// Academe Department
		{name: "Elementary Student", is_personnel: false },
		{name: "Junior HS Student", is_personnel: false },
		{name: "Senior HS Student", is_personnel: false },
		// // Faculty Department
		// {name: "Elementary Faculty Department", is_faculty: true, is_student: false},
		// {name: "Highschool Faculty Department", is_faculty: true, is_student: false},
		// {name: "Elementary Chinese Department", is_faculty: true, is_student: false},
		// {name: "Highschool Chinese Department", is_faculty: true, is_student: false},
		// // Other Department
		// {name: "Non-Teaching", is_faculty: false, is_student: false},
		// {name: "Administration", is_faculty: false, is_student: false},
		// {name: "General Services", is_faculty: false, is_student: false}
		{name: "Admin / Personnel", is_personnel: true },
	]);
	
};
