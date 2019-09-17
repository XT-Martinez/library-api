select
	"d"."id" as "department_id",
	(select sum("borrower_count")
		from "borrow_doc"
		where "department_id" = "d"."id"
		and (EXTRACT(YEAR FROM created_at) = 2019
			AND EXTRACT(MONTH FROM created_at) = 9)
	) as "borrower_count",
	SUM(CASE c.prefix WHEN 'S' THEN bdi.qty ELSE 0 END) AS "S", 
	SUM(CASE c.prefix WHEN 'F' THEN bdi.qty ELSE 0 END) AS "F", 
	SUM(CASE c.prefix WHEN 'C' THEN bdi.qty ELSE 0 END) AS "C", 
	SUM(CASE c.prefix WHEN 'FIL' THEN bdi.qty ELSE 0 END) AS "FIL", 
	SUM(CASE c.prefix WHEN 'FIL_F' THEN bdi.qty ELSE 0 END) AS "FIL_F", 
	SUM(CASE c.prefix WHEN 'B' THEN bdi.qty ELSE 0 END) AS "B", 
	SUM(CASE c.prefix WHEN 'GN' THEN bdi.qty ELSE 0 END) AS "GN", 
	SUM(CASE c.prefix WHEN 'CL' THEN bdi.qty ELSE 0 END) AS "CL", 
	SUM(CASE c.prefix WHEN 'TC' THEN bdi.qty ELSE 0 END) AS "TC", 
	SUM(CASE c.prefix WHEN 'CH' THEN bdi.qty ELSE 0 END) AS "CH"
from "department" as "d" 
inner join "borrow_doc" as "bd" on "d"."id" = "bd"."department_id" 
inner join "borrow_doc_item" as "bdi" on "bd"."id" = "bdi"."borrow_doc_id" 
inner join "collection" as "c" on "c"."id" = "bdi"."collection_id"
where 
	-- (EXTRACT(YEAR FROM bd.created_at) = 2019)
	EXTRACT(MONTH FROM bd.created_at) = 9
group by "d"."id"