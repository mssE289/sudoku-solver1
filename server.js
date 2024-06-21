require('dotenv').config();
const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');

const fccTestingRoutes  = require('./routes/fcctesting.js');
const apiRoutes         = require('./routes/api.js');
const runner            = require('./test-runner');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

// User routes
apiRoutes(app);
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
  console.log("Listening on port " + PORT);
  // process.env.NODE_ENV='test'
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

app.post('/api/check', (req, res) => {
  const { puzzle, coordinate, value } = req.body;

  if (!puzzle || !coordinate || !value) {
    return res.json({ error: 'Required field(s) missing' });
  }

  if (puzzle.length !== 81) {
    return res.json({ error: 'Expected puzzle to be 81 characters long' });
  }

  if (/[^1-9.]/.test(puzzle)) {
    return res.json({ error: 'Invalid characters in puzzle' });
  }

  const coordRegex = /^[A-I][1-9]$/;
  if (!coordRegex.test(coordinate)) {
    return res.json({ error: 'Invalid coordinate' });
  }

  if (!/^[1-9]$/.test(value)) {
    return res.json({ error: 'Invalid value' });
  }

  const row = coordinate[0].charCodeAt(0) - 'A'.charCodeAt(0);
  const col = parseInt(coordinate[1]) - 1;

  const conflicts = [];
  if (!solver.checkRowPlacement(puzzle, row, col, value)) conflicts.push('row');
  if (!solver.checkColPlacement(puzzle, row, col, value)) conflicts.push('column');
  if (!solver.checkRegionPlacement(puzzle, row, col, value)) conflicts.push('region');

  if (conflicts.length === 0) {
    return res.json({ valid: true });
  }

  res.json({ valid: false, conflict: conflicts });
});

module.exports = app; // for testing
