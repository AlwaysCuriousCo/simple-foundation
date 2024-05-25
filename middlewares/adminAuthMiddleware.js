module.exports = (req, res, next) => {
    // Assuming you have a way to check if a user is an admin
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).send('Access denied.');
    }
  };
  