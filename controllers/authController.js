const passport = require('../auth/passport');

class authController {
    static login (req, res) {
        passport.authenticate('local', { session: false }, (err, user) => {
            if(err) {
                throw new Error(err)
            }
            res.send(user)
        })(req, res)
    }

    static logout (req, res) {

    }

    static register (req, res) {

    }
}
module.exports = authController;
