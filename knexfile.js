const ENV = process.env.NODE_ENV || 'development';
const { DATABASE_URL } = process.env;

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};

const customConfigs = {
  development: {
    connection: {
      database: 'nc_news',
    },
  },
  test: {
    connection: {
      database: 'nc_news_test',
    },
  },
  production: {
    connection: `${DATABASE_URL}?ssl=true`,
  },
};

module.exports = { ...baseConfig, ...customConfigs[ENV] };
