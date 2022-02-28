

export const env = process.env.NODE_ENV || 'development';
console.log("Database:", process.env.DB_DATABASE);
const config = {
  development: {
    // host: process.env.DB_HOST,
    host: '/tmp/', // path to directory
    database: 'fafbot', // process.env.DB_DATABASE,
    username: 'brackman', // process.env.DB_USER,
    password: 'socket', // process.env.DB_PASSWORD,
    dialect: "postgres",
    logging: console.log
  },
  test: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: "postgres",
  },
  production: {
    host: '/tmp/.s.PGSQL.5432',
    // host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: "postgres",
    dialectOptions: { socketPath: '/tmp/.s.PGSQL.5432' },
  }
};
export default config[env];
