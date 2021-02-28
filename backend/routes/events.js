const router = require('express').Router()
const { User, TradeEvent, Country, Activity, Venue, sequelize, Embassy, Worker_Activity, Worker } = require('../sequelize')
const { Op } = require("sequelize")
const verify = require('./privateRoutes')
// const {addCompanyValidation} = require('../validation')


router.post('/add',verify, async (req, res) => {
    try {

         // Authorization
        const userMakingRegistration = await User.findAll({
            where: {
                id: {
                    [Op.eq]: req.user._id
                  }
           }
        });

       if(userMakingRegistration[0].dataValues.role != "embassy worker") return res.status(400).send('Your account is not for a embassy worker, can\'t register!')

        // Check if event alredy exsists
        const eventExsists = await TradeEvent.findAll({
                 where: {
                    [Op.and]: [
                        { name: req.body.eventName },
                        { startDate: new Date(parseInt(req.body.YYYY), parseInt(req.body.mm), parseInt(req.body.dd)) }
                    ]
                }
            });
        
        if(eventExsists.length != 0) return res.status(400).send('Event already exists')

        // Get embassy Id
        const embassyExsists = await Embassy.findAll({
                where: {
                    name: {
                        [Op.eq]: req.body.embassyName
                    }
                }
        });

        if(embassyExsists.length === 0) return res.status(400).send('Embassy not found')

        const embassyId = embassyExsists[0].dataValues.id


        // Get activity Id
        const eventRelatedActivity = await Activity.findAll({
            where: {
                name: {
                    [Op.eq]: req.body.activityName
                }
           }
        });
   
        if(eventRelatedActivity.length === 0) return res.status(400).send('Activity is not valid')

        const activityId = eventRelatedActivity[0].dataValues.id


       const relevantEmbassyWorkers = await Worker.findAll({
        include: [{
            model: Activity, 
            attributes: ['id','name'], 
            through: { where: { activity_id: activityId } }
        }],
        where: {
            fk_embassy:{
                [Op.eq]: embassyId
            }
        }})
            
        console.log(relevantEmbassyWorkers[0].dataValues.activities)


        if(relevantEmbassyWorkers.length === 0 || relevantEmbassyWorkers[0].dataValues.activities.length === 0) return res.status(400).send('No suitable organizing embassy worker found, add skills or a new worker')


        // Check if inserted Venue exsists
        const venueExists = await Venue.findAll({
            where: {
                name: {
                    [Op.eq]: req.body.venueName
                  }
           }
        });

        let venueId = null;
        
        if(venueExists.length != 0) {
            venueId = venueExists[0].dataValues.id
        }

        // Add new venue if needed
        if(venueExists.length === 0) {
            const t1 = await sequelize.transaction();
            try {              
                const venuAdded = await Venue.create(
                    {
                        name: req.body.venueName, 
                        seatingCapacity: req.body.venueSeatingCapacity,
                        fk_embassy: embassyId
                    }, 
                    { transaction: t1 })
              
                await t1.commit();
              
              } catch (err) {
                // reverse if error
                await t1.rollback();
                return res.status(400).send(err)
              }
        

            // Get id of added venue
            const newVenue = await Venue.findAll({
                where: {
                    name: {
                        [Op.eq]: req.body.venueName
                    }
            }
            });

            venueId = newVenue[0].dataValues.id
        }

        // Create trade event 
        const t2 = await sequelize.transaction();
        try {              
            const eventAdded = await TradeEvent.create(
                {
                    name: req.body.eventName, 
                    startDate: new Date(req.body.YYYY, req.body.mm, req.body.dd),
                    registrationDue: new Date(req.body.YYYYR, req.body.mmR, req.body.ddR),
                    fk_activity: activityId,
                    fk_venue: venueId,
                    fk_embassy: embassyId
                }, 
                { transaction: t2 })
          
            await t2.commit();
       
          } catch (err) {
            // reverse if error
            await t2.rollback();
            return res.status(400).send(err)
        }
        


    return res.status(200).send('Event added!')

    } catch (err) {
        console.log(err)
        return res.status(400).send(err)
    }

})



router.get('/getVenuesByEmbassy',verify, async (req, res) => {

        // Authorization placeholder
        // console.log(req.user) // returns signed user id as _id

        try {
            const venues = await Venue.findAll({
                include: 
                [{
                  model: Embassy, 
                  attributes: ['name'] 
                }]
            })
            
            let venuesByEmbassy = {}
        
            venues.forEach(el => {
                if(el.embassy.name in venuesByEmbassy) {
                    venuesByEmbassy[el.embassy.name].push({venueName: el.name, seatingCapacity: el.seatingCapacity}) 
                }
                else {
                    venuesByEmbassy[el.embassy.name] = []
                    venuesByEmbassy[el.embassy.name].push({venueName: el.name, seatingCapacity: el.seatingCapacity}) 
                }
            }) 

            return res.status(200).send(venuesByEmbassy)          

        } catch (err) {
            return res.status(400).send(err)
        }
})


router.get('/getWorkersByEmbassy',verify, async (req, res) => {

    // Authorization placeholder
    // console.log(req.user) // returns signed user id as _id

    try {
        const workers = await Worker.findAll({
            include: 
            [{
              model: Embassy, 
              attributes: ['name'] 
            }]
        })
        
        let workersByEmbassy = {}
    
        workers.forEach(el => {
            if(el.embassy.name in workersByEmbassy) {
                workersByEmbassy[el.embassy.name].push({workerName: el.name}) 
            }
            else {
                workersByEmbassy[el.embassy.name] = []
                workersByEmbassy[el.embassy.name].push({workerName: el.name}) 
            }
        }) 

        return res.status(200).send(workersByEmbassy)          

    } catch (err) {
        return res.status(400).send(err)
    }
})



/*
router.post('/addSkillsToWorker',verify, async (req, res) => {

    try{

    // Authorization
    const userMakingRegistration = await User.findAll({
        where: {
            id: {
                [Op.eq]: req.user._id
                }
        }
    });

    if(userMakingRegistration[0].dataValues.role != "embassy worker") return res.status(400).send('Your account is not for a embassy worker, can\'t add skills!')


    const workerToAddSkills = await Worker.findAll({
        include: [{
            model: Activity, 
            attributes: ['id','name'], 
            through: {}
        }],
        where: {
            name:{
                [Op.eq]: req.body.name
            }
        }})

    console.log,og('Worker to add skills')
    console.log(workerToAddSkills)
    
    let sklillsPresent = []
    workerToAddSkills.forEach(el => {
        el.dataValues.activities.forEach ( ell => {sklillsPresent.push({name: ell.dataValues.name, id: ell.dataValues.id})})  
    })

    console.log('Skills present')
    console.log(sklillsPresent)


    const skillsToAdd = []
    req.body.skillsToAdd.forEach(el => {if (!sklillsPresent.includes(el.name)) {
        skillsToAdd.push({worker_id: workerToAddSkills[0].dataValues.id, activity_id: el.id})
        }
    })

    console.log('Skills to add')
    console.log(skillsToAdd)

    if(skillsToAdd.length != 0) {
        const t1 = await sequelize.transaction();
        try {              
            const addedSkills = await Worker_Activity.create(
                skillsToAdd, 
                { transaction: t1 })
        
            await t1.commit();
    
        } catch (err) {
            // reverse if error
            await t1.rollback();
            return res.status(400).send(err)
        }
        return res.status(200).send('Skills added')    
    }
    else {
        return res.status(400).send('No skills to add ') 
    }       

} catch (err) {
    return res.status(400).send(err)
    }
})
*/

module.exports = router