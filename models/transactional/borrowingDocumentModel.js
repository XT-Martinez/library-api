const knex = require('../../db/knex');
const joi = require('joi');
const FilterTypes = require('../../constants/FilterTypes');

class BorrowingDocumentModel {

	static async get(id) {
		return await knex('borrow_doc').where({id: id}).first();
	}

	static async getItems(id) {
		return await knex('borrow_doc_item').where({borrow_doc_id: id});
	}

	static async getSummaryReportDepartment(filter) {
		let query = knex({d: 'department'})
			.innerJoin({bd: 'borrow_doc'}, 'd.id', 'bd.department_id')
			.innerJoin({bdi: 'borrow_doc_item'}, 'bd.id', 'bdi.borrow_doc_id')
			.innerJoin({c: 'collection'}, 'c.id', 'bdi.collection_id')
			.groupBy('d.id')
			.select(knex.ref('d.id').as('department_id'));
			// .select(knex
			// 	.raw(`(
			// 		SELECT SUM(borrower_count)
			// 		FROM borrow_doc WHERE department_id = d.id
			// 		) AS "borrower_count"`));
		
		// let subQueryBorCount = knex('borrow_doc')
		// 	.sum('borrower_count')
		// 	.where({department_id: knex.ref('d.id')})
		// 	.as('borrower_count');
		
		// switch(filter.filter_type) {
		// 	case FilterTypes.FILTER_BY_MONTH_YEAR:
		// 		let params = {year: parseInt(filter.year), month: parseInt(filter.month)};
		// 		query.whereRaw(`
		// 			(EXTRACT(YEAR FROM bd.created_at) = :year
		// 			AND EXTRACT(MONTH FROM bd.created_at) = :month)
		// 		`, params);

		// 		subQueryBorCount.whereRaw(`
		// 			(EXTRACT(YEAR FROM created_at) = :year
		// 			AND EXTRACT(MONTH FROM created_at) = :month)
		// 		`, params);
		// 		break;

		// 	case FilterTypes.FILTER_BY_DATE_RANGE:
		// 		query.whereBetween('bd.created_at',
		// 			[filter.start_date, knex.raw("?::date + '1 day'::interval", [filter.end_date])]);

		// 		subQueryBorCount.whereBetween('created_at',
		// 			[filter.start_date, knex.raw("?::date + '1 day'::interval", [filter.end_date])]);
		// 		break;
		// }

		// query.select(subQueryBorCount);

		// // Dynamically add all collections as a pivot column in the select statement
		// // Set collection prefix as column header
		// for(let i = 0; i < collections.length; i++) {
		// 	query.select(
		// 		knex.raw(
		// 			'SUM(CASE c.prefix WHEN :prefix THEN bdi.qty ELSE 0 END) AS :prefix:',
		// 			{prefix: collections[i].prefix})
		// 		);
		// }

		// // Just to confirm if SQL query is correct :)
		// console.log(query.toString());
		// return query;
		return BorrowingDocumentModel.setCountQuery(query, filter, 1);
	}

	static async getSummaryReportPersonnel(filter) {
		let query = knex({pg: 'personnel_group'})
			.innerJoin({d: 'department'}, 'd.id', 'pg.department_id')
			.innerJoin({bd: 'borrow_doc'}, 'pg.id', 'bd.personnel_group_id')
			.innerJoin({bdi: 'borrow_doc_item'}, 'bd.id', 'bdi.borrow_doc_id')
			.innerJoin({c: 'collection'}, 'c.id', 'bdi.collection_id')
			.groupBy('d.id', 'pg.id')
			// .orderBy([{column: 'pg.is_faculty', order: 'desc'}, {column: 'pg.id', order: 'asc'}])
			.select(knex.ref('d.id').as('department_id'))
			.select(knex.ref('pg.id').as('personnel_group_id'));
			// .select(knex
			// 	.raw('(SELECT SUM(borrower_count) FROM borrow_doc WHERE personnel_group_id = pg.id) AS "borrower_count"'));

		// // Dynamically add all collections as a pivot column in the select statement
		// // Set collection prefix as column header
		// for(let i = 0; i < collections.length; i++) {
		// 	query.select(
		// 		knex.raw(
		// 			'SUM(CASE c.prefix WHEN :prefix THEN bdi.qty ELSE 0 END) AS :prefix:',
		// 			{prefix: collections[i].prefix})
		// 		);
		// }

		// Just to confirm if SQL query is correct :)
		// console.log(query.toString());

		// return query;
		return BorrowingDocumentModel.setCountQuery(query, filter, 2);
	}

	static async getSummaryReportStudent(filter) {
		let query = knex({s: 'section'})
			.innerJoin({gl: 'grade_level'}, 'gl.id', 's.grade_level_id')
			.innerJoin({d: 'department'}, 'd.id', 'gl.department_id')
			.innerJoin({bd: 'borrow_doc'}, 's.id', 'bd.section_id')
			.innerJoin({bdi: 'borrow_doc_item'}, 'bd.id', 'bdi.borrow_doc_id')
			.innerJoin({c: 'collection'}, 'c.id', 'bdi.collection_id')
			.groupBy('d.id', 'gl.id','s.id')
			.select(knex.ref('d.id').as('department_id'))
			.select(knex.ref('gl.id').as('grade_level_id'))
			.select(knex.ref('s.id').as('section_id'));
			// .select(knex
			// 	.raw('(SELECT SUM(borrower_count) FROM borrow_doc WHERE section_id = s.id) AS "borrower_count"'));
			
			

		// Just to confirm if SQL query is correct :)
		// console.log(query.toString());
		return BorrowingDocumentModel.setCountQuery(query, filter, 3);
	}
	
