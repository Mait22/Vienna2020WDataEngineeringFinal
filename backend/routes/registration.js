const router = require('express').Router()
const { User, Company, TradeEvent, Registration, Country, Company_Activity, Company_Country, Activity, sequelize } = require('../sequelize')
const { Op } = require("sequelize")
const verify = require('./privateRoutes')
const {addCompanyValidation} = require('../validation')


router.post('/make',verify, async (req, res) => {
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

        // Check if event exsists
        const eventExsists = await TradeEvent.findAll({
                 where: {
                    [Op.and]: [
                        { name: req.body.eventName },
                        { startDate: new Date(parseInt(req.body.yyyy), parseInt(req.body.mm), parseInt(req.body.dd)) }
                    ]
                }
            });
        
        if(eventExsists.length === 0) return res.status(400).send('No specified event found')

        // Check if company exsists
        const companyExsists = await Company.findAll({
            where: {
              name: {
                [Op.eq]: req.body.companyName
              }
            }
          })
        
        // if company exists make the registration to the event
        if(companyExsists.length === 1) {        

            // check if registration is already made
            const registrationMade = await Registration.findAll({
                where: {
                   [Op.and]: [
                       { fk_event: eventExsists[0].dataValues.id},
                       { fk_company: companyExsists[0].dataValues.id}
                   ]
               }
           });
           if(registrationMade.length != 0) return res.status(400).send('Registration already made') 


            // making registration transaction
            const t1 = await sequelize.transaction();
            try {              
                const registration = await Registration.create(
                    {
                        fk_event: eventExsists[0].dataValues.id, 
                        fk_company: companyExsists[0].dataValues.id
                    }, 
                    { transaction: t1 })
              
                await t1.commit();
              
              } catch (err) {
                // reverse if error
                await t1.rollback();
                return res.status(400).send(err)
              }
            return res.status(200).send('Registration successfully made!')
        }



        // if company does not exist add the company 
        if(companyExsists.length === 0) {

            // Validate call
            const {error} = addCompanyValidation(req.body)
            if(error) return res.status(400).send(error.details[0].message)

            // Create company
            const t2 = await sequelize.transaction();
            try {              
                const companyAdded = await Company.create({ 
                    name: req.body.companyName, 
                    employeeCount: req.body.employeeCount, 
                    turnoverEur: req.body.turnoverEur, 
                    email: req.body.email, 
                    phoneNo: req.body.phoneNo}, {transaction: t2})

                await t2.commit();
              
              } catch (err) {
                // reverse if error
                console.log('T2 failure')
                await t2.rollback();
                return res.status(400).send(err)
              }

            // Make registration
            const t3 = await sequelize.transaction();
            try {

                const newCompany = await Company.findAll({
                    where: {
                      name: {
                        [Op.eq]: req.body.companyName
                      }
                    }
                  })
                
                const registration = await Registration.create(
                    {
                        fk_event: eventExsists[0].dataValues.id, 
                        fk_company: newCompany[0].dataValues.id
                    }, 
                    { transaction: t3 })


                await t3.commit();
              
              } catch (err) {
                // reverse if error
                await t3.rollback();
                console.log('T3 failure')
                return res.status(400).send(err)
              }


            // n-m export markets adding
            // Creating bulk add list 
            const newCompany2 = await Company.findAll({
                where: {
                  name: {
                    [Op.eq]: req.body.companyName
                  }
                }
              })

            let exportMarkets = []
            for await (let el of req.body.exportMarkets) {
    
                let exportMarket = await Country.findAll({
                    where: {
                        [Op.or]: [
                          { name: el },
                          { isoCode: el }
                        ]
                    }
                })
                exportMarkets.push({company_id: parseInt(newCompany2[0].dataValues.id), country_id: parseInt(exportMarket[0].dataValues.id)})
            }

            // Bulk adding export markets 
            const t4 = await sequelize.transaction();
            try {
            console.log(exportMarkets)
            const toAddCountries = await Company_Country.bulkCreate(exportMarkets, {transaction: t4});
            await t4.commit();
            }
            catch (err) {
                // reverse if error
                await t4.rollback();
                console.log('T4 failure')
                return res.status(400).send(err)
            }


            // n-m activity area adding
            // Creating bulk add list 
            let activitiesList = []
            for await (let el of req.body.activityAreas) {
    
                let activity = await Activity.findAll({
                    where: {
                        name: {
                          [Op.eq]: el
                        }
                      }
                })
                activitiesList.push({company_id: parseInt(newCompany2[0].dataValues.id), activity_id: parseInt(activity[0].dataValues.id)})
            }

            // Bulk adding export markets 
            const t5 = await sequelize.transaction();
            try {
            console.log(activitiesList)
            const toAddActivities = await Company_Activity.bulkCreate(activitiesList, {transaction: t5});
            await t5.commit();
            }
            catch (err) {
                // reverse if error
                await t5.rollback();
                console.log('T5 failure')
                return res.status(400).send(err)
            }
            

            return res.status(200).send('Company added, registration made, export markets and activity areas added')       
    }

    } catch (err) {
        console.log(err)
        return res.status(400).send(err)
    }    
})


