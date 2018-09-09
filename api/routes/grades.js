const express = require('express');
const router = express.Router();

const GradeSchema = require('../models/grades');
const StudentSchema = require('../models/students');
const ModuleSchema = require('../models/modules');

const mongoose = require('mongoose');

const baseUrl = 'http://localhost:3000';

function gradeToResp(doc) {
    const gradeData = {
        _id: doc._id,
        student_id: doc.student_id,
        module_id: doc.module_id,
        score: doc.score,
        request: {
            GET: {
                SINGLE: {
                    type: 'GET',
                    url: baseUrl + '/grades/' + doc._id
                },
                LIST: {
                    type: 'GET',
                    url: baseUrl + '/grades/'
                }
            },
            DELETE: {
                SINGLE: {
                    type: 'DELETE',
                    url: baseUrl + '/grades/' + doc._id
                }
            },
            PATCH: {
                SINGLE: {
                    type: 'PATCH',
                    url: baseUrl + '/grades/' + doc._id
                }
            },
            POST: {
                SINGLE: {
                    type: 'POST',
                    url: baseUrl + '/grades/'
                }
            }
        }
    }
    return gradeData;
}

router.get('/', (req, res, next) => {
    GradeSchema.find()
    .select('_id student_id module_id score')
    .populate('student_id', 'name attendance')
    .populate('module_id', 'name code')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            grades: docs.map(doc => {
                return {
                    _id: doc._id,
                    student_id: doc.student_id,
                    module_id: doc.module_id,
                    score: doc.score,
                    request: {
                        GET: {
                            SINGLE: {
                                type: 'GET',
                                url: baseUrl + '/grades/' + doc._id
                            },
                            LIST: {
                                type: 'GET',
                                url: baseUrl + '/grades/'
                            }
                        },
                        DELETE: {
                            SINGLE: {
                                type: 'DELETE',
                                url: baseUrl + '/grades/' + doc._id
                            }
                        },
                        PATCH: {
                            SINGLE: {
                                type: 'PATCH',
                                url: baseUrl + '/grades/' + doc._id
                            }
                        },
                        POST: {
                            SINGLE: {
                                type: 'POST',
                                url: baseUrl + '/grades/'
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
    StudentSchema.findById(req.body.studentId)
    .then(student => {
        if(!student) {
            return res.status(404).json({
                error: err
            })
        }
        ModuleSchema.findById(req.body.moduleId)
        .then(module => {
            if(!module) {
                return res.status(404).json({
                    error: err
                })
            }
            const grade = new GradeSchema({
                _id: new mongoose.Types.ObjectId(),
                score: req.body.score,
                module_id: req.body.moduleId,
                student_id: req.body.studentId
            });
            return grade.save();
        })
        .then(doc => {
            res.status(201).json(
                gradeToResp(doc)
            )
        });
    })
    .catch(err => {
        error: err
    });
});

router.get('/:id', (req, res, next) => {
    GradeSchema.findById(req.params.id)
    .exec()
    .then(doc => {
        if(doc) {
            const response = gradeToResp(doc);
            res.status(200).json({
                response
            });
        } else {
            res.status(404).json({message: 'Invalid Grade Id'});
        }
        
    })
    .catch(error => {
        res.status(500).json({error: err});
    });
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    GradeSchema.remove({ _id: id })
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
    GradeSchema.update({ _id : id }, { $set: updateOps })
    .exec()
    .then(result => {
        result._id = id;
        const response = gradeToResp(result);
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