import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import mongoose from "mongoose";
const port=3000;
const app= express();

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

const taskSchema= new mongoose.Schema({
    task: String,
});

const Task= mongoose.model("task",taskSchema);

const appointmentSchema= new mongoose.Schema({
    date: String,
    time: String,
    agenda: String
});

const Appointment = mongoose.model("appointment",appointmentSchema);

app.get("/", async(req,res)=>{
    var d= new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var current_day = days[d.getDay()];
    var current_date = d.getDate();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var current_month = months[d.getMonth()];
    var current_year=d.getFullYear();
    try{
        const response= await axios.get("https://quotes15.p.rapidapi.com/quotes/random/", {
            headers: {
                'X-RapidAPI-Key': '63baa926dbmsh33448a448a7bfebp1f76bdjsnbac24ec87d47',
              },
        });
        const weather= await axios.get(`http://api.weatherapi.com/v1/current.json?key=e244c493cab84ac3ad8141408232710&q=New-Delhi&aqi=yes`);
        const tasksfromdb = await Task.find({});
        const appointmentfromdb = await Appointment.find({});
        res.render("index.ejs",{day:current_day,date:current_date,month:current_month,year:current_year,quote:response.data.content,name:response.data.originator.name,temp:weather.data.current.temp_c,City:weather.data.location.name,icon:weather.data.current.condition.icon,aqi:weather.data.current.air_quality.pm10,condition:weather.data.current.condition.text,activity:tasksfromdb,appointment:appointmentfromdb});
    }catch(err){
        console.log(err);
    }
});


app.post("/post",(req,res)=>{
    console.log(req.body);
    const new_task =new Task({
        task:req.body.newtask,
    });
    new_task.save();
    res.redirect("/")
});

app.post("/delete",async(req,res)=>{
    console.log(req.body)
    await Task.deleteOne({_id:req.body.checkbox});
    res.redirect("/")
});


app.post("/post/appointments",(req,res)=>{
    console.log(req.body);
    const new_appointment=new Appointment({
        date:req.body.date,
        time:req.body.time,
        agenda:req.body.newappointment
    });
    new_appointment.save();
    res.redirect("/")
});

app.post("/appointmentdelete",async(req,res)=>{
    console.log(req.body)
    await Appointment.deleteOne({_id:req.body.checkbox});
    res.redirect("/")
});

app.listen(port,()=>{
    console.log(`port is active at ${port}`)
})