const express = require('express')
const app = express()
const itemsRoutes = require('./routes/items')
const ExpressError = require('./expressError')

app.use(express.json())
app.use('/items', itemsRoutes)

// 404 handler
app.use((req, res, next) => {
  return new ExpressError('Not found', 404)
})
  
  // generic error handler
app.use((err, req, res, next) => {
  let status = err.status || 500
  let msg = err.msg
  
  return res.status(status).json({
    error: {msg, status}
  })
})
  
module.exports = app