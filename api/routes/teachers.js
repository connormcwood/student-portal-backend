const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling get requests'
    });
});

router.post('/', (req, res, next) => {
    const students = {
        name: req.body.name,
        attendance: req.body.attendance,
    };
    res.status(201).json({
        message: 'Handling post requests',
        student: students
    });
});

router.get('/:teacherId', (req, res, next) => {
    const id = req.params.teacherId;
    res.status(200).json({
        message: 'Get Requested ID',
    });
});

router.post('/:teacherId', (req, res, next) => {
    const id = req.params.teacherId;
    res.status(201).json({
        message: 'Post Requested ID',
    });
});

router.patch('/:id', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message: 'Patched Requested ID',
    });
});

module.exports = router;