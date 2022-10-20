import DBConnection from "./../configs/DBConnection";
import bcrypt from "bcryptjs";

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        // CHECK IF EMAIL ALREADY EXISTS
        let isEmailExist = await checkExistEmail(data.email);
        if (isEmailExist) {
            reject(`This email "${data.email}" has already exist. Please choose an other email`)
            console.log(`This email "${data.email}" has already exist. Please choose an other email`);
        } else {
            // HASH PASSSWORD
            let salt = bcrypt.genSaltSync(10);
            var password = data.password
            console.log(password)
            let userItem = {
                username: data.username,
                email: data.email,
                password: bcrypt.hashSync(data.password, salt),
            };


            //CREATE
            //INSERT INTO `users` (`username`, `email`, `password`) VALUES ('?', '?', '?'), [username, email, password]

            //'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
            //['Page', 45],
            DBConnection.query( 
                'INSERT INTO users set ? ', userItem,
                function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Create a new user successful")
                    console.log("Create a new user successful");
                    console.log(userItem)
                }
            );
        }
    });
};

let checkExistEmail = (email) => {
    return new Promise( (resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * FROM `users` WHERE `email` = ?  ', email,
                function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    if (rows.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};
module.exports = {
    createNewUser: createNewUser
};
