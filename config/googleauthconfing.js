var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const {userModel}=require("../models/user")
const passport=require("passport");

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
   try{
    let user=await userModel.findOne({email:profile.emails[0].value});
    if(!user){
      user= new userModel({
        name:profile.displayName,
        email:profile.emails[0].value,
      });
      await user.save();
   
    }
    done(null,user)
   
    }
    catch(err){
      done(err,false);
    }
  
  
  }));
  passport.serializeUser(function(user,done){
    return done(null,user._id);
  });
  //ye upar wala id add krega session mei
  //ye id ka data lata neeche wala
  passport.deserializeUser(async function(id,done){
   let user= await userModel.findOne({_id:id});
    done(null,id);//attach id to every session

  });
  module.exports=passport;