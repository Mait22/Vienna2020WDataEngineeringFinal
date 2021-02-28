const { mongoose } = require('./mongooseConnection.js')

const Schema = mongoose.Schema;

const Company = new Schema({
  country: [String], 
  activityAreas: [String], 

  name: String, 
  employeeCount: Number, 
  turnoverEur: Number, 
  email: String, 
  phoneNo: String

});

const CompanyMongoose = mongoose.model('CompanyMongoose', Company );


const Event = new Schema({
  name: String, 
  startDate: Date, 
  registrationDue: Date, 
  venue: String, 
  activityArea: String,
  embassyName: String, 
  country: String,

  //embassyWorkers: [String],
  //registrations: [Schema.Types.ObjectId]
  registrations: [String]
});

const EventMongoose = mongoose.model('EventMongoose', Event );


const Embassy = new Schema({
  name: String, 
  address: String, 
  country: String, 
  venues: [{
      name : String,
      seatingCapacity : Number
     }],
  workers: [{
    name : String,
    birthdate : Date, 
    gender: String, 
    nationality: String,
    skills: [String]
   }],
});

const EmbassyMongoose = mongoose.model('EmbassyMongoose', Embassy );


const Countries = new Schema({
  name: String
});

const CountriesMongoose = mongoose.model('CountriesMongoose', Countries );


const Activities = new Schema({
  name: String
});

const ActivitiesMongoose = mongoose.model('ActivitiesMongoose', Activities );



module.exports = {
    CompanyMongoose,
    EventMongoose,
    EmbassyMongoose,
    CountriesMongoose,
    ActivitiesMongoose
}



  