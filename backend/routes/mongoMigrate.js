const router = require('express').Router()
const verify = require('./privateRoutes')


const { CompanyMongoose, EventMongoose, EmbassyMongoose, CountriesMongoose, ActivitiesMongoose } = require('../mongooseSchemas/models')
const { User, TradeEvent, Country, Activity, Venue, Company, sequelize, Embassy, Worker_Activity, Worker, Registration } = require('../sequelize')
const { Op } = require("sequelize")
const { Events } = require('pg')


router.post('/migrateCountries', async (req, res) => {

  try {

    const queryResult = await Country.findAll({}, {raw:true})
    let countriesToMigrate = []

    queryResult.forEach(el => {
      countriesToMigrate.push({name: el.dataValues.name})
    })

  await CountriesMongoose.deleteMany({},
    function(err, result) {
      if (err) {
        return res.send(err);
      } else {
        console.log('Collection emptied!');
      }
    }
    )

  await CountriesMongoose.insertMany(
    countriesToMigrate,
    function(err, result) {
      if (err) {
        return res.send(err);
      } else {
        return res.json(result);
      }
    }
  );

  } catch (err) {
      console.log('Here1')
      console.log(err)
  }
  
})


router.post('/migrateActivities', async (req, res) => {

  try {

    const queryResult = await Activity.findAll({}, {raw:true})
    let activitiesToMigrate = []

    queryResult.forEach(el => {
      activitiesToMigrate.push({name: el.dataValues.name})
    })

  await ActivitiesMongoose.deleteMany({},
      function(err, result) {
        if (err) {
          return res.send(err);
        } else {
          console.log('Collection emptied!');
        }
      })

  await ActivitiesMongoose.insertMany(
    activitiesToMigrate,
    function(err, result) {
      if (err) {
        return res.send(err);
      } else {
        return res.json(result);
      }
    }
  );

  } catch (err) {
      console.log('Here1')
      console.log(err)
  }
  
})


// verify
router.post('/migrateCompanies', async (req, res) => {

    try {

      const queryResult = await Company.findAll({
        include: [
          {
          model: Activity, 
          attributes: ['name'],               
          required: true
          },
          {
            model: Country, 
            attributes: ['name'],               
            required: true
          }
      ],
    }, {raw:true})


    let companiesToMigrate = []
    queryResult.forEach(el => {
      const activities = []
      el.dataValues.activities.forEach(a => activities.push(a.name))
      const countries = []
      el.dataValues.countries.forEach(c => countries.push(c.name))

      companiesToMigrate.push({

        country: countries, 
        activityAreas: activities, 

        name: el.dataValues.name, 
        employeeCount: el.dataValues.employeeCount, 
        turnoverEur: el.dataValues.turnoverEur, 
        email: el.dataValues.email, 
        phoneNo: el.dataValues.phoneNo
      })
    })

    console.log(companiesToMigrate)

    await CompanyMongoose.deleteMany({}
      ,
      function(err, result) {
        if (err) {
          return res.send(err);
        } else {
          console.log('Collection emptied!');
        }
      })

    await CompanyMongoose.insertMany(
      companiesToMigrate,
      function(err, result) {
        if (err) {
          return res.send(err);
        } else {
          return res.json(result);
        }
      }
    );

    } catch (err) {
        console.log('Here1')
        console.log(err)
    }
    
})


// verify
router.post('/migrateEvents', async (req, res) => {

  try {

    const queryResult = await TradeEvent.findAll({
      include: [
        {
        model: Activity, 
        attributes: ['name'],               
        required: true
        },
        {
        model: Venue, 
        attributes: ['name'],               
        required: true
        },
        {
          model: Embassy, 
          attributes: ['name'],               
          required: true,
          include: [{
            model: Country,
            attributes: ['name'], 
            required: true 
        }]
        },
    ],
    }, {raw:true})

    const queryResultReg = await Registration.findAll({
      include: [
        {
        model: TradeEvent, 
        attributes: ['id'],               
        required: true
        },
        {
        model: Company, 
        attributes: ['name'],               
        required: true
        }
    ],
    }, {raw:true})

    eventsToMigrate = []
    queryResult.forEach(el => {

      const companies = []
      queryResultReg.forEach(r => {
        if(r.dataValues.fk_event === el.dataValues.id) {
          companies.push(r.dataValues.company.name)
        }
      })
      eventsToMigrate.push({
        name: el.dataValues.name, 
        startDate: el.dataValues.startDate, 
        registrationDue: el.dataValues.registrationDue, 
        venue: el.dataValues.venue.name, 
        activityArea: el.dataValues.activity.name,
        embassyName: el.dataValues.embassy.name, 
        country: el.dataValues.embassy.country.name,
        registrations: companies
      })

    })

    console.log(eventsToMigrate)

    await EventMongoose.deleteMany({},
      function(err, result) {
        if (err) {
          return res.send(err);
        } else {
          console.log('Collection emptied!');
        }
      })

    await EventMongoose.insertMany(
      eventsToMigrate,
      function(err, result) {
        if (err) {
          return res.send(err);
        } else {
          return res.json(result);
        }
      }
    );

  } catch (err) {
      console.log('Here1')
      console.log(err)
  }
  
})


