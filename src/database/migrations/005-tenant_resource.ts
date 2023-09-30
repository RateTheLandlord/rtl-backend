exports.up = async function (DB) {
	await DB`
        CREATE TABLE tenant_resource (
            id SERIAL PRIMARY KEY,
            name TEXT,
            country_code VARCHAR(2),
            city TEXT,
            state TEXT,
            address TEXT,
            phone_number TEXT,
            date_added TIMESTAMP DEFAULT now(),
            description TEXT,
            href TEXT
        );
    `;
};
