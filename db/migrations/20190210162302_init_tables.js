
exports.up = function (knex, Promise) {
	return knex.schema
	
	.createTable('user', function (table) {
		table.increments("id");
		table.string("fname").notNullable();
		table.string("lname").notNullable();
		table.string("username").notNullable();
		table.string("password").notNullable();
		table.boolean("is_active").notNullable().defaultTo(true);
	})
	
	.createTable('collection', function (table) {
		table.increments("id");
		table.string("prefix").notNullable();
		table.string("name").notNullable();
	})
	
	.createTable('department', function (table) {
		table.increments("id");
		table.string("name").notNullable();
		table.boolean("is_personnel").notNullable();
	})

	.createTable("school_year", table => {
		table.increments("id");
		table.integer("start_sy").notNullable();
		table.integer("end_sy").notNullable();
		table.boolean("is_active").notNullable();
		table.timestamp("created_at").defaultTo(knex.fn.now());
	})

	.createTable("personnel_group", function (table) {
		table.increments("id");
		table.string("name").notNullable();
		table.integer("department_id").references('id').inTable('department').notNullable();
		table.boolean("is_faculty").notNullable();
	})
	
	.createTable('grade_level', function (table) {
		table.increments("id");
		table.string("name").notNullable();
		table.integer("department_id").references('id').inTable('department').notNullable();
		table.integer("sy_id").references('id').inTable('school_year').notNullable();
	})
	
	.createTable('section', function (table) {
		table.increments("id");
		table.string("name").notNullable();
		table.integer("grade_level_id").references('id').inTable('grade_level').notNullable();
	})
	
	.createTable('borrow_doc', function (table) {
		table.increments("id");
		table.integer("department_id").references('id').inTable('department').notNullable();
		table.integer("section_id").references('id').inTable('section');
		table.integer("personnel_group_id").references('id').inTable('personnel_group');
		table.integer("sy_id").references('id').inTable('school_year').notNullable();
		table.timestamp("created_at").defaultTo(knex.fn.now());
	})
	
	.createTable('borrow_doc_item', function (table) {
		table.increments("id");
		table.integer("borrow_doc_id").references('id').inTable('borrow_doc').notNullable();
		table.integer("collection_id").references('id').inTable('collection').notNullable();
		table.integer("qty");
	})
	
	;
};

exports.down = function (knex, Promise) {
	return knex.schema
	.dropTable('borrow_doc_item')
	.dropTable('borrow_doc')
	.dropTable('section')
	.dropTable('personnel_group')
	.dropTable('grade_level')
	.dropTable('school_year')
	.dropTable('department')
	.dropTable('collection')
	.dropTable('user');
};
