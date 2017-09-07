var express = require('express');
var router = express.Router();

const request = require('request-promise')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/followers/:user', function (req, res, next) {
  var user = req.params.user;
  if (!user) {
    res.send({ error: 'Enter a valid github id.' })
  }
  const options = {
    method: 'GET',
    uri: 'https://api.github.com/users/' + user + '/followers',
    headers: {
      'User-Agent': 'request'
    },
    qs: {
      per_page: 5
    }
  }
  request(options)
    .then(function (response) {
      debugger;
      res.send(response);
    })
    .catch(function (response) {
      debugger;
      res.send(response);
    })
})

module.exports = router;
