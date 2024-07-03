const User = require('../model/User');

const handleLogout = async (req, res) => {
  // localStorage.removeItem('accessToken'); // ? - Deleting the access token from the Client Side

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  try {
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      res.clearCookie('jwt', { httpOnly: true });
      return res.sendStatus(204);
    }

    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(`Successfully logged out: ${foundUser.username}`);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
    res.sendStatus(204);
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

module.exports = { handleLogout }