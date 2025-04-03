
class ExperienceService {

  static getClickExp(userLevel, baseExp = 5, multiplier = 1.1) {
    // Click
    return baseExp + ((userLevel !== 0 ? userLevel * multiplier : userLevel));
  }


  static getUpdateItemExp(userLevel, baseExp = 40, multiplier = 1.3) {
    // updateItem
    return baseExp + (userLevel * multiplier);
  }


  static getPurchaseItemExp(userLevel, baseExp = 100, multiplier = 1.5) {
    // buyItem
    return baseExp + (userLevel * multiplier);
  }


  static getPlanetUnlockingExp(userLevel, baseExp = 150, multiplier = 1.8) {
    // buyPlanet
    return baseExp + (userLevel * multiplier);
  }


  static getRequiredExp(level) {
    const baseExp = 1000; // Базовое количество опыта для первого уровня
    const expMultiplier = 1.5; // Множитель для увеличения опыта
    return Math.floor(baseExp * Math.pow(expMultiplier, level - 1)); // Експоненциальный рост
  }

}


module.exports = ExperienceService;