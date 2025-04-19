
class ExperienceService {

  static getClickExp(userLevel) {
    return Math.round(15 * Math.pow(1.2, userLevel));
  }


  static getClickAbsentExp(userLevel) {
    return Math.round(5 * Math.pow(1.2, userLevel));
  }


  static getPurchaseItemExp(userLevel) {
    return Math.round(120 * Math.pow(1.25, userLevel));
  }

  static getUpdateItemExp(userLevel) {
    return Math.round(50 * Math.pow(1.2, userLevel));
  }

  static getPlanetUnlockingExp(userLevel) {
    return Math.round(200 * Math.pow(1.3, userLevel));
  }


  static getRequiredExp(level) {
    const baseExp = 1000;
    const expMultiplier = 1.3;
    return Math.floor(baseExp * Math.pow(expMultiplier, level - 1));
  }
}


module.exports = ExperienceService;