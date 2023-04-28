const express = require('express');

const roomController = {}

roomController.getRooms = (req, res, next) => {
    res.locals.rooms = {
        room1: '',
        room2: '',
        room3: ''
    };
    return next();

}

module.exports = roomController