router.post('/migrateEmbassies', async (req, res) => {

  try {

    const queryResult = await Embassy.findAll({
      include: [
        {
        model: Country, 
        attributes: ['name'],               
        required: true
        }],
    }, {raw:true})

    const queryResultWrk = await Worker.findAll({
      include: [
        {
        model: Activity, 
        attributes: ['name'],               
        required: true
        },
        {
        model: Embassy, 
        attributes: ['id'],               
        required: true
        }
    ],
    }, {raw:true})

    const queryResultVenue = await Venue.findAll({
      include: [
        {
        model: Embassy, 
        attributes: ['id'],               
        required: true
        }
    ],
    }, {raw:true})


    const embassiesToMigrate = []
    queryResult.forEach(el => {

      const workers = []
      queryResultWrk.forEach(w => {
        if(w.dataValues.fk_embassy === el.dataValues.id) {
          const activities = []
          w.dataValues.activities.forEach(a => {
            activities.push(a.name)
          })
          workers.push({
            name: w.name, 
            birthdate: w.birthdate,
            gender: w.gender,
            nationality: w.nationality,
            skills: activities
          })
        }
      })
      
      const venues = []
      queryResultVenue.forEach(v => {
        if(v.dataValues.fk_embassy === el.dataValues.id) {
          venues.push({
            name : v.dataValues.name,
            seatingCapacity : v.dataValues.seatingCapacity
          })
        }
      })
      

      embassiesToMigrate.push({
        name: el.dataValues.name, 
        address: el.dataValues.address,
        country: el.dataValues.country.name,
        venues: venues,
        workers: workers
      })

    })
    
    await EmbassyMongoose.deleteMany({},
      function(err, result) {
        if (err) {
          return res.send(err);
        } else {
          console.log('Collection emptied!');
        }
      })

    await EmbassyMongoose.insertMany(
      embassiesToMigrate,
      function(err, result) {
        if (err) {
          return res.send(err);
        } else {
          return res.json(result);
        }
      }
    );
    
  } catch (err) {
      console.log('Here1')
      console.log(err)
  }
  
})

router.get('/allCompanies',verify, async (req, res) => {
  await CompanyMongoose.find({}, function(err, result) {
    if (err) {
      return res.send(err);
    } else {
      return res.json(result);
    }
  });
})

router.get('/allActivities',verify, async (req, res) => {
  await ActivitiesMongoose.find({}, function(err, result) {
    if (err) {
      return res.send(err);
    } else {
      return res.json(result);
    }
  });
})

router.get('/allCountries',verify, async (req, res) => {
  await CountriesMongoose.find({}, function(err, result) {
    if (err) {
      return res.send(err);
    } else {
      return res.json(result);
    }
  });
})

router.get('/allEvents',verify, async (req, res) => {
  await EventMongoose.find({}, function(err, result) {
    if (err) {
      return res.send(err);
    } else {
      return res.json(result);
    }
  });
})

router.get('/allEmbassies',verify, async (req, res) => {
  await EmbassyMongoose.find({}, function(err, result) {
    if (err) {
      return res.send(err);
    } else {
      return res.json(result);
    }
  });
})



router.post('/makeRegistration',verify, async (req, res) => {
  try {

       // Authorization
      const userMakingRegistration = await User.findAll({
          where: {
              id: {
                  [Op.eq]: req.user._id
                }
         }
      });

     if(userMakingRegistration[0].dataValues.role != "company") return res.status(400).send('Your account is not for a company, can\'t register!')


    if(req.body.addCompany === true) {

      await CompanyMongoose.find({name: req.body.company}, function(err, result) {
        if (err) {
          return res.send(err);
        } else {
          if(result.length > 0) {
            return res.status(400).send('Company Already present!')
          }
        }})
        
        await CompanyMongoose.insertMany(
              [{
              country:  req.body.countries, 
              activityAreas:  req.body.activities, 
              name:  req.body.company, 
              employeeCount: req.body.employeeCount, 
              turnoverEur: req.body.turnoverEur, 
              email: req.body.email, 
              phoneNo: req.body.phoneNo
              }],
        function(err, result) {
              if (err) {
                  return res.send(err);
              } else {
                  console.log('Company added')
                }
              })
            
    } 

      await EventMongoose.find({name: req.body.event, 
      startDate: new Date(parseInt(req.body.yyyy), parseInt(req.body.mm), parseInt(req.body.dd))}, 
      function(err, result) {
        if (err) {
          return res.send(err);
        } else {
          if(result.length !== 1) {
            return res.status(400).send('Multiple events or no events!')
          }
        }
     })

     const doc = await EventMongoose.findOne({ 
       name: req.body.event, 
       startDate: new Date(parseInt(req.body.yyyy), parseInt(req.body.mm), parseInt(req.body.dd)) });


    if(doc.registrations.includes(req.body.company)) {
      return res.status(400).send('Registration already made!')
    }

    const update = doc.registrations
    update.push(req.body.company)
    doc.registrations = update;
    await doc.save();
    return res.status(200).send('Registration made!')

  } catch (err) {
      console.log(err)
      return res.status(400).send(err)
  }    
})

