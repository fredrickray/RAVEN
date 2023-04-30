// const nodemailer = require ('nodemailer');
const saltRounds = 10;
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const express = require ('express');
const cookieParser = require ('cookie-parser');
// const sendEmail = require ('../utls/sendEmail');
const crypto = require ('crypto');
const app = express ();
app.use (cookieParser ());

// requiring knex and connecting to the database
const knex = require ('knex') ({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'Raven',
  },
});

// knex.raw('CREATE DATABASE IF NOT EXISTS RAVEN')
//   .then(() => {
//     return knex.withSchema('RAVEN').schema.createTable('users', function(table) {
//         table.increments('id').primary();
//         table.string('firstname').notNullable();
//         table.string('lastname').notNullable();
//         table.string('username').notNullable();
//         table.string('email').notNullable().unique();
//         table.string('password').notNullable();
//         table.timestamps(false, true);
//     });
//   })
//   .then(() => {
//     console.log('Users table created!');
//     console.log({message: "User created and database connection destroyed"})
//     knex.destroy();
//   })
//   .catch((error) => {
//     console.error(error);
//     console.log("Connection destroyed")
//     knex.destroy();
//   });

//   knex.schema.createTable('users', (table) => {
//     table.increments('id').primary();
//     table.string('firstname').notNullable();
//     table.string('lastname').notNullable();
//     table.string('username').notNullable();
//     table.string('email').notNullable().unique();
//     table.string('password').notNullable();
//     table.timestamps(false, true);
//   }).then(() => {
//     console.log('Users table created!');
//   }).catch((error) => {
//     console.error(error);
//     console.log("There was an error")
//   });
  

const maxAge = 3 * 24 * 60 * 60;
const createToken = id => {
  return jwt.sign ({id}, process.env.SECRET, {
    expiresIn: maxAge,
  });
};

//Registering merchant
exports.register = async (req, res) => {
  bcrypt.hash (req.body.password, saltRounds, async (err, hash) => {
    const {fname, lname, email, username} = req.body;
    const password = hash;

    if (fname == '') {
      res.send ({message: 'Firstname field must not be empty'});
    } else if (fname.length < 4) {
      res.send ({message: 'Firname, a minimum of 4 chracters'});
    } else if (lname == '') {
      res.send ({message: 'Lastname field must not be empty'});
    } else if (lname.length <= 4) {
      res.send ({message: 'Lastname, a minimum of 4 chracters'});
    } else if (username == '') {
      res.send ({message: 'Username field must not be empty'});
    } else if (username.length < 2) {
      res.send ({
        message: 'Username field must have a minimum of 2 characters',
      });
    } else if (email == '') {
      res.send ({meesage: 'Email field must not be empty'});
    } else if (password == '') {
      res.send ({message: 'Password field must not be empty'});
    } else if (password.length <= 4) {
      res.send ({message: 'A mininmum of 8 chracters is required'});
    } else {
      try {
        let user = await knex ("users").insert ({
          email,
          fname,
          lname,
          password,
          username,
          // token,
        });
        const token = createToken (user.id);

        // else{
        res.cookie ('jwt', token, {
          httpOnly: true,
          withCredentials: true,
          maxAge: maxAge * 1000,
        });
        // res
        //   .status (201)
        //   .send ({message: 'An email was sent to your account, please verify'});
        // crypto.randomBytes (32).toString ('hex');
        // const url = `${process.env.BASE_URL}user/${user.id}/verify/${token}`;
        // await sendEmail (user.email, 'Verify Email', url);
        res.status (200).json ({
          success: true,
          message: 'Registration was successful',
          status: 'success',
          User: user,
          token,
        });
        console.log (user);
      } catch (error) {
        console.log (error);
        res
          .status (400)
          .json ({status: 'An error occured', message: 'Error', error});
      }
    }
  });
};

//To Login a Merchant
exports.login = async (req, res) => {
  const {email, password} = req.body;

  try {
    let user = await knex ('Merchants').where ({email}).first ();

    if (!user) {
      res.status (401).json ({message: 'Wrong email or passsword, try again'});
    } else {
      let hashedPassword = user.password;
      let isValid = await bcrypt.compare (password, hashedPassword);
      const token = createToken (user.id);
      if (!isValid) {
        res.status (401).json ({message: 'Wrong email or password, try again'});
      } else {
        // res.cookie("test", true)
        res.cookie ('jwts', token, {
          httpOnly: true,
          withCredentials: true,
          maxAge: maxAge * 1000,
        });
        console.log ({user: user, token});
        // console.log(user.id)
        res.status (200).json ({
          status: 'success',
          data: user,
          message: 'Logged in successfully',
          token,
        });
      }
    }
  } catch (error) {
    console.log (error);
  }
};
