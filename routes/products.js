const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.send('Products page');
  });

router.post('/', (req, res, next) => {
  res.send('respond with a resource')
})

router.put('/:id', (req, res, next) => {
   res.send(`Product number of ${req.params.id}`)
});


module.exports = router;