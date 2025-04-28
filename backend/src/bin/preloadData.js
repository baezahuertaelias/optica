const bcrypt = require("bcrypt");
const { Users, UserTypes, Isapres, Genders } = require("../models");

module.exports = {
  async insertBasicData() {
    try {

      console.log('== CARGANDO DATOS ==');
      console.log('==== TYPE  USER ====');

      await UserTypes.bulkCreate(
        [{
          id: 1,
          type: "Admin",
        },
        {
          id: 2,
          type: "Vendedor",
        }]
      );

      console.log('======= USER =======');
      const hashedPassword = await bcrypt.hash('123', 10);
      await Users.create({
        id: 1,
        username: "elias",
        password: hashedPassword,
        userTypeId: 1,
        status: true
      })

      console.log('====== ISAPRE ======');

      await Isapres.bulkCreate(
        [{
          value: "Banmedica",
        },
        {
          value: "Isalud",
        },
        {
          value: "Colmena",
        },
        {
          value: "Consalud",
        },
        {
          value: "Cruz Blanca",
        },
        {
          value: "Nueva Masvida",
        },
        {
          value: "Fundacion BancoEstado",
        },
        {
          value: "Vida tres",
        },
        {
          value: "Escencial",
        }]
      );

      console.log('====== GENDER ======');
      await Genders.bulkCreate([
        { value: 'Mujer' },
        { value: 'Hombre' },
        { value: 'Otro' }
      ]);
      console.log('== DATOS CARGADOS ==');

    } catch (error) {
      console.error("Error inserting basic data:", error);
    }
  },
};
