const app = require('./app')
const logger = require('./utils/logger')

app.listen(process.env.DOCKER_PORT, () => {
  logger.info(`Server started on docker port http://localhost:${process.env.DOCKER_PORT}. \nIt's available from http://localhost:${process.env.LOCAL_PORT}`)
})