const logger = require('@utils/logger');
const ApiError = require('@errors/ApiError');
const { Types } = require('mongoose');
const GameRepository = require('@repository/GameRepository');
const ItemRepository = require('@repository/ItemRepository');
const TransactionRepository = require('@repository/TransactionRepository');
const PlanetRepository = require('@repository/PlanetRepository');
const ExperienceService = require('@services/ExperienceService')


class GameService  {

  static async incrementCoinsByClick(userId, amount) {
    try {
      logger.info("GameService::incrementCoins")
      // Find total game coins
      let game = await GameRepository.findByUserId(userId);
      // Update coins
      this.addCoins(game, amount);
      // Update exp
      this.incrementExp(game, 'click');
      // Update level
      this.incrementLevel(game);
      await game.save();

      return game;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.databaseError(500, `Error increment coins for user with userId: ${userId}`, err);
      }
    }
  }


  static incrementExp(game, actionType) {
    logger.info(`GameService::incrementExp actionType: ${actionType}`)
    // Определяем количество опыта в зависимости от действия
    const amount = game.calculateExpGain(actionType);
    return GameService.addExp(game, amount);
  }


  static incrementLevel(game) {
    logger.info("GameService::tryIncrementLevel")
    let updatedGame = game; // Хранит обновленный объект

    while (updatedGame.exp >= ExperienceService.getRequiredExp(updatedGame.level)) {
      logger.info('Can increment level')
      const requiredExp = ExperienceService.getRequiredExp(updatedGame.level);
      // Вычитаем опыт и увеличиваем уровень
      logger.info(`New Level: ${updatedGame.level}! Exp left: ${updatedGame.exp}`);
      updatedGame = GameService.addLevel(updatedGame, 1, requiredExp)
    }
    return updatedGame;
  }


  static addCoins(game, amount=0, multiplier=1) {
    const totalIncome = game.calculateTotalIncome() * multiplier + amount ;
    logger.info(`Coins to add: ${totalIncome}`);
    return game.coins += totalIncome + 1;
  }


  static addExp(game, amount) {
    return game.exp += amount;
  }


  static addLevel(game, level=1, expToSubtract) {
    game.level += level;
    game.exp -= expToSubtract;
    return game;
  }


  static async processPurchaseItem(userId, itemId) {
    logger.info("GameService::processPurchaseItem")

    let game = await GameRepository.findByUserId(userId);
    const dbItem = await ItemRepository.findById(itemId);

    // Пытаемся найти предмет в массиве item пользователя
    let existingItem = game.items.find(item => new Types.ObjectId(item.itemId).toString() === new Types.ObjectId(itemId).toString());

    try {
      if (!existingItem) {
        // Если нету такого предмета, то покупаем
        logger.info("Items isn't exists in user items")
        game = await this.buyItem(game, dbItem);
        // Increment Exp event
        eventEmitter.emit('exp:update', { game, actionType: 'purchaseItem' });
      } else {
        // Если объект есть, то обновляем
        logger.info("Item exists. Update")
        game = await this.upgradeItem(game, existingItem, dbItem);
        // Increment Exp event
        eventEmitter.emit('exp:update', { game, actionType: 'updateItem' });
      }

      // Update exp
      this.incrementExp(game, 'click');
      // Update level
      this.incrementLevel(game);
      await game.save();

      logger.info("Transaction successful!");
      return game
    } catch (err) {
      throw ApiError.transactionError('Error during processTransaction', err)
    }
  }


  static async upgradeItem(game, existingItem, dbItem) {
    try {
      logger.info("GameService::upgradeItem")

      // Списываем коины
      if (game.coins < existingItem.upgradePrice) {
        throw ApiError.userError(400, 'You have not enough coins!');
      }
      game.coins -= existingItem.upgradePrice;

      // Логика upgrade
      existingItem.level += 1;
      existingItem.upgradePrice = Math.round(existingItem.upgradePrice * dbItem.priceMultiplier);
      existingItem.income = Math.round(existingItem.income * dbItem.incomeMultiplier);

      const transactionDto = {
        userId: game.userId,
        objectId: dbItem._id,
        type: 'item',
        cost: -existingItem.upgradePrice,
        balance: game.coins
      }

      await TransactionRepository.create(transactionDto);
      await game.save();

      logger.info("Item upgrade successfully");
      return game;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.internalError(`Error upgrade item with id: ${dbItem._id}`, err);
      }
    }
  }


  static async buyItem(game, dbItem) {
    try{
      logger.info("GameService::buyItem")

      // Списываем коины
      if (game.coins < dbItem.basePrice) {
        throw ApiError.userError(400, 'You have not enough coins!');
      }
      game.coins -= dbItem.basePrice;
      const itemDto = {
        itemId: dbItem._id,
        level: 1,
        upgradePrice: dbItem.basePrice * dbItem.priceMultiplier,
        income: dbItem.baseIncome
      }
      game.items.push(itemDto);

      const transactionDto = {
        userId: game.userId,
        objectId: dbItem._id,
        type: 'item',
        cost: -dbItem.basePrice,
        balance: game.coins
      }
      await TransactionRepository.create(transactionDto);
      await game.save();

      logger.info("Item bought successfully");
      return game;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.internalError(`Error bought item with id: ${dbItem._id}`, err);
      }
    }
  }


  static async processPurchasePlanet(userId, planetId) {
    try {
      logger.info("GameService::processPurchasePlanet")

      const planets = await PlanetRepository.findAll();
      let game = await GameRepository.findByUserId(userId);
      const userPlanets = game.unlockedPlanets || [];

      const planetToBuy = planets.find(planet => planet._id.toString() === planetId.toString())
      if (!planetToBuy) {
        throw ApiError.databaseError(404, `Planet with id: ${planetId} not found.`);
      }

      // Если планета уже разблокированна пользователем
      let isPlanetExists = userPlanets.find(planet => new Types.ObjectId(planet.planetId).toString() === new Types.ObjectId(planetId).toString());
      if (isPlanetExists) {
        throw ApiError.databaseError(409, "Conflict: Planet already unlocked.");
      }

      // Проверяем, хватает ли уровня и денег
      if (game.level < planetToBuy.requiredLevel) {
        throw ApiError.databaseError(400, "Not enough level to unlock this planet");
      }
      if (game.coins < planetToBuy.unlockCost) {
        throw ApiError.databaseError(400, "Not enough coins to unlock this planet");
      }

      // Предыдущая планета должна быть куплена
      const prevPlanet = planets.find(p => p.index === planetToBuy.index - 1);
      const isPrevPlanetBought = prevPlanet ? userPlanets.some(p => new Types.ObjectId(p.planetId).toString() === new Types.ObjectId(prevPlanet._id).toString()) : true;
      if (!isPrevPlanetBought) {
        throw ApiError.databaseError(400, "Previous planet must be unlocked first");
      }

      game = await this.buyPlanet(game, planetToBuy);
      // Update exp
      this.incrementExp(game, 'click');
      // Update level
      this.incrementLevel(game);
      logger.info("Transaction successful!");

      await game.save();

      return game
    } catch (err) {
      throw ApiError.transactionError('Error during processTransaction', err)
    }
  }


  static async buyPlanet(game, dbPlanet) {
    try{
      logger.info("GameService::buyPlanet")

      game.coins -= dbPlanet.unlockCost;
      const planetDto = {
        planetId: dbPlanet._id,
      }
      game.unlockedPlanets.push(planetDto);
      game.currentPlanetIndex = dbPlanet.index + 1

      const transactionDto = {
        userId: game.userId,
        objectId: dbPlanet._id,
        type: 'planet',
        cost: -dbPlanet.unlockCost,
        balance: game.coins
      }
      await TransactionRepository.create(transactionDto);
      await game.save();

      logger.info("Planet bought successfully");
      return game;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.internalError(`Error bought planet with id: ${dbPlanet._id}`, err);
      }
    }
  }

  static async calculateAbsentReward(userId, amount) {
    logger.info("GameService::calculateAbsentReward")

    const game = await GameRepository.findByUserId(userId);
    const lastRewardedDate = new Date(game.lastRewarded);

    if (( new Date() - lastRewardedDate ) / 1000 < 5 * 60)
      // Throw error if 5 min have not passed
      throw ApiError.badRequest("It's not enough time past to click this button")

    // Calculate date total amount of user time absent
    const dateAbsent = Math.round((new Date() - new Date(game.lastRewarded)) / 1000);
    logger.info(`Absent in seconds: ${dateAbsent}`);

    this.addCoins(game, amount, dateAbsent);
    game.lastRewarded = new Date();
    // Update exp
    this.incrementExp(game, 'click-absent');
    // Update level
    this.incrementLevel(game);
    await game.save();

    return game;
  }
}

module.exports = GameService;