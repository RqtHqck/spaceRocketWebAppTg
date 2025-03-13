const app = require('./app')
const port = process.env.LOCAL_PORT 
const logger = require('./utils/logger')


app.listen(port, () => {
  logger.info(`Server started on http://localhost:${port}`)
})