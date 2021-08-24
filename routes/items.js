const express = require('express')
const router = new express.Router()
const ExpressError = require('../expressError')
const items = require('../fakeDb')

router.get('/', (req, res) => {
  res.json({items})
})

router.post('/', (req, res, next) => {
  try {
    if (!req.body.name || !req.body.price) throw new ExpressError('Must include name and price', 400)
    const newItem = {
      name: req.body.name,
      price: req.body.price,
    }
    items.push(newItem)
    res.status(201).json({item: newItem})
  } catch(err) {
    next(err)
  }
})

router.get('/:name', (req, res) => {
  const foundItem = items.find(item => item.name === req.params.name)
  if (foundItem === undefined) {
      throw new ExpressError("Item not found", 404)
  }
  res.json({item: foundItem})
})

router.patch('/:name', (req, res) => {
  const foundItem = items.find(item => item.name === req.params.name)
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404)
  } else if (!req.body.name && !req.body.price) {
    throw new ExpressError('You can change either the name or the price', 400)
  }
  if (req.body.name) {
    foundItem.name = req.body.name
  }
  if (req.body.price) {
    console.log(req.body.price)
    foundItem.price = req.body.price
    console.log(foundItem.price)
  } 
  res.json({updated: foundItem})
})

router.delete('/:name', (req, res) => {
  const foundItem = items.find(item => item.name === req.params.name)
  if (foundItem === undefined) {
      throw new ExpressError('Cat not found', 404)
  }
  items.splice(foundItem, 1)
  res.json({ msg: 'Deleted' })
})

module.exports = router