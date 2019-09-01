const knex = require('../../db/knex');
const joi = require('joi');

class BorrowingDocumentModel {

	static async get(id) {
		return await knex('borrow_doc').where({id: id}).first();
	}

	static async getItems(id) {
		return await knex('borrow_doc_item').where({borrow_doc_id: id});
	}
	
	static async getSummaryReport() {
		let collections = await knex("collection");

		let query = knex({pg: 'personnel_group'})
			.rightJoin({d: 'department'}, 'd.id', 'pg.department_id')
			.innerJoin({bd: 'borrow_doc'}, 'pg.id', 'bd.personnel_group_id')
			.innerJoin({bdi: 'borrow_doc_item'}, 'bd.id', 'bdi.borrow_doc_id')
			.innerJoin({c: 'collection'}, 'c.id', 'bdi.collection_id')
			.whereRaw(`
				EXTRACT(YEAR FROM bd.created_at) = :year
				AND EXTRACT(MONTH FROM bd.created_at) = :month
			`, {year: 2019, month: 8})
			.groupBy('d.id', 'pg.id')
			.select(knex.ref('d.id').as('department_id'))
			.select(knex.ref('pg.id').as('personnel_group_id'));

		for(let i = 0; i < collections.length; i++) {
			query.select(knex.raw('SUM(CASE c.prefix WHEN :prefix THEN bdi.qty ELSE 0 END) AS :prefix:', {prefix: collections[i].prefix}));
		}

		console.log(query.toString());

		return query;
	}

	static async create(data) {
		return new Promise(async (resolve, reject) => {

			try {
				let ids = await knex("borrow_doc").returning("id").insert({
					department_id: data.department_id,
					section_id: data.section_id,
					personnel_group_id: data.personnel_group_id,
					sy_id: data.sy_id
				});

				// Check if query returned an array of inserted IDs
				if (!Array.isArray(ids) && ids.length == 0)
					reject(Error("Error"));

				let borrowingDoc = await BorrowingDocumentModel.get(ids[0]);

				for (let i = 0; i < data.items.length; i++) {
					let item = data.items[i];

					let item_ids = await knex("borrow_doc_item").returning("id").insert({
						borrow_doc_id: borrowingDoc.id,
						collection_id: item.collection_id,
						qty: item.qty
					});
			
					// Check if query returned an array of inserted IDs
					if (!Array.isArray(item_ids) && item_ids.length == 0)
						reject(Error("Error"));
				}

				borrowingDoc.items = await BorrowingDocumentModel.getItems(borrowingDoc.id);

				resolve(borrowingDoc);
			} catch (e) {
				reject(e);
			}

		});
			
	}

	// static async update(id, data) {
	//    return knex("borrow_doc")
	//       .where({id: id})
	//       .returning("id")
	//       .update({
	//          name: data.name,
	//          department_id: data.department_id,
	//          is_faculty: data.is_faculty
	//       });
	// }

	static async validate(data) {
		const schema = joi.object().keys({
			department_id        : joi.number().label("Department").required(),
			section_id           : joi.number().label("Section"),
			personnel_group_id   : joi.number().label("Personnel Group"),
			sy_id					   : joi.number().label("School Year").required(),

			items	: joi.array().min(1).label("Items").required().items(
				joi.object().keys({
					collection_id  : joi.number().label("Collection").required(),
					qty				: joi.number().integer().label("Quantity").required()
				})
			)
		}).nand('section_id', 'personnel_group_id');
		
		return schema.validate(data, {abortEarly: false});
	}

}

module.exports = BorrowingDocumentModel;