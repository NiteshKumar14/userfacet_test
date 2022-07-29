const express = require('express'); /// it
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors({
    origin: '*'
}));

const availableSlots = require('./teacher_availability.json');
//post API get the request from the students 
//takes parameter as (weekdat,start_time,end_time)
//return response success or not available base on the timings
app.post('/api/scheduleClass', async (req, res) => {
    try {
        const { weekday, start_time, end_time } = req.body;
        const week = availableSlots.availability;

        if (weekday.toLowerCase() in week) {
            const day = week[weekday.toLowerCase()];
            const slot = day.filter((time) => time.start_time === start_time && time.end_time === end_time)
            console.log("lots", slot);
            if (slot[0]) {
                res.send({
                    slot_confirmed: true,
                    weekday: weekday,
                    start_time: start_time,
                    end_time: end_time,
                    date: new Date()
                });

            }
            else if (!slot[0]) {
                res.send({
                    slot_confirmed: false,
                    reason: "teacher is not available on this day"
                });

            }

        }
        else {
            res.send({
                slot_confirmed: false,
                reason: "teacher is not available on this day"
            });
        }

    }
    catch (err) {
        res.send(err.message);
    }
})

//send the details of teacher details like when the teacher can take class based on availabilty
//just takes the request
//send the json object as data and message of confirmation 
app.get('/api/getTeacherDetails', (req, res) => {
    try {
        res.status(200);
        res.send({ data: availableSlots, message: "data fetched successfully" });

    }
    catch (err) {
        res.status(500); //internal server error
        res.send({ message: "unable to fetch data" });
    }
})

//to avoid cors error as different origin 
//cross origin resource sharing 
app.use(cors({
    origi: '*'
}));

app.listen(3000, () => {
    console.log("listening")
})


