const bcrypt = require("bcrypt");
const { Users, UserTypes, Isapres, Genders } = require("../models");

module.exports = {
  async insertBasicData() {
    try {

      console.log('================= TYPE USER');

      const typeUser = await UserTypes.bulkCreate(
        [{
          id: 1,
          type: "Admin",
        },
        {
          id: 2,
          type: "Vendedor",
        }]
      );

      console.log("TypeUser created:", typeUser);

      console.log('================= USER');
      const password = '123';
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await Users.create({
        id: 1,
        username: "elias",
        password: hashedPassword,
        userTypeId: 1,
        status: true
      })
      console.log("User created:", user);

      console.log('================= ISAPRES');

      const isapre = await Isapres.bulkCreate(
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

      console.log("isapre created:", isapre);

      console.log('================= GENERO');
      const genero = await Genders.bulkCreate([
        { value: 'Mujer' },
        { value: 'Hombre' },
        { value: 'Otro' }
      ]);

      console.log("genero created:", genero)






    } catch (error) {
      console.error("Error creating user:", error);
    }
  },
};
