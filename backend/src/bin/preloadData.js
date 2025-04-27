const bcrypt = require("bcrypt");
const { Users, UserTypes } = require("../models");

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



    } catch (error) {
      console.error("Error creating user:", error);
    }
  },
};
