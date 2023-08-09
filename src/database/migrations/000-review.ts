exports.up = async function (DB) {
  await DB`
    CREATE TABLE review (
      id SERIAL PRIMARY KEY, 
      landlord TEXT, 
      country_code VARCHAR(2),
      city TEXT,
      state TEXT,
      zip TEXT,
      review TEXT,
      repair numeric CHECK (repair >= 1 AND repair <= 5),
      health numeric CHECK (health >= 1 AND health <= 5),
      stability numeric CHECK (stability >= 1 AND stability <= 5),
      privacy numeric CHECK (privacy >= 1 AND privacy <= 5),
      respect numeric CHECK (respect >= 1 AND respect <= 5),
      dataAdded TIMESTAMP DEFAULT now(),
      flagged BOOLEAN,
      flagged_reason TEXT,
      admin_approved BOOLEAN,
      admin_edited BOOLEAN
    );
  `;
};
