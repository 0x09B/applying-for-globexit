WITH Emp AS (
    SELECT subdivision_id AS start_sub_id
    FROM collaborators
    WHERE id = 710253
),

Descendants AS (
    SELECT s.id, s.name, s.parent_id, CAST(1 AS int) AS level_from_start
    FROM subdivisions s
    CROSS JOIN Emp e
    WHERE s.parent_id = e.start_sub_id
      AND s.id NOT IN (100055, 100059)
    UNION ALL
    SELECT s.id, s.name, s.parent_id, d.level_from_start + 1
    FROM subdivisions s
    JOIN Descendants d ON s.parent_id = d.id
    WHERE s.id NOT IN (100055, 100059)
),

Hierarchy AS (
    SELECT s.id, s.parent_id, s.name, CAST(0 AS int) AS root_level
    FROM subdivisions s
    WHERE s.parent_id IS NULL
    UNION ALL
    SELECT s.id, s.parent_id, s.name, h.root_level + 1
    FROM subdivisions s
    JOIN Hierarchy h ON s.parent_id = h.id
)
SELECT
    c.id,
    c.name,
    sd.name AS sub_name,
    sd.id   AS sub_id,
    h.root_level AS sub_level,
    COUNT(*) OVER (PARTITION BY sd.id) AS colls_count
FROM collaborators AS c
JOIN Descendants AS d ON c.subdivision_id = d.id
JOIN subdivisions AS sd ON sd.id = c.subdivision_id
JOIN Hierarchy    AS h  ON h.id = sd.id
WHERE c.age < 40
ORDER BY h.root_level ASC, sd.id ASC, c.name ASC;

