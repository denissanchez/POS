export function isAuthorized(permission) {
  return (req, res, next) => {
      const { user } = req

      if (user && Array.isArray(user.permissions) && user.permissions.includes(permission)) {
        next()
      } else {
          res.status(401).json({ message: 'Unauthorized', status: 401 })
      }
  }
}
