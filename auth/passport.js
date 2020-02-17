const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const uuidv4 = require('uuid/v4');
const User = require('../models/users');

passport.use(new LocalStrategy(
    async function(username, password, done) {
        const UserModel = new User();
        const user = await UserModel.getUserByCredentials(username, password);

        if(!user) {
            return done('User not found', false);
        }
        user.token = uuidv4();
        await UserModel.store(user);
        return done (null, user)
    }
));

passport.use(new BearerStrategy(
    async function(token, done) {
        const UserModel = new User();
        const user = await UserModel.getUserByToken(token);

        if(!user) {
            // return error
            return done(null)
        }

        return done(null, user)
    }
));

module.exports = passport;


