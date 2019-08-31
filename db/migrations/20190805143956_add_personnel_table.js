exports.up = function (knex, Promise) {
	return knex.schema

		.createTable("personnel_group", function (table) {
			table.increments("id");
			table.string("name").notNullable();
			table.integer("department_id").references('id').inTable('department').notNullable();
		})
		
		.table("borrow_doc", table => {
			table.integer("personnel_group_id").references('id').inTable('personnel_group');
		});
};

exports.down = function (knex, Promise) {
	return knex.schema
		.table("borrow_doc", table => table.dropColumn("personnel_group_id"))
		.dropTable("personnel_group");
};
