module.exports = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'notodo',
  synchronize: true,
  logging: false,
  entities: [`${__dirname}/{dist,src}/entity/**/*{.ts,js}`],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    migrationsDir: 'src/migration/',
  },
}