router.post('/addEvent',verify, async (req, res) => {
  try {

       // Authorization
      const userMakingRegistration = await User.findAll({
          where: {
              id: {
                  [Op.eq]: req.user._id
                }
         }
      });

     if(userMakingRegistration[0].dataValues.role != "embassy worker") return res.status(400).send('Your account is not for a embassy worker, can\'t add event!')


     await EventMongoose.find({name: req.body.event, 
      startDate: new Date(parseInt(req.body.yyyy), parseInt(req.body.mm), parseInt(req.body.dd))}, 
      function(err, result) {
        if (err) {
          return res.send(err);
        } else {
          if(result.length !== 0) {
            return res.status(400).send('Event already added!')
          }
        }
     })

     const doc = await EmbassyMongoose.findOne({ 
      name: req.body.embassy
    });


    const skillsPresent = []
    doc.workers.forEach(el => {
      el.skills.forEach(s => {
        skillsPresent.push(s)
      })
    })

    if(!skillsPresent.includes(req.body.activityArea)) {
      return res.status(400).send('Skill not present in the embassy!')
    }

    const country = doc.country
    const venues = doc.venues

    if(req.body.addVenue) {
      const venueList = []
      venues.forEach(el => {venueList.push(el.name)})
      if(venueList.includes(req.body.venue)){
        return res.status(400).send('Venue already present!')
      }
      venues.push({name: req.body.venue, seatingCapacity: req.body.seatingCapacity})
      doc.venues = venues
      await doc.save();
      console.log('Venue added')
    }

    await EventMongoose.insertMany(
      [{
        name: req.body.event, 
        startDate: new Date(parseInt(req.body.yyyy), parseInt(req.body.mm), parseInt(req.body.dd)), 
        registrationDue: new Date(parseInt(req.body.yyyyR), parseInt(req.body.mmR), parseInt(req.body.ddR)), 
        venue: req.body.venue, 
        activityArea: req.body.activityArea,
        embassyName: req.body.embassy, 
        country: country,
        registrations: []
      }],
      function(err, result) {
      if (err) {
          return res.send(err);
      } else {
          return res.status(200).send('Event successfully added!')
        }
      })

  } catch (err) {
      console.log(err)
      return res.status(400).send(err)
  }    
})

router.post('/getRegistrationActivity',verify, async (req, res) => {
  try {

       // Authorization
      const userMakingRegistration = await User.findAll({
          where: {
              id: {
                  [Op.eq]: req.user._id
                }
         }
      });

     if(userMakingRegistration[0].dataValues.role != "embassy worker") return res.status(400).send('Your account is not for a embassy worker, can\'t add event!')

    const allEvents =
     await EventMongoose.find({
       country: req.body.country, 
       activityArea: req.body.activityArea
     })

     if(allEvents.length === 0) {
      return res.status(200).send([{'Event name': "-", "Event start date": "-", "Count": "-"}])
     }
     else {

      const returnQueryRes = []
      allEvents.forEach(el => {
        returnQueryRes.push({'Event name': el.name, "Event start date": el.startDate, "Count": el.registrations.length})
      })
      return res.status(200).send(returnQueryRes)
     }
     
  } catch (err) {
      console.log(err)
      return res.status(400).send(err)
  }    
})

router.post('/getCompanyActvity',verify, async (req, res) => {
  try {

       // Authorization
      const userMakingRegistration = await User.findAll({
          where: {
              id: {
                  [Op.eq]: req.user._id
                }
         }
      });

     if(userMakingRegistration[0].dataValues.role != "embassy worker") return res.status(400).send('Your account is not for a embassy worker, can\'t add event!')

    const allEvents =
     await EventMongoose.find({
       activityArea: req.body.activityArea,
       registrations: { "$in" : [req.body.company]}
     })

     console.log(allEvents)

     if(allEvents.length === 0) {
      return res.status(200).send([
        {'Company name': "-", 
        "Event name": "-",
        "Related Embassy": "-",
        "Country Name": "-",
        "Related Workers": "-"}])
     }

     else {
      
      const returnQueryRes = []

      for (const el of allEvents) {
      
        const embassy =
          await EmbassyMongoose.findOne({
          name: el.embassyName,
        })

        //console.log('Here!')
        //console.log(embassy)

        workerString = ""

        
        embassy.workers.forEach(w => {
          w.skills.forEach(s => {
            //console.log(s)
            if(s === req.body.activityArea) {
              workerString = workerString + w.name + "; "
            }
          })
        })
        

        returnQueryRes.push(
        {'Company name': req.body.company, 
        "Event name": el.name,
        "Related Embassy": el.embassy,
        "Country Name": el.country,
        "Related Workers": workerString}
        )
        
      }
      return res.status(200).send(returnQueryRes)
    }

  } catch (err) {
      console.log(err)
      return res.status(400).send(err)
  }    
})


module.exports = router;


