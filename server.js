var express = require("express");
var nunjucks = require('nunjucks');
var exphbs = require('express-handlebars');
var Handlebars = require('handlebars'); // For Register Custom Helper
var paginate = require('handlebars-paginate');
var HandlebarsIntl = require('handlebars-intl');
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var expressValidator = require("express-validator");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;
var mongoDBConnect = require("./db").mongooseConnect;
var cors = require('cors');


// Initializing the App 
var app = express();
app.use(cors({origin:["http://localhost:4200"],credentials: true}));
// Setting up the Nunjucks Template Engines 
// nunjucks.configure("views",{
// 	autoescape : true,
// 	express:app,
// 	noCache : true
// });

// const hbs = exphbs.create({
//     // Specify helpers which are only registered on this instance.
//     helpers: {
//         if_equal: function(a, b, opts) {
//             if (a == b) {
//                 return opts.fn(this)
//             } else {
//                 return opts.inverse(this)
//             }
//         }

//     }
// });
HandlebarsIntl.registerWith(Handlebars);
Handlebars.registerHelper('paginate', paginate);
Handlebars.registerHelper('if_equal', function (a, b, opts) {
	if (a == b) {
		return opts.fn(this)
	} else {
		return opts.inverse(this)
	}
});

Handlebars.registerHelper('iff', function (a, operator, b, opts) {
	var bool = false;
	switch (operator) {
		case '==':
			bool = a == b;
			break;
		case '>':
			bool = a > b;
			break;
		case '<':
			bool = a < b;
			break;
		default:
			throw "Unknown operator " + operator;
	}

	if (bool) {
		return opts.fn(this);
	} else {
		return opts.inverse(this);
	}
});

Handlebars.registerHelper('if_not_equal', function (a, b, opts) {
	if (a != b) {
		return opts.fn(this)
	} else {
		return opts.inverse(this)
	}
});

 


Handlebars.registerHelper('join', function (val, delimiter, start, end) {
	var arry = [].concat(val);
	delimiter = (typeof delimiter == "string" ? delimiter : ',');
	start = start || 0;
	end = (end === undefined ? arry.length : end);
	return arry.slice(start, end).join(delimiter);
});

Handlebars.registerHelper('var', function (name, value, context) {
	this[name] = value;
});

app.set("views", path.join(__dirname, "views"));
app.set("images", path.join(__dirname, "public/images/"));

app.engine("handlebars", exphbs({
	defaultLayout: "layouts", layoutsDir: __dirname + '/views/layouts/',
	partialsDir: __dirname + '/views/partials/'
}));
app.set("view engine", "handlebars");

// Database Connection
mongoDBConnect();

// App Routes
var mountApiRoutes = require("./modules").mountApiRoutes;

// BodyParse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator({
	errorFormatter: function (param, msg, value) {
		var namespace = param.split(".")
			, root = namespace.shift()
			, formparam = root;
		while (namespace.length) {
			formparam += "[" + namespace.shift() + "]";
		}
		return {
			param: formparam,
			msg: msg,
			value: value
		};
	}
}));
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));


app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true,
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash Message
app.use(flash());

app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

// app.get("/", (req, res)=>{
// 	res.send("hi")
// });

mountApiRoutes(app);
var port = process.env.PORT || 3000;
app.listen(port, () => {
	// console.log(path.join(__dirname, "public"));
	// console.log(__dirname);
	// console.log(__filename);
	console.log("Server is Running on Port 3000");
})
