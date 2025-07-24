const os = require('os')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const express = require('express')
const userRoute = require('./routes/userRoute')
const supplierRoute = require('./routes/supplierRoute')
const shipmentRoute = require('./routes/shipmentRoute')
const productRoute = require('./routes/productRoute')
const billRoute = require('./routes/billRoute')


const app = express()

// Middleware to parse JSON request bodies
app.use(express.json())

// Middleware to parse URL-encoded request bodies (optional, for form submissions)
app.use(express.urlencoded({ extended: true }))

app.use('/api/user', userRoute)
app.use('/api/supplier', supplierRoute)
app.use('/api/shipment', shipmentRoute)
app.use('/api/product', productRoute)
app.use('/api/bill', billRoute)

const port = process.env.PORT || 3000

const interfaces = os.networkInterfaces()
var address
for (const name in interfaces) {
  for (const iface of interfaces[name]) {
    if (iface.family === 'IPv4' && !iface.internal) {
      address = iface.address
      break
    }
  }
}
app.listen(port, () => {
  console.log(`server started at: http://${address}:${port}`)
})
