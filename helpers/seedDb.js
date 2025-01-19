// Import the pg library
const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'public',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Dummy data for Indian users
const userData = [
  {
    name: 'Arjun Kapoor',
    age: 25,
    address: {
      line1: '12 MG Road',
      line2: 'Near City Mall',
      city: 'Mumbai',
      state: 'Maharashtra',
    },
    additional_info: { gender: 'male' },
  },
  {
    name: 'Priya Sharma',
    age: 30,
    address: {
      line1: '45 Sarojini Nagar',
      line2: 'Behind Market Complex',
      city: 'Delhi',
      state: 'Delhi',
    },
    additional_info: { gender: 'female' },
  },
  {
    name: 'Rohan Das',
    age: 35,
    address: {
      line1: '23 Park Street',
      line2: 'Opposite Central Park',
      city: 'Kolkata',
      state: 'West Bengal',
    },
    additional_info: { gender: 'male' },
  },
  {
    name: 'Ananya Iyer',
    age: 22,
    address: {
      line1: '17 Brigade Road',
      line2: 'Near City Center',
      city: 'Bangalore',
      state: 'Karnataka',
    },
    additional_info: { gender: 'female' },
  },
  {
    name: 'Vikram Singh',
    age: 45,
    address: {
      line1: '9 Civil Lines',
      line2: 'Close to District Office',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
    },
    additional_info: { gender: 'male' },
  },
  {
    name: 'Neha Gupta',
    age: 28,
    address: {
      line1: '81 Laxmi Nagar',
      line2: 'Near Metro Station',
      city: 'Pune',
      state: 'Maharashtra',
    },
    additional_info: { gender: 'female' },
  },
  {
    name: 'Manish Tiwari',
    age: 50,
    address: {
      line1: '56 Gandhi Path',
      line2: 'Near Old Fort',
      city: 'Jaipur',
      state: 'Rajasthan',
    },
    additional_info: { gender: 'male' },
  },
  {
    name: 'Pooja Mehta',
    age: 40,
    address: {
      line1: '14 MG Marg',
      line2: 'Adjacent to Museum',
      city: 'Chennai',
      state: 'Tamil Nadu',
    },
    additional_info: { gender: 'female' },
  },
  {
    name: 'Karan Patel',
    age: 33,
    address: {
      line1: '27 Race Course Road',
      line2: 'Close to Race Track',
      city: 'Hyderabad',
      state: 'Telangana',
    },
    additional_info: { gender: 'male' },
  },
  {
    name: 'Simran Kaur',
    age: 29,
    address: {
      line1: '18 Golden Temple Road',
      line2: 'Near Temple Complex',
      city: 'Amritsar',
      state: 'Punjab',
    },
    additional_info: { gender: 'female' },
  },
];

// Seed data into the database
const seedUsers = async () => {
  try {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      age INT,
      address JSONB,
      additional_info JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
    for (const user of userData) {
      const query = `
        INSERT INTO users (name, age, address, additional_info)
        VALUES ($1, $2, $3::jsonb, $4::jsonb)
      `;
      const values = [
        user.name,
        user.age,
        JSON.stringify(user.address),
        JSON.stringify(user.additional_info),
      ];
      await pool.query(query, values);
    }
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error while seeding:', error);
  } finally {
    await pool.end();
  }
};

// Run the seeding script
seedUsers();