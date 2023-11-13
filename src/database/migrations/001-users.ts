exports.up = async function (DB) {
	const tableExists = await DB`
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = 'users'
  )`;
	if (tableExists[0].exists) {
		await DB`
      DROP TABLE users
    `;
	}
};
