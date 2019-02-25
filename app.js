var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose= require("mongoose"); 
var flash = require("connect-flash");
var passport = require ("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require ("method-override");
var Campground =require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

//seedDB();

//requiring routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

//connect mongoose to database
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//remove need to add .ejs onto files
app.set("view engine", "ejs");


//seedDB(); //seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"Coding is great",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//whatever we put in res.locals is what's available in our tempalate
//this adds the currentUser to all templates
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//we can clean up code by adding /campgrounds to beginning of all links
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3001, 'localhost', function(){
    console.log("Server has started")
});
