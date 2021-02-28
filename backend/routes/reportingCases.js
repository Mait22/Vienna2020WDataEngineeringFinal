const router = require('express').Router()
const { User, TradeEvent, Country, Activity, Venue, Company, sequelize, Embassy, Worker_Activity, Worker, Registration } = require('../sequelize')
const { Op } = require("sequelize")
const verify = require('./privateRoutes')
// const {addCompanyValidation} = require('../validation')


router.post('/eventRegistrations',verify, async (req, res) => {
    console.log(req)
    try {

         // Authorization
        const userMakingRegistration = await User.findAll({
            where: {
                id: {
                    [Op.eq]: req.user._id
                  }
           }
        });

       if(userMakingRegistration[0].dataValues.role != "embassy worker") return res.status(400).send('Your account is not for a embassy worker, can\'t make a query!')

        // Check if queried activity exsists
        const activityId = await Activity.findAll({
            where: {
                name: {
                    [Op.eq]: req.body.activityName
                  }
           }
        });


        if(activityId.length === 0) return res.status(400).send('Activity not found!')

        // Check if queried country exsists
        const countryId = await Country.findAll({
            where: {
                name: {
                    [Op.eq]: req.body.countryName
                  }
           }
        });

        if(countryId.length === 0) return res.status(400).send('Country not found!')

        const queryResult = await Registration.findAll({
            include: [{
                model: TradeEvent, 
                attributes: ['id','name', 'startDate'],
                include: 
                    [
                    {model: Activity, 
                    attributes: ['id',['name', 'activityName']],
                    where: { name: req.body.activityName },
                    required: true
                    }, 
                    {model: Embassy,
                        attributes: ['id','name'],
                        required: true,  
                        include: [{
                            model: Country,
                            attributes: ['id',['name', 'countryName']], 
                            where: { name: req.body.countryName },
                            required: true 
                        }]}
                    ],               
                    required: true}],
        })

        let resultSums = []
        let includedEvents = []

        if(queryResult.length > 0) {

            queryResult.forEach(el => {
                if(includedEvents.includes(el.fk_event)) {
                    return
                }
                else {
                    includedEvents.push(el.fk_event)
                    let occurances = queryResult.filter( ev => ev.fk_event === el.fk_event)

                    resultSums.push({eventName: el.tradeEvent.name, eventStartDate: el.tradeEvent.startDate, count: occurances.length})
                }

            })
        }

    return res.status(200).send(resultSums)

    } catch (err) {
        console.log(err)
        return res.status(400).send(err)
    }

})



router.post('/companyActivity',verify, async (req, res) => {
    try {

         // Authorization
        const userMakingRegistration = await User.findAll({
            where: {
                id: {
                    [Op.eq]: req.user._id
                  }
           }
        });

       if(userMakingRegistration[0].dataValues.role != "embassy worker") return res.status(400).send('Your account is not for a embassy worker, can\'t make a query')

        // Check if queried activity exsists
        const activityId = await Activity.findAll({
            where: {
                name: {
                    [Op.eq]: req.body.activityName
                  }
           }
        });

        if(activityId.length === 0) return res.status(400).send('Activity not found!')

        // Check if queried country exsists
        const companyId = await Company.findAll({
            where: {
                name: {
                    [Op.eq]: req.body.companyName
                  }
           }
        });

        if(companyId.length === 0) return res.status(400).send('Company not found!')

        const queryResult = await Registration.findAll({
            include: [
                {model: Company, 
                    attributes: ['id',['name', 'companyName']],
                    where: { name: req.body.companyName },
                    required: true
                },
                
                {
                model: TradeEvent, 
                attributes: ['id','name', 'startDate'],
                include: 
                    [
                    {model: Activity, 
                    attributes: ['id',['name', 'activityName']],
                    where: { name: req.body.activityName },
                    required: true
                    }, 
                    {model: Embassy,
                        attributes: ['id','name'],
                        required: true,  
                        include: [{
                            model: Country,
                            attributes: ['id',['name', 'countryName']], 
                            required: true 
                        }, 
                        {
                            model: Worker,
                            attributes: [['name','workerName']], 
                            required: true 
                        }]}
                    ],               
                    required: true}],
        })

        /*        
        let resultsFlat = []

        if(queryResult.length > 0) {

            queryResult.forEach(el => {
                let workerlist = ""
                el.tradeEvent.embassy.workers.forEach(wo => {workerlist = workerlist + wo.workerName + "; "})
                resultsFlat.push({eventName: el.tradeEvent.name, 
                                    eventDate: el.tradeEvent.startDate, 
                                    countryName: el.tradeEvent.embassy.country.countryName, 
                                    workers: workerlist})

            })
        }

        //console.log(resultsFlat)
        */
        

    return res.status(200).send(queryResult)

    } catch (err) {
        console.log(err)
        return res.status(400).send(err)
    }

})


module.exports = router