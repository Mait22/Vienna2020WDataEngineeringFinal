const { Sequelize, DataTypes, Op } = require('sequelize')
const UserModel = require('./modelsSQL/user')
const { CompanyModel, TradeEventModel, VenueModel, RegistrationModel, EmbassyModel, WorkpositionModel, ActivityModel, CountryModel } = require('./modelsSQL/dataModels');
const user = require('./modelsSQL/user');

// DB model instance
const sequelize = new Sequelize('test', 'docker', 'password', {
    host: 'postgresql',
    dialect: 'postgres'
    });

// Creating tables
const User = UserModel(sequelize, Sequelize)
const Company = CompanyModel(sequelize, Sequelize)
const TradeEvent = TradeEventModel(sequelize, Sequelize)
const Venue = VenueModel(sequelize, Sequelize)
const Registration = RegistrationModel(sequelize, Sequelize)
const Embassy = EmbassyModel(sequelize, Sequelize)
const Worker = WorkpositionModel(sequelize, Sequelize)
const Activity = ActivityModel(sequelize, Sequelize)
const Country = CountryModel(sequelize, Sequelize)

// Adding foreign keys between tables
TradeEvent.belongsTo(Venue, {foreignKey: 'fk_venue'});
TradeEvent.belongsTo(Embassy, {foreignKey: 'fk_embassy'});
Registration.belongsTo(TradeEvent, {foreignKey: 'fk_event'});
Registration.belongsTo(Company, {foreignKey: 'fk_company'});
Worker.belongsTo(Embassy, {foreignKey: 'fk_embassy'});
Embassy.belongsTo(Country, {foreignKey: 'fk_country'});
TradeEvent.belongsTo(Activity, {foreignKey: 'fk_activity'});
Venue.belongsTo(Embassy, {foreignKey: 'fk_embassy'});
Embassy.hasMany(Worker, {foreignKey: 'fk_embassy'})



// N-M association tables
// Worker's activities
const Worker_Activity = sequelize.define('Worker_Activity', {}, 
{ timestamps: false, 
    uniqueKeys: {
    Items_unique: {
        fields: ['activity_id', 'worker_id']}
    } 
});
Worker.belongsToMany(Activity, { through: Worker_Activity, foreignKey: 'worker_id', otherKey : 'activity_id' });
Activity.belongsToMany(Worker, { through: Worker_Activity, foreignKey: 'activity_id', otherKey : 'worker_id' });




// Company's activities
const Company_Activity = sequelize.define('Company_Activity',
{id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
},
},  
{ timestamps: false, 
    uniqueKeys: {
    Items_unique: {
        fields: ['company_id', 'activity_id']}
    } 
});
Company.belongsToMany(Activity, { through: Company_Activity, foreignKey: 'company_id', otherKey : 'activity_id' });
Activity.belongsToMany(Company, { through: Company_Activity, foreignKey: 'activity_id', otherKey : 'company_id' });

// Company's export markets
const Company_Country = sequelize.define('Company_Country', 
{id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
},
}, 
{ timestamps: false, 
    uniqueKeys: {
    Items_unique: {
        fields: ['company_id', 'country_id']}
    } 
});
Company.belongsToMany(Country, { through: Company_Country, foreignKey: 'company_id', otherKey : 'country_id'});
Country.belongsToMany(Company, { through: Company_Country, foreignKey: 'country_id', otherKey : 'company_id'});

/*
// Event's organized by embassies
const Embassy_Event = sequelize.define('Embassy_Event', {}, 
{ timestamps: false, 
    uniqueKeys: {
    Items_unique: {
        fields: ['embassy_id', 'event_id']}
    } 
});
Embassy.belongsToMany(TradeEvent, { through: Embassy_Event, foreignKey: 'embassy_id', otherKey : 'event_id' });
TradeEvent.belongsToMany(Embassy, { through: Embassy_Event, foreignKey: 'event_id', otherKey : 'embassy_id' });
*/

/*
const Embassy_Venue = sequelize.define('Embassy_Venue', {}, 
{ timestamps: false, 
    uniqueKeys: {
    Items_unique: {
        fields: ['embassy_id', 'venue_id']}
    } 
});
Embassy.belongsToMany(Venue, { through: Embassy_Venue, foreignKey: 'embassy_id', otherKey : 'venue_id' });
Venue.belongsToMany(Embassy, { through: Embassy_Venue, foreignKey: 'venue_id', otherKey : 'embassy_id' });
*/

module.exports = {

//main tables 
  User,
  Company,
  TradeEvent,
  Venue,
  Registration,
  Embassy, 
  Worker,
  Activity,
  Country,

  // N-M tables
  Worker_Activity,
  Company_Activity,
  Company_Country,
  //Embassy_Event,
  //Embassy_Venue,

  // DB model instance itself
  sequelize
}





