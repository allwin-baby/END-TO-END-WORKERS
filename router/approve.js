const router = require('express').Router();
const { Login } = require('../models/registration');

router.get('/sp/',  (req, res) => {
    const id = req.query.id;
    Login.findByIdAndUpdate(id, { approved: 'true' }, {}, function(err,doc){
        if(err){
            res.status(500).send({ message: "Cannot update"})
        }
        res.redirect('/admin/sp/')
    }) 
})
router.get('/delete/sp/',(req, res)=>{
    const id = req.query.id;
    Login.findByIdAndUpdate(id, { approved: 'false' }, {}, function(err,doc){
        if(err){
            res.status(500).send({ message: "Cannot update"})
        }
        res.redirect('/admin/sp')
    }) 
})

router.get('/emp/',  (req, res) => {
    const id = req.query.id;
    console.log(id)
    Login.findByIdAndUpdate(id, { approved: 'true' }, {}, function(err,doc){
        if(err){
            res.status(500).send({ message: "Cannot update"})
        }
        res.redirect('/admin/emp')
    }) 
})
router.get('/delete/emp/',(req, res)=>{
    const id = req.query.id;

    Login.findByIdAndUpdate(id, { approved: 'false' }, {}, function(err,doc){
        if(err){
            res.status(500).send({ message: "Cannot update"})
        }
        res.redirect('/admin/emp')
    }) 
})

//////
router.get('/cust/',  (req, res) => {
    const id = req.query.id;

    Login.findByIdAndUpdate(id, { approved: 'true' }, {}, function(err,doc){
        if(err){
            res.status(500).send({ message: "Cannot update"})
        }
        res.redirect('/admin/customer')
    }) 
})
router.get('/delete/cust/',(req, res)=>{
    const id = req.query.id;
    Login.findByIdAndUpdate(id, { approved: 'false' }, {}, function(err,doc){
        if(err){
            res.status(500).send({ message: "Cannot update"})
        }
        res.redirect('/admin/customer')
    }) 
})

module.exports = router;