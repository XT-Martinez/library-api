const knex = require('../../db/knex');
const joi = require('joi');

class BorrowingDocumentModel {

	static async get(id) {
		return await knex('borrow_doc').where({id: id}).first();
	}

	static async getItems(id) {
		return await knex('borrow_doc_item').where({borrow_doc_id: id});
	}

	static async getSummaryReportDepartment() {
		let collections = await knex("collection");

		let query = knex({d: 'department'})
			.innerJoin({bd: 'borrow_doc'}, 'd.id', 'bd.department_id')
			.innerJoin({bdi: 'borrow_doc_item'}, 'bd.id', 'bdi.borrow_doc_id')
			.innerJoin({c: 'collection'}, 'c.id', 'bdi.collection_id')
			.groupBy('d.id')
			.select(knex.ref('d.id').as('department_id'))
			.select(knex
				.raw(`(
					SELECT SUM(borrower_count)
					FROM borrow_doc WHERE department_id = d.id
					) AS "borrower_count"`));

		// Dynamically add all collections as a pivot column in the select statement
		// Set collection prefix as column header
		for(let i = 0; i < collections.length; i++) {
			query.select(
				knex.raw(
					'SUM(CASE c.prefix WHEN :prefix THEN bdi.qty ELSE 0 END) AS :prefix:',
					{prefix: collections[i].prefix})
				);
		}

		// Just to confirm if SQL query is correct :)
		// console.log(query.toString());

		return query;
	}

	static async getSummaryReportDepartmentMonthly(month, year) {
		return BorrowingDocumentModel
			.getSummaryReportDepartment()
			.whereRaw(`
				(EXTRACT(YEAR FROM bd.created_at) = :year
				AND EXTRACT(MONTH FROM bd.created_at) = :month)
			`, {year: year, month: month});
	}
	
	static async getSummaryReportPersonnel() {
		let collections = await knex("collection");

		let query = knex({pg: 'personnel_group'})
			.innerJoin({d: 'department'}, 'd.id', 'pg.department_id')
			.innerJoin({bd: 'borrow_doc'}, 'pg.id', 'bd.personnel_group_id')
			.innerJoin({bdi: 'borrow_doc_item'}, 'bd.id', 'bdi.borrow_doc_id')
			.innerJoin({c: 'collection'}, 'c.id', 'bdi.collection_id')
			.groupBy('d.id', 'pg.id')
			// .orderBy([{column: 'pg.is_faculty', order: 'desc'}, {column: 'pg.id', order: 'asc'}])
			.select(knex.ref('d.id').as('department_id'))
			.select(knex.ref('pg.id').as('personnel_group_id'))
			.select(knex
				.raw('(SELECT SUM(borrower_count) FROM borrow_doc WHERE personnel_group_id = pg.id) AS "borrower_count"'));

		// Dynamically add all collections as a pivot column in the select statement
		// Set collection prefix as column header
		for(let i = 0; i < collections.length; i++) {
			query.select(
				knex.raw(
					'SUM(CASE c.prefix WHEN :prefix THEN bdi.qty ELSE 0 END) AS :prefix:',
					{prefix: collections[i].prefix})
				);
		}

		// Just to confirm if SQL query is correct :)
		// console.log(query.toString());

		return query;
	}

	static async getSummaryReportStudent() {
		let collections = await knex("collection");

		let query = knex({s: 'section'})
			.innerJoin({gl: 'grade_level'}, 'gl.id', 's.grade_level_id')
			.innerJoin({d: 'department'}, 'd.id', 'gl.department_id')
			.innerJoin({bd: 'borrow_doc'}, 's.id', 'bd.section_id')
			.innerJoin({bdi: 'borrow_doc_item'}, 'bd.id', 'bdi.borrow_doc_id')
			.innerJoin({c: 'collection'}, 'c.id', 'bdi.collection_id')
			.groupBy('d.id', 'gl.id','s.id')
			.select(knex.ref('d.id').as('department_id'))
			.select(knex.ref('gl.id').as('grade_level_id'))
			.select(knex.ref('s.id').as('section_id'))
			.select(knex
				.raw('(SELECT SUM(borrower_count) FROM borrow_doc WHERE section_id = s.id) AS "borrower_count"'));

		// Dynamically add all collections as a pivot column in the select statement
		// Set collection prefix as column header
		for(let i = 0; i < collections.length; i++) {
			query.select(
				knex.raw(
					'SUM(CASE c.prefix WHEN :prefix THEN bdi.qty ELSE 0 END) AS :prefix:',
					{prefix: collections[i].prefix})
				);
		}

		// Just to confirm if SQL query is correct :)
		// console.log(query.toString());

		return query;
	}

	static async getSummaryReportPersonnelMonthly(month, year) {
		return BorrowingDocumentModel
			.getSummaryReportPersonnel()
			.whereRaw(`
				(EXTRACT(YEAR FROM bd.created_at) = :year
				AND EXTRACT(MONTH FROM bd.created_at) = :month)
			`, {year: year, month: month});
	}

	static async create(data) {
		// Post a book borrowing transaction
		// Return the document header and line items if promise is successful.
		return new Promise(async (resolve, reject) => {

			try {
				let ids = await knex("borrow_doc").returning("id").insert({
					department_id: data.department_id,
					section_id: data.section_id,
					personnel_group_id: data.personnel_group_id,
					// sy_id: data.sy_id,
					created_at: typeof data.created_at === 'undefined' ? null : data.created_at,
					borrower_count: data.borrower_count,
					is_bulk: data.is_bulk
				});

				// Check if query returned an array of inserted IDs
				if (!Array.isArray(ids) && ids.length == 0)
					reject(Error("Error"));

				let borrowingDoc = await BorrowingDocumentModel.get(ids[0]);

				// Insert each 
				for (let i = 0; i < data.items.length; i++) {
					let item = data.items[i];
					
					if(item.qty > 0) {
						let item_ids = await knex("borrow_doc_item").returning("id").insert({
							borrow_doc_id: borrowingDoc.id,
							collection_id: item.collection_id,
							qty: item.qty
						});

						// Check if query returned an array of inserted IDs
						if (!Array.isArray(item_ids) && item_ids.length == 0)
						reject(Error("Error"));
					}
					
				}

				// Include the borrowing document items in the output.
				borrowingDoc.items = await BorrowingDocumentModel.getItems(borrowingDoc.id);

				resolve(borrowingDoc);

			} catch (e) { reject(e); }

		});
			
	}

	static async validate(data) {
		const schema = joi.object().keys({
			department_id        : joi.number().label("Department").required(),
			section_id           : joi.number().label("Section"),
			personnel_group_id   : joi.number().label("Personnel Group"),
			// sy_id					   : joi.number().label("School Year").required(),
			borrower_count			: joi.number().integer().label("Borrower Count").min(1).required(),
			is_bulk		  			: joi.boolean().truthy(1, 'Y').falsy(0, 'N').label("Is Faculty?").required(),
			created_at				: joi.date().label("Log Date"),

			items	: joi.array().min(1).label("Items").required().items(
				joi.object().keys({
					collection_id  : joi.number().label("Collection").required(),
					qty				: joi.number().integer().label("Quantity").min(0).required()
				})
			)
		}).nand('section_id', 'personnel_group_id');
		
		return schema.validate(data, {abortEarly: false});
	}

}

module.exports = BorrowingDocumentModel;