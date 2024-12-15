// backend/routes/api/index.js
const express = require('express');
const { restoreUser } = require("../../utils/auth.js");
const { User } = require('../../db/models');
const router = require('express').Router();
// ...



router.use(restoreUser);

// ...
module.exports = router;

