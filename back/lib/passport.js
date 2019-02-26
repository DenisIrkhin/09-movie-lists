const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const config = require('../config/param')

// Another way to bring User model
const User = require('../models/User')

const opts = {}
// Format should be
// key = Authorization
// value = Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzczMGE0OTA0Y2YxMTAyMDNlMWVjODIiLCJlbWFpbCI6ImRlbjNAZ21haWwuY29tIiwiYXZhdGFyIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvYTVmOTI5YjZjZjk1N2FkNjdkNzA1NzczZTc2YzI3MmI_cz0yMDAmcj1wZyZkPWlkZW50aWNvbiIsImlhdCI6MTU1MTA0OTI3MCwiZXhwIjoxNTUxMTc4ODcwfQ.WzDgO6mED1OZ4gO70wgw86cPo1h0HJVijNEMkLwsBeg
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()

// opts.jwtFromRequest = ExtractJwt.fromHeader('Authorization') //does NOT work

// Format should be
// {
// "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzczMGE0OTA0Y2YxMTAyMDNlMWVjODIiLCJlbWFpbCI6ImRlbjNAZ21haWwuY29tIiwiYXZhdGFyIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvYTVmOTI5YjZjZjk1N2FkNjdkNzA1NzczZTc2YzI3MmI_cz0yMDAmcj1wZyZkPWlkZW50aWNvbiIsImlhdCI6MTU1MTA0OTI3MCwiZXhwIjoxNTUxMTc4ODcwfQ.WzDgO6mED1OZ4gO70wgw86cPo1h0HJVijNEMkLwsBeg"
// }
opts.jwtFromRequest = ExtractJwt.fromBodyField('jwtToken')

// TODO:
// const cookieExtractor = function(req) {
//   var token = null;
//   if (req && req.cookies)
//   {
//       token = req.cookies['__sid__'];
//   }
//   return token;
// }
// opts.jwtFromRequest = ExtractJwt.cookieExtractor()

opts.secretOrKey = config.JWT_SECRET

module.exports = passport => {
  // let aaa = opts.jwtFromRequest()
  // console.log('aaa', aaa)
  console.log('from passport funcs')
  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      console.log('jwtPayload ', jwtPayload)

      // Find user by userId extracted from JWT
      try {
        const user = await (User.findById(jwtPayload.userId))
        if (user) {
          return done(null, user)
        }
        return done(null, false)
      } catch (error) {
        console.log(error)
      }
    }
    ))
}
