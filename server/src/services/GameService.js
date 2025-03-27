const logger = require('@utils/logger');
const ApiError = require('@errors/ApiError');
const {Types} = require('mongoose');
const GameRepository = require('@repository/GameRepository');
const ItemRepository = require('@repository/ItemRepository');
const TransactionRepository = require('@repository/TransactionRepository');
const PlanetRepository = require('@repository/PlanetRepository');


class GameService {

  static async incrementCoins(userId, amount) {
    try {
      logger.info("GameService::incrementCoins")
      // Find total game coins
      const game = await GameRepository.findByUserId(userId);
      const totalIncome = game.calculateTotalIncome() + (amount || 0);
      // Update coins
      const updatedGame = await GameRepository.addCoins(userId, totalIncome);
      // Add exp
      await this.incrementExp(userId, 'click');

      return updatedGame
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.databaseError(500, `Error increment coins for user with userId: ${userId}`, err);
      }
    }
  }


  static getClickExp(userLevel, baseExp = 5, multiplier = 1.1) {
    return baseExp + ((userLevel !== 0 ? userLevel * multiplier : userLevel));
  }


  static getUpdateItemExp(userLevel, baseExp = 5, multiplier = 1.3) {
    return baseExp + (userLevel * multiplier);
  }


  static getPurchaseItemExp(userLevel, baseExp = 5, multiplier = 1.5) {
    return baseExp + (userLevel * multiplier);
  }


  static getPlanetUnlockingExp(userLevel, baseExp = 5, multiplier = 1.7) {
    return baseExp + (userLevel * multiplier);
  }


  static async incrementExp(userId, actionType) {
    // Получаем текущие данные пользователя
    const game = await GameRepository.findByUserId(userId);
    if (!game) {
      throw new Error("User game data not found");
    }

    // Определяем количество опыта в зависимости от действия
    let amount;
    const userLevel = game.level; // Предполагаем, что уровень хранится здесь
    switch (actionType) {
      case "updateItem":
        amount = this.getUpdateItemExp(userLevel);
        break;
      case "unlockPlanet":
        amount = this.getPlanetUnlockingExp(userLevel);
        break;
      case "purchaseItem":
        amount = this.getPurchaseItemExp(userLevel);
        break;
      case "click":
        amount = this.getClickExp(userLevel);
        break;
      default:
        throw new Error("Invalid action type");
    }

    // Начисляем опыт и обновляем уровень
    const updatedGame = await GameRepository.addExp(userId, amount);
    await this.updateLevel(updatedGame);
    return updatedGame;
  }


  static getRequiredExp(level) {
    const baseExp = 1000; // Базовое количество опыта для первого уровня
    const expMultiplier = 1.5; // Множитель для увеличения опыта
    return Math.floor(baseExp * Math.pow(expMultiplier, level - 1)); // Експоненциальный рост
  }


  static async updateLevel(playerGame) {
    let updatedGame = playerGame; // Хранит обновленный объект

    while (updatedGame.exp >= this.getRequiredExp(updatedGame.level)) {
      const requiredExp = this.getRequiredExp(updatedGame.level);

      // Вычитаем опыт и увеличиваем уровень
      updatedGame = await GameRepository.addLevel(updatedGame.userId, 1, requiredExp)

      console.log(`Новый уровень: ${updatedGame.level}! Осталось опыта: ${updatedGame.exp}`);
    }
  }


  static async processPurchaseItem(userId, itemId) {
    logger.info("GameService::processPurchaseItem")

    const game = await GameRepository.findByUserId(userId);
    const dbItem = await ItemRepository.findById(itemId);

    // Пытаемся найти предмет в массиве item пользователя
    let existingItem = game.items.find(item => new Types.ObjectId(item.itemId).toString() === new Types.ObjectId(itemId).toString());

    try {
      let res;
      if (!existingItem) {
        // Если нету такого предмета, то покупаем
        logger.info("Items isn't exists in user items")
        res = await this.buyItem(game, dbItem);
        await this.incrementExp(userId, 'purchaseItem');
      } else {
        // Если объект есть, то обновляем
        logger.info("Item exists. Update")
        res = await this.upgradeItem(game, existingItem, dbItem);
        await this.incrementExp(userId, 'updateItem');
      }

      logger.info("Transaction successful!");
      return res
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

      const transaction = await TransactionRepository.create(transactionDto);
      await game.save();

      logger.info("Item upgrade successfully");
      return transaction;
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
      const transaction = await TransactionRepository.create(transactionDto);
      await game.save();

      logger.info("Item bought successfully");
      return transaction;
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
      const game = await GameRepository.findByUserId(userId);
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

      const res = await this.buyPlanet(game, planetToBuy);
      await GameRepository.incCurrentPlanetIndex(userId, planetToBuy.index)
      await this.incrementExp(userId, 'unlockPlanet');
      logger.info("Transaction successful!");

      return res
    } catch (err) {
      console.error(err);
      logger.info(err)
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

      const transactionDto = {
        userId: game.userId,
        objectId: dbPlanet._id,
        type: 'planet',
        cost: -dbPlanet.unlockCost,
        balance: game.coins
      }
      const transaction = await TransactionRepository.create(transactionDto);
      await game.save();

      logger.info("Planet bought successfully");
      return transaction;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw ApiError.internalError(`Error bought planet with id: ${dbPlanet._id}`, err);
      }
    }
  }
}

module.exports = GameService;