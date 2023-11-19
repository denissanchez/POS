import createError from "http-errors";


export function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        next(createError.Unauthorized())
    }
}
