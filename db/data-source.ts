// import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

import { DataSource, DataSourceOptions } from 'typeorm';

// const config: MysqlConnectionOptions = {
//   type: 'mysql',
//   host: 'localhost',
//   port: 3306,
//   username: 'root',
//   password: '123',
//   database: 'nest_typeorm',
//   entities: ['dist/src/**/*.entity.js'],
//   // synchronize: true, //false
// };
// export default config;

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123',
  database: 'new_nest',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
