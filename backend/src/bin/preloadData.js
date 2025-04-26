const bcrypt = require("bcrypt")
const {Users} = require("../models")

module.exports = {
    async fun() {
        const username = 'elias';
        const password = '123';
        const userTypeId = 2;

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await Users.create({
                username: username,
                password: hashedPassword,
                userTypeId
            });

            console.log('User created:', user);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }
}