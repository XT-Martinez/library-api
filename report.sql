SELECT
	d.name AS department_name,
	pg.name AS personnel_group_name,
	d.id AS department_id,
	pg.id AS personnel_group_id,
	SUM(CASE c.prefix WHEN 'S' THEN bdi.qty ELSE 0 END) AS COL_S,
	SUM(CASE c.prefix WHEN 'F' THEN bdi.qty ELSE 0 END) AS COL_F,
	SUM(CASE c.prefix WHEN 'C' THEN bdi.qty ELSE 0 END) AS COL_C,
	SUM(CASE c.prefix WHEN 'FIL' THEN bdi.qty ELSE 0 END) AS COL_FIL,
	SUM(CASE c.prefix WHEN 'FIL_F' THEN bdi.qty ELSE 0 END) AS COL_FIL_F,
	SUM(CASE c.prefix WHEN 'B' THEN bdi.qty ELSE 0 END) AS COL_B,
	SUM(CASE c.prefix WHEN 'GN' THEN bdi.qty ELSE 0 END) AS COL_GN,
	SUM(CASE c.prefix WHEN 'CL' THEN bdi.qty ELSE 0 END) AS COL_CL,
	SUM(CASE c.prefix WHEN 'TC' THEN bdi.qty ELSE 0 END) AS COL_TC,
	SUM(CASE c.prefix WHEN 'CH' THEN bdi.qty ELSE 0 END) AS COL_CH
FROM borrow_doc AS bd
INNER JOIN borrow_doc_item AS bdi ON bd.id = bdi.borrow_doc_id
INNER JOIN collection AS c ON c.id = bdi.collection_id
INNER JOIN personnel_group AS pg ON pg.id = bd.personnel_group_id
INNER JOIN department AS d ON d.id = pg.department_id
WHERE EXTRACT(YEAR FROM bd.created_at) = 2019
AND EXTRACT(MONTH FROM bd.created_at) = 8
GROUP BY d.name, pg.name;