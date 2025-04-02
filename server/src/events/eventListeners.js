const eventEmitter = require('./eventEmitter');
const GameService = require('@services/GameService');
const ApiError = require('@errors/ApiError');
const {info} = require('@utils/logger');


eventEmitter.on('exp:update', async ({game, actionType}) => {
  console.log(`Update exp for userId ${game.userId}, actionType: ${actionType}`);
  await GameService.incrementExp(game, 'click');
});

eventEmitter.on('level:update', async ({game}) => {
  console.log(`Update level for userId ${game.userId}`);
  await GameService.incrementLevel(game);
});

eventEmitter.on('error',(err)=>{
  throw ApiError.eventError(500, 'Error during event emitting', err);
});

info('Event listeners initialized.');
