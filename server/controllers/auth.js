const bcrypt = require('bcryptjs')

module.exports = {
    signup: async (req, res) => {
        // user inputs their info: name, email, password
        // check if email exists in db
        // create a salt
        // create a hash from password and salt
        // create record for user in db (session)
        // add user to the session
        try {
            const db = req.app.get('db')
            let { name, email, password } = req.body

            let userResponse = await db.find_user_by_email(email)
            let user = userResponse[0]

            if (user) {
                return res.status(409).send('This email is already in use.')
            }

            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)

            let createdUser = await db.create_user({ name, email, hash })
            req.session.user = createdUser[0]
            res.send(req.session.user)
        } catch (error){
            console.log('error signing up user', error)
            res.status(500).send(error)
        }
    },

    login: async (req, res) => {
        try {
            //user inputs info: email, password
            // get user from db
            // if no user, send 409 status
            // compare the password and the hash using bcrypt
            // if they don't match send 401
            // if they DO match, save user on session
            let db = req.app.get('db')
            let { email, password } = req.body
            
            let userResponse = await db.find_user_by_email(email)
            let user = userResponse[0]

            if (!user) {
                return res.status(409).send('email not found')
            }

            const isAuthenticated = bcrypt.compareSync(password, user.password)

            if (!isAuthenticated) {
                return res.status(401).send('invalid password')
            }

            delete user.password

            req.session.user = user
            res.send(user)

        } catch (error) {
            console.log('error logging in user', error)
            res.status(500).send(error)
        }
    },

    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    },

    current: (req, res) => {
        res.send(req.session.user)
    }
}