router.get('/checkCompany',verify, async (req, res) => {
    try {

        // Authorization placeholder
        console.log(req.user) // returns signed user id as _id

        // Check if company exsists
        const companyExsists = await Company.findAll({
            where: {
              name: {
                [Op.eq]: req.body.companyName
              }
            }
          })
          
        const companyAlreadyPresent = companyExsists.length === 1 ? true : false
        return res.status(200).send(companyAlreadyPresent)
    } catch (err) {
        console.log('Company present check error')
        console.log(err)
    }    
})


router.get('/getAllRegistrations',verify, async (req, res) => {
    try {
        const allRegistrations = await Registration.findAll();

        let totalRegList = []



        for await (let el of allRegistrations) {

            let regCompany = await Company.findAll({
                where: {
                  id: {
                    [Op.eq]: el.dataValues.fk_company
                  }
                }
            })

            let regEvent = await TradeEvent.findAll({
                where: {
                    id: {
                      [Op.eq]: el.dataValues.fk_event
                    }
                  }
            })

            totalRegList.push({event: regEvent[0].dataValues.name, eventDate: regEvent[0].dataValues.startDate, companyName: regCompany[0].dataValues.name})
        }

        return res.status(200).send(totalRegList)

    } catch (err) {
        console.log('getAllRegistrations API call error')
        console.log(err)
        return res.status(400).send('getAllRegistrations API call error')
    }    
})


router.get('/getAllExportMarkets',verify, async (req, res) => {
    try {
        const allExportMarkets = await Company_Country.findAll();
        return res.status(200).send(allExportMarkets)
    } catch (err) {
        console.log('Get getAllExportMarkets API call error')
        console.log(err)
        return res.status(400).send('Get getAllExportMarkets API call error')

    }    
})

router.get('/getAllCompanyActivities',verify, async (req, res) => {
    try {
        const allExportCompanyActivities = await Company_Activity.findAll();
        return res.status(200).send(allExportCompanyActivities)
    } catch (err) {
        console.log('Get getAllExportMarkets API call error')
        console.log(err)
        return res.status(400).send('Get getAllCompanyActivities API call error')
    }    
})




// Registration form data
router.get('/getAllEvents',verify, async (req, res) => {
    try {
        const result = await TradeEvent.findAll();
        return res.status(200).send(result)
    } catch (err) {
        console.log('Get getAllEvents API call error')
        console.log(err)
        return res.status(400).send('Get getAllEvents API call error')
    }    
})

router.get('/getAllCountries',verify, async (req, res) => {
    try {
        const result = await Country.findAll(
            {attributes: ['name']}
        );
        return res.status(200).send(result)
    } catch (err) {
        console.log('Get getAllCountries API call error')
        console.log(err)
        return res.status(400).send('Get getAllCountries API call error')
    }    
})


router.get('/getAllActivities',verify, async (req, res) => {
    try {
        const result = await Activity.findAll(
            {attributes: ['name']}
        );
        return res.status(200).send(result)
    } catch (err) {
        console.log('Get getAllActivities API call error')
        console.log(err)
        return res.status(400).send('Get getAllActivities API call error')
    }    
})


router.get('/getAllCompanies',verify, async (req, res) => {
    try {
        const result = await Company.findAll({
            attributes: ['name']
          });
        return res.status(200).send(result)
    } catch (err) {
        console.log('Get getAllCompanies API call error')
        console.log(err)
        return res.status(400).send('Get getAllCompanies API call error')
    }    
})





module.exports = router;







