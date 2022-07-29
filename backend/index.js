const express = require('express'); /// it
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors({
    origin: '*'
  }));

const availableSlots = require('./teacher_availability.json');

app.post('/api/scheduleClass', async (req, res) => {
    try {


        const { weekday, start_time, end_time } = req.body;
        // console.log(req.body);
        console.log(availableSlots.availability);
        const week = availableSlots.availability;

        if (weekday.toLowerCase() in week) {
            const day = week[weekday.toLowerCase()];
            console.log("day", day);

            const slot = day.filter((time) => time.start_time === start_time && time.end_time === end_time)
            console.log("lots",slot);
            if (slot[0]) {
                res.send({
                    slot_confirmed: true,
                    weekday: weekday,
                    start_time: start_time,
                    end_time: end_time,
                    date: new Date()
                });

            }
            else if(!slot[0]){
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



    // const teacher = await availableSlots.find({full_name:"Anu Agarwal"});
    // console.log(teacher);
})

app.get('/api/getTeacherDetails',(req,res)=>{
    try{
        res.status(200);
        res.send({data:availableSlots,message:"data fetched successfully"});

    }
    catch(err){
        res.status(500); //internal server error
        res.send({message:"unable to fetch data"});
    }
})













app.use(cors({
    origin: '*'
}));


app.listen(3000, () => {
    console.log("listening")
})


//  {
//     "full_name": "Shantanu Arora",
//     "email_address": "shantanu.arora@test.com",
//     "weekday": "Monday",
//     "start_time": "9 AM",
//     "end_time": "10 AM",
// }


// response
// {
//     "slot_confirmed": "true",
//     "weekday": "Monday",
//     "start_time": "9 AM",
//     "end_time": "10 AM",
//     "date": "1 August 2022"
// }

// {
//     "slot_confirmed": "false",
//     "reason": "teacher is not available on this day"
// }