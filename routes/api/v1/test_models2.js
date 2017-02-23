var express = require('express');
var async = require('async');
var router = express.Router();
var Model = require('../../../models');


Model.User.create({
	'nickname': 'testuser1'
});
