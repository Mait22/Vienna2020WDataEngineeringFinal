const CompanyModel = (sequelize, DataTypes) => {
    return sequelize.define('company', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        employeeCount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        turnoverEur: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNo: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })
}

const TradeEventModel = (sequelize, DataTypes) => {
    return sequelize.define('tradeEvent', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'actions_unique'
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            unique: 'actions_unique'
        },
        registrationDue: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        uniqueKeys: {
            actions_unique: {
                fields: ['name', 'startDate']
            }
        }
      } 
    )
}

const VenueModel = (sequelize, DataTypes) => {
    return sequelize.define('venue', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        seatingCapacity: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    })
}

const RegistrationModel = (sequelize, DataTypes) => {
    return sequelize.define('registration', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        }
    })
}

const CountryModel = (sequelize, DataTypes) => {
    return sequelize.define('country', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        isoCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    })
}

const EmbassyModel = (sequelize, DataTypes) => {
    return sequelize.define('embassy', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    })
}

const WorkpositionModel = (sequelize, DataTypes) => {
    return sequelize.define('worker', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,   
            unique: true
        },
        birthdate: {
            type: DataTypes.DATEONLY,
            allowNull: false,   
            unique: false
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        nationality: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        }
    })
}

const ActivityModel = (sequelize, DataTypes) => {
    return sequelize.define('activity', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    })
}

module.exports = {
    CompanyModel,
    TradeEventModel,
    VenueModel,
    RegistrationModel,
    EmbassyModel,
    WorkpositionModel,
    ActivityModel,
    CountryModel
  }