const jwt = require("jsonwebtoken")

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


const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    // Checking if json web tokn exist and is verified
    if(token) {
      const decoded =   jwt.verify(token, "this is the hardest secret to decode", async(err, decodedToken) => {
        console.log(decoded)
            if(err) {
                console.log(err.message)
                res.send({message: "There was an error", err})
                // next()
            } 
            else{
                const user = await knex().where({ id })
                console.log(decodedToken.iat)
                console.log(user)
                console.log('Token was verified, User is allowed to continue')
                next()
                // res.status(200).send({message: "There was no error and token was identified",token: decodedToken})
            }
        })
    }
    else{
        res.redirect("/")
    }
}

module.exports = { requireAuth }