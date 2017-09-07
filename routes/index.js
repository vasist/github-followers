var express = require('express');
var router = express.Router();

const request = require('request-promise');
const _ = require('lodash');
const async = require('async');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/followers/:user', function (req, res, next) {
  let user = req.params.user;
  async.auto({
    followers: function (callback) {
      getFollowers(user).then(function (result) {
        callback(null, result);
      }, function (err) {
        callback(err);
      })
    },
    getFollowersSecondLevel: ['followers', function (result, callback) {
      var actions = result.followers.map(getFollowers); 
      Promise.all(actions)
        .then(function (result) {
          res.send(result);
          callback(null, result);
        }, function (err) {
          callback(err);
        })
    }],
    getFollowersThirdLevel: ['getFollowersSecondLevel', function (result, callback) {
      callback(null, result)
    }]
  }, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(JSON.parse(result));
    }
  })
})

function getFollowers(username) {
  const options = {
    method: 'GET',
    uri: 'https://api.github.com/users/' + username + '/followers',
    headers: {
      'User-Agent': 'request'
    },
    qs: {
      per_page: 5
    }
  }
  return new Promise((resolve, reject) => {
    request(options)
      .then(function (response) {
        let followers = _.map(JSON.parse(response), 'login');
        resolve(followers);
      })
      .catch(function (response) {
        reject(response);
      })
  })
}

module.exports = router;
