import createError from "http-errors";


export function isAuthenticated(req, res, next) {
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
        next();
    } else {
        next(createError.BadRequest())
    }
}
