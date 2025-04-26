//POR ALGUN MOTIVO EN MAC SE AGREGA EL backslashr

module.exports = {
    development: {
      username: process.env.DB_USER.replaceAll('\r', ''),
      password: process.env.DB_PASSWORD.replaceAll('\r', ''),
      database: process.env.DB_NAME.replaceAll('\r', ''),
      host: process.env.DB_HOST.replaceAll('\r', ''),
      dialect: 'postgres',
      logging: false
    },
    production: {
      username: process.env.DB_USER.replaceAll('\r', ''),
      password: process.env.DB_PASSWORD.replaceAll('\r', ''),
      database: process.env.DB_NAME.replaceAll('\r', ''),
      host: process.env.DB_HOST.replaceAll('\r', ''),
      dialect: 'postgres',
      logging: false
    }
  };