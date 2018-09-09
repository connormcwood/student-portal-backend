const express = require('express');
const router = express.Router();

const ModuleSchema = require('../models/modules');
const mongoose = require('mongoose');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});


const upload = multer({
    storage: storage
});

const baseUrl = 'http://localhost:3000';

function moduleToResp(doc) {
    const moduleData = {
        _id: doc._id,
        name: doc.name,
        code: doc.code,
        moduleImage: doc.moduleImage,
        request: {
            GET: {
                SINGLE: {
                    type: 'GET',
                    url: baseUrl + '/modules/' + doc._id
                },
                LIST: {
                    type: 'GET',
                    url: baseUrl + '/modules/'
                }
            },
            DELETE: {
                SINGLE: {
                    type: 'DELETE',
                    url: baseUrl + '/modules/' + doc._id
                }
            },
            PATCH: {
                SINGLE: {
                    type: 'PATCH',
                    url: baseUrl + '/modules/' + doc._id
                }
            },
            POST: {
                SINGLE: {
                    type: 'POST',
                    url: baseUrl + '/modules/'
                }
            }
        }
    }
    return moduleData;
}

router.get('/', (req, res, next) => {
    ModuleSchema.find()
    .select('_id name code moduleImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            modules: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    code: doc.code,
                    moduleImage: doc.moduleImage,
                    request: {
                        GET: {
                            SINGLE: {
                                type: 'GET',
                                url: baseUrl + '/modules/' + doc._id
                            },
                            LIST: {
                                type: 'GET',
                                url: baseUrl + '/modules/'
                            }
                        },
                        DELETE: {
                            SINGLE: {
                                type: 'DELETE',
                                url: baseUrl + '/modules/' + doc._id
                            }
                        },
                        PATCH: {
                            SINGLE: {
                                type: 'PATCH',
                                url: baseUrl + '/modules/' + doc._id
                            }
                        },
                        POST: {
                            SINGLE: {
                                type: 'POST',
                                url: baseUrl + '/modules/'
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

router.post('/', upload.single('moduleImage'),(req, res, next) => {
    const module = new ModuleSchema({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        code: req.body.code,
        score: req.body.score,
        moduleImage: req.file.path
    });
    module.save()
    .then(result => {
        const response = moduleToResp(result);
        res.status(201).json({
            response
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

router.get('/:id', (req, res, next) => {
    ModuleSchema.findById(req.params.id)
    .exec()
    .then(doc => {
        if(doc) {
            const response = moduleToResp(doc);
            res.status(200).json({
                response
            });
        } else {
            res.status(404).json({message: 'Invalid Module Id'});
        }
        
    })
    .catch(error => {
        res.status(500).json({error: err});
    });
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    ModuleSchema.remove({ _id: id })
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
    ModuleSchema.update({ _id : id }, { $set: updateOps })
    .exec()
    .then(result => {
        result._id = id;
        const response = moduleToResp(result);
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