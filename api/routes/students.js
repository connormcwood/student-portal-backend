const express = require('express');
const router = express.Router();
const StudentSchema = require('../models/students');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const baseUrl = 'http://localhost:3000';

function studentToResp(doc) {
    const studentData = {
        _id: doc._id,
        name: doc.name,
        username: doc.username,
        attendance: doc.attendance,
        request: {
            GET: {
                SINGLE: {
                    type: 'GET',
                    url: baseUrl + '/students/' + doc._id
                },
                LIST: {
                    type: 'GET',
                    url: baseUrl + '/students/'
                }
            },
            DELETE: {
                SINGLE: {
                    type: 'DELETE',
                    url: baseUrl + '/students/' + doc._id
                }
            },
            PATCH: {
                SINGLE: {
                    type: 'PATCH',
                    url: baseUrl + '/students/' + doc._id
                }
            },
            POST: {
                SINGLE: {
                    type: 'POST',
                    url: baseUrl + '/students/'
                }
            }
        }
    }
    return studentData;
}

router.get('/', (req, res, next) => {
    StudentSchema.find()
    .select('_id name attendance username')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    username: doc.username,
                    attendance: doc.attendance,
                    request: {
                        GET: {
                            SINGLE: {
                                type: 'GET',
                                url: baseUrl + '/students/' + doc._id
                            },
                            LIST: {
                                type: 'GET',
                                url: baseUrl + '/students/'
                            }
                        },
                        DELETE: {
                            SINGLE: {
                                type: 'DELETE',
                                url: baseUrl + '/students/' + doc._id
                            }
                        },
                        PATCH: {
                            SINGLE: {
                                type: 'PATCH',
                                url: baseUrl + '/students/' + doc._id
                            }
                        },
                        POST: {
                            SINGLE: {
                                type: 'POST',
                                url: baseUrl + '/students/'
                            }
                        }
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    StudentSchema.find({ username: req.body.username })
    .exec()
    .then(user => {
        if(user.length >= 1) {
            return res.status(409).json({
                message: 'Email already registered'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json(err => {
                        error: err
                    });
                } else {
                    const student = new StudentSchema({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        username: req.body.username,
                        password: hash,
                        attendance: req.body.attendance
                    });     
                    student.save().then(result => {
                        const response = studentToResp(result);
                        res.status(201).json({
                            response
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    });                   
                }
            });
        }
    })
    .catch();       
});

router.post('/login', (req, res, next) => {
    console.log(req);
    StudentSchema.find({ username: req.body.username })
    .exec()
    .then(user => {
        if(user.length < 1) {
            return res.status(403).json({
                message: 'Auth Failed'
            });
        } else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err) {
                    return res.status(403).json({
                        error: err
                    });
                }
                if(result) {
                    const token = jwt.sign({
                        username: user[0].username,
                        userId: user[0]._id
                    }, 
                    'secret', 
                    {
                        expiresIn: "1h"
                    });
                    return res.status(200).json({
                        message: 'Auth Succesful',
                        token: token
                    });
                } else {
                    return res.status(403).json({
                        error: err
                    });
                }
            });
        }
    })
    .catch(err => {
        return res.status(403).json({
            message: 'Reached',
            error: err
        });
    });
});

router.get('/:id', (req, res, next) => {
    StudentSchema.findById(req.params.id)
    .exec()
    .then(doc => {
        if(doc) {
            const response = studentToResp(doc);
            res.status(200).json({
                response
            });
        } else {
            res.status(404).json({message: 'Invalid Student Id'});
        }
        
    })
    .catch(error => {
        res.status(500).json({error: err});
    });
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    StudentSchema.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        res.status(404).json({
            error: err
        });
    });
});

router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    StudentSchema.update({ _id : id }, { $set: updateOps })
    .exec()
    .then(result => {
        result._id = id;
        const response = studentToResp(result);
        res.status(201).json({
            response
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;