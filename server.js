var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    passport = require('passport'),
    config = require('./config/main'),
    User = require('./app/models/user'),
    jwt = require('jsonwebtoken'),
    app = express();

// Asign port number
app.set('port', process.env.PORT || 1337);

// Set up static content to be sent to the Client
app.use(express.static(__dirname + '/public'));

// use body-parser to get POST requests for API uppercase
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Log requests to console
app.use(morgan('dev'));

// Initialize passport for use
app.use(passport.initialize());

// Connect to db
mongoose.connect(config.database);

// Bring in passport strategy we just defined
require('./config/passport')(passport);

// Create API group routes
var apiRoutes = express.Router();

// Register new users
apiRoutes.post('/register', function(req, res){
    if (!req.body.email || !req.body.password){
        res.json({ success: false, message: 'Please enter an email and password to register.' });
    } else {
        var newUser = new User({
            email: req.body.email,
            password: req.body.password
        });

        // Atempt to save the new user
        newUser.save(function(err){
            if (err){
                return res.json({ success: false, message: 'That email address already exists.'});
            }
            res.json({ success: true, message: 'Successfully created new user.'});
        });
    }
});

// Authenticate the user and get a JWT
apiRoutes.post('/authenticate', function(req, res){
    User.findOne({
        email: req.body.email
    }, function(err, user){
        if (err) throw err;

        if (!user) {
            res.send({ success: false, message: 'Athentication failed.  User not found.' });
        } else {
            // Check if the password matches
            user.comparePassword(req.body.password, function(err, isMatch){
                if (isMatch && !err){
                    // Create the token
                    var token = jwt.sign(user, config.secret, {
                        expiresIn: 10080 // in seconds
                    });
                    res.json({ success: true, token: token });
                } else {
                    res.send({ success: false, message: 'Authentication failed.  Passwords did not match.' });
                }
            });
        }
    });
});

// Protect dashboard route with JWT
apiRoutes.get('/dashboard', passport.authenticate('jwt', { session: false }), function(req, res){
    res.send('It worked! User id is: ' + req.user._id + '.');
});

// Set url for API group routes
app.use('/api', apiRoutes);

app.listen(app.get('port'));
console.log('Your server is running on port ' + app.get('port') + '.');
