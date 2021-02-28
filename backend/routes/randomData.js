const router = require('express').Router()
const { User, Company, TradeEvent, Venue, Embassy, Worker, Activity, Country, Registration,  
    Worker_Activity, Company_Activity, Company_Country, sequelize } = require('../sequelize')


// Add some random data
router.post('/add', async (req, res) => {
    try {
    
    await sequelize.sync({ force: true })
    
    // Add countries
    await Country.bulkCreate([
        { name: "Austria", isoCode: 'AT'},
        { name: "Germany", isoCode: 'DE'},
        { name: "Japan", isoCode: 'JP'},
        { name: "The United Kingdom", isoCode: 'UK'},
        { name: "Australia", isoCode: 'AU'},
    ]);
    
    // Add embassies
    await Embassy.bulkCreate([
        { name: "Embassy in Austria", address: "Wienna Wohllebengasse 12 1030", fk_country: 1},
        { name: "Embassy in Germany", address: "Berlin Hildebrandstraße 5 10785", fk_country: 2},
        { name: "Embassy in Japan", address: "Tokyo Jingu-mae Shibuya-ku Tokyo 2-6-15 150-0001", fk_country: 3},
        { name: "Embassy in UK", address: "London Queen's Gate Terrace, South Kensingto 44 SW7 5PJ", fk_country: 4},
        { name: "Embassy in Australia", address: "Canberra Darwin Avenue Yarralumla 12 2600", fk_country: 5},
    ]);
    
    // Venue table
    await Venue.create({ name: "Embassy building in Vienna", seatingCapacity: 50, fk_embassy: 1});
    await Venue.create({ name: "Embassy building in Berlin", seatingCapacity: 50, fk_embassy: 2});
    await Venue.create({ name: "Embassy building in Tokyo", seatingCapacity: 50, fk_embassy: 3});
    await Venue.create({ name: "Embassy building in London", seatingCapacity: 50, fk_embassy: 4});
    await Venue.create({ name: "Embassy building in Canberra", seatingCapacity: 50, fk_embassy: 5});

    // Add activities 
    await Activity.create({ name: "IT services"});
    await Activity.create({ name: "Fintech"});
    await Activity.create({ name: "Chemicals"});
    await Activity.create({ name: "Food"});
    await Activity.create({ name: "Construction"});

    // Trade event
    await TradeEvent.create({ name: "Typical event1", startDate: new Date(2021, 6, 20), registrationDue: new Date(2021, 6, 15), fk_venue: 1, fk_activity: 5, fk_embassy: 1});
    await TradeEvent.create({ name: "Typical event2", startDate: new Date(2022, 6, 20), registrationDue: new Date(2022, 6, 15), fk_venue: 2, fk_activity: 4, fk_embassy: 2});
    await TradeEvent.create({ name: "Random event1", startDate: new Date(2021, 7, 20), registrationDue: new Date(2021, 7, 15), fk_venue: 3, fk_activity: 3, fk_embassy: 3});
    await TradeEvent.create({ name: "Random event2", startDate: new Date(2021, 8, 20), registrationDue: new Date(2021, 8, 15), fk_venue: 4, fk_activity: 2, fk_embassy: 4});
    await TradeEvent.create({ name: "Random event3", startDate: new Date(2021, 9, 20), registrationDue: new Date(2021, 9, 15), fk_venue: 5, fk_activity: 1, fk_embassy: 5});

    // Add companies 
    await Company.create({ name: "Company no 1", employeeCount: 100, turnoverEur: 1550000, email: "company1@test.com", phoneNo: "0037256207000"});
    await Company.create({ name: "Company no 2", employeeCount: 200, turnoverEur: 2550000, email: "company2@test.com", phoneNo: "0037256207001"});
    await Company.create({ name: "Company no 3", employeeCount: 100, turnoverEur: 3550000, email: "company3@test.com", phoneNo: "0037256207002"});
    await Company.create({ name: "Company no 4", employeeCount: 300, turnoverEur: 4550000, email: "company4@test.com", phoneNo: "0037256207003"});
    await Company.create({ name: "Company no 5", employeeCount: 500, turnoverEur: 6550000, email: "company5@test.com", phoneNo: "0037256207004"});

    await Registration.bulkCreate([
      { fk_event: 1, fk_company: 1},
      { fk_event: 1, fk_company: 2},
      { fk_event: 1, fk_company: 3},
      { fk_event: 1, fk_company: 4},
      { fk_event: 1, fk_company: 5},
      { fk_event: 2, fk_company: 1},
      { fk_event: 2, fk_company: 2},
      { fk_event: 2, fk_company: 3},
      { fk_event: 2, fk_company: 4},
      { fk_event: 3, fk_company: 1},
      { fk_event: 3, fk_company: 2},
      { fk_event: 3, fk_company: 3},
      { fk_event: 4, fk_company: 1},
      { fk_event: 4, fk_company: 2},
      { fk_event: 5, fk_company: 3}          
  ]);

    // Add workers
    await Worker.bulkCreate([
        { name: "Jaak Edukas", birthdate: new Date(1980, 11, 11), gender: 'M', nationality: "Estonian", 'fk_embassy': 1},
        { name: "Isas Ström", birthdate: new Date(1981, 11, 12), gender: 'M', nationality: "Local", 'fk_embassy': 2},
        { name: "Emas Ström", birthdate: new Date(1982, 11, 13), gender: 'F', nationality: "Estonian", 'fk_embassy': 3},
        { name: "Viktooria Blaad", birthdate: new Date(1983, 11, 14), gender: 'F', nationality: "Local", 'fk_embassy': 4},
        { name: "Jürto Kivi", birthdate: new Date(1984, 11, 15), gender: 'M', nationality: "Estonian", 'fk_embassy': 5}
    ]);

    // Add areas of activities to companies
    await Company_Activity.bulkCreate([
        { company_id: 1, activity_id: 1 },
        { company_id: 2, activity_id: 2 }, 
        { company_id: 3, activity_id: 3 }, 
        { company_id: 4, activity_id: 4 }, 
        { company_id: 5, activity_id: 5 },      
      ]);

    // Add areas of activities to workers
    await Worker_Activity.bulkCreate([
        { worker_id: 1, activity_id: 5 },
        { worker_id: 2, activity_id: 4 }, 
        { worker_id: 3, activity_id: 3 }, 
        { worker_id: 4, activity_id: 2 }, 
        { worker_id: 5, activity_id: 1 },      
      ]);

    // Add export markets to companies
    await Company_Country.bulkCreate([
        { company_id: 1, country_id: 1 },
        { company_id: 2, country_id: 1 }, 
        { company_id: 3, country_id: 2 }, 
        { company_id: 4, country_id: 3 }, 
        { company_id: 5, country_id: 4 },      
      ]);

    await User.bulkCreate([
        { email: 'test33@gmail.com',  password: '$2a$10$Yw2HiUKjdH6VMwoID5EaTeHLqdhjX4aVaPb.bJIRmgw.ltzBuBAae', role: 'company', },
        { email: 'test44@gmail.com',  password: '$2a$10$40WHgbVIeiqALQ3bn1qlquLfQKIN2J/GalJsc4w6NXLnKlA7m/21K', role: 'embassy worker', }
      ]);

    return res.status(200).send('Random data added - only test33@gmail.com user from company role and test44@gmail.com from embassy worker role left')
    } catch (err) {
        console.log('add random data errot')
        console.log(err)
        return res.status(400).send('Get addRandomData API call error')
    }    
})

module.exports = router;





