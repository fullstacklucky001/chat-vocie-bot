const login = async (req, res) => {
  let { username, password } = req.body;

  if (username !== global.env.USERNAME) {
    res.status(200).send('username')
    return
  }

  if (password !== global.env.PASSWORD) {
    res.status(200).send('password')
    return
  }

  if (username === global.env.USERNAME && password === global.env.PASSWORD) {
    res.status(200).send('success')
    return
  }
}

module.exports = {
  login
}