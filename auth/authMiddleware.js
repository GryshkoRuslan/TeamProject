const passport = require('./passport');

module.exports = function(req, res, next) {
    passport.authenticate('bearer', { session: false },
        (err, user, trace) => {
            req.user = user || null;
            next()
        })(req, res, next)
};
