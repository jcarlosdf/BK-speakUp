const jwt = require('jsonwebtoken')
const chekUserCredential = require('../services/auth.services')
const UsersService = require('../services/users.service')
const jwtSecret = process.env.JWT_SECRET

const userService = new UsersService()

const postLogin = (req, res) => {
  const { email, password } = req.body
  if (email && password) {
    chekUserCredential(email, password)
      .then(data => {
        if (data) {
          console.log(data)
          const token = jwt.sign({
            user_name: data.user_name,
            id: data.id,
            role: data.role
          }, jwtSecret)
          userService.updateUser(data.id, {token:token})
          res.status(200).json({ message: 'Correct credentials', token })
        } else {
          console.log(data)
          res.status(401).json({ message: 'Email or password is incorrect' })
        }
      })
      .catch(err => {
        res.status(400).json({ message: err.message })
      })
  } else {
    res.status(400).json({ message: 'Missing data', fields: { email: 'example@example.com', password: 'string' } })
  }
}



module.exports = {
  postLogin
}