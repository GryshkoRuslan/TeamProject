const passport = require('./passport');
const Roles = require('./acl').Roles;

module.exports = function(req, res, next) {
    passport.authenticate('bearer', { session: false },
        (err, user, trace) => {
            req.user = user || {role: Roles.GUEST};
            next()
        })(req, res, next)
};
