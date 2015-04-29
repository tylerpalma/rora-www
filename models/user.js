module.exports = function(sequelize, DataTypes) {

  var schema = {
    admin: DataTypes.BOOLEAN,
    email: DataTypes.STRING(100),
    bio: DataTypes.TEXT,
    name: DataTypes.STRING,
    country: DataTypes.STRING,
    steamID: DataTypes.STRING(25),
    steamPrimaryClanID: DataTypes.STRING(25),
    steamUserName: DataTypes.STRING(50),
    steamRealName: DataTypes.STRING(75),
    steamLocCountryCode: DataTypes.STRING(10),
    steamLocStateCode: DataTypes.STRING(10),
    steamLocCityID: DataTypes.INTEGER(10),
    steamAvatar: DataTypes.STRING(250),
    steamAvatarMedium: DataTypes.STRING(250),
    steamAvatarFull: DataTypes.STRING(250)
  };

  var User = sequelize.define('user', schema, {
    classMethods: {
      associate: function (db) {
      }
    },
    getterMethods: {
    },
    hooks: {
      beforeCreate: function (user, fn) {
        if (user.steamRealName) user.name = user.steamRealName;
        if (user.steamLocCountryCode) user.country = user.steamLocCountryCode;
        fn(null, user);
      }
    }
  });

  return User;
};