	static async setCountQuery(query, filter, category) {
		let collections = await knex("collection");

		let subQueryBorCount = knex('borrow_doc')
			.sum('borrower_count')
			.as('borrower_count');

		switch(category) {
			case 1: subQueryBorCount.where({department_id: knex.ref('d.id')}); break;
			case 2: subQueryBorCount.where({personnel_group_id: knex.ref('pg.id')}); break;
			case 3: subQueryBorCount.where({section_id: knex.ref('s.id')}); break;
		}
		
		switch(filter.filter_type) {
			case FilterTypes.FILTER_BY_MONTH_YEAR:
				let params = {year: parseInt(filter.year), month: parseInt(filter.month)};
				query.whereRaw(`
					(EXTRACT(YEAR FROM bd.created_at) = :year
					AND EXTRACT(MONTH FROM bd.created_at) = :month)
				`, params);

				subQueryBorCount.whereRaw(`
					(EXTRACT(YEAR FROM created_at) = :year
					AND EXTRACT(MONTH FROM created_at) = :month)
				`, params);
				break;

			case FilterTypes.FILTER_BY_DATE_RANGE:
				query.whereBetween('bd.created_at',
					[filter.start_date, knex.raw("?::date + '1 day'::interval", [filter.end_date])]);

				subQueryBorCount.whereBetween('created_at',
					[filter.start_date, knex.raw("?::date + '1 day'::interval", [filter.end_date])]);
				break;
		}

		query.select(subQueryBorCount);

		// Dynamically add all collections as a pivot column in the select statement
		// Set collection prefix as column header
		for(let i = 0; i < collections.length; i++) {
			query.select(
				knex.raw(
					'SUM(CASE c.prefix WHEN :prefix THEN bdi.qty ELSE 0 END) AS :prefix:',
					{prefix: collections[i].prefix})
				);
		}

		return query;
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
					created_at: typeof data.created_at === 'undefined' ? knex.fn.now() : data.created_at,
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

	static async createBulk(data) {
		return new Promise(async(resolve, reject) => {
			let result = [];
			for(let i=0; i < data.length; i++) {
				try {
					// Only insert if borrower count is inputted
					if(data[i].borrower_count > 0) {
						let r = await BorrowingDocumentModel.create(data[i]);
						result.push(r);
					}
				} catch {
					result.push(e.message);
				}
			}
			resolve(result);
		});
	}

	static async initValidationSchema() {
		return joi.object().keys({
			department_id        : joi.number().label("Department").required(),
			section_id           : joi.number().label("Section"),
			personnel_group_id   : joi.number().label("Personnel Group"),
			borrower_count			: joi.label("Borrower Count")
												// Borrower count only required when in non-bulk creation
												.when('is_bulk', {is: false, then: joi.number().integer().min(1).required()}),
			is_bulk		  			: joi.boolean().truthy(1, 'Y').falsy(0, 'N').label("Is Faculty?").required(),
			created_at				: joi.date().label("Log Date"),

			items	: joi.array().min(1).label("Items").required().items(
				joi.object().keys({
					collection_id  : joi.number().label("Collection").required(),
					qty				: joi.number().integer().label("Quantity").min(0).required()
				})
			)
		}).nand('section_id', 'personnel_group_id');
	}

	static async validate(data) {
		let schema = await BorrowingDocumentModel.initValidationSchema();
		return schema.validate(data, {abortEarly: false});
	}

	static async validateBulk(data) {
		let schema = await BorrowingDocumentModel.initValidationSchema();
		return joi.array().items(schema).validate(data, {abortEarly: false});
	}

	static async validateFilter(data) {
		const schema = joi.object().keys({
			filter_type				: joi.number().integer().required().valid([1, 2]),

			month						: joi.any().label("Month"),
			year						: joi.any().label("year"),

			start_date				: joi.any().label("Start Date"),
			end_date					: joi.any().label("End Date")
		})
		
		.when(
			joi.object({
				filter_type: joi.number().integer().valid(FilterTypes.FILTER_BY_MONTH_YEAR).required()
			}).unknown(),
			{
				then: joi.object({
					month: joi.number().integer().min(1).max(12).required(),
					year: joi.number().integer().required()
				})
			})
		.when(
			joi.object({
				filter_type: joi.number().integer().valid(FilterTypes.FILTER_BY_DATE_RANGE).required()
			}).unknown(),
			{
				then: joi.object({
					start_date: joi.date().required(),
					end_date: joi.date().min(joi.ref('start_date')).required()
				})
			});
		return schema.validate(data, {abortEarly: false});
	}

}

module.exports = BorrowingDocumentModel;