const eventEmitter = require('./eventEmitter');
const GameService = require('@services/GameService');
const ApiError = require('@errors/ApiError');
const logger = require('@utils/logger');


eventEmitter.on('exp:update', async ({game, actionType}) => {
  logger.info(`Update exp for userId ${game.userId}, actionType: ${actionType}`);
  await GameService.incrementExp(game, actionType);
});

eventEmitter.on('level:update', async ({game}) => {
  logger.info(`Update level for userId ${game.userId}`);
  await GameService.incrementLevel(game);
});

eventEmitter.on('error',(err)=>{
  throw ApiError.eventError(500, 'Error during event emitting', err);
});

logger.info('Event listeners initialized.');
