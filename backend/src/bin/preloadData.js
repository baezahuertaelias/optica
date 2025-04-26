const bcrypt = require("bcrypt");
const { Users, UserTypes } = require("../models");

module.exports = {
  async fun() {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await Users.create([
        {
          username: "elias",
          password: hashedPassword,
          userTypeId: 1,
        },
        {
          username: "javi",
          password: hashedPassword,
          userTypeId: 2,
        },
      ]);

      console.log("User created:", user);

      const typeUser = await UserTypes.create(
        {
          id: 1,
          type: "Admin",
        },
        {
          id: 2,
          type: "Bendedor",
        }
      );

      console.log("TypeUser created:", typeUser);
      
    } catch (error) {
      console.error("Error creating user:", error);
    }
  },
};
