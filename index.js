const express = require("express");
const cors = require("cors");
//const bcrypt = require('bcryptjs')
const mongoose = require("mongoose");
require("dotenv").config();
var nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const app = express();
const { handleErrors } = require("./middlewares/handleErrors");
const fileupload = require("express-fileupload");
// const handleRequest=require('./middlewares/index')
//const User = require('./models/user')

const Arrhythmias = require("./model/arrhythmias");
const EctopyRoute = require("./routes/Ectopy.route");
const InterimReportRoute = require("./routes/InterimReport.route");
const ReferingPhysicianRoute = require("./routes/ReferingPhysician.route");
const InterpretingPhysician = require("./model/interpretingPhysician");
const port = process.env.PORT || 5000;
const SupervisorQueueRoute = require("./routes/SupervisorQueue.route");
const ArrhythmiasRoute = require("./routes/Arrhythmias.route");
const v1Routes = require("./v1/routes/index");
//const User = require("./model/user");
const Token = require("./model/token");
const sendEmail = require("./utils/sendMail");
const Joi = require("joi");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
//const logger = require("./logger/logger");
//const connection = require("./common/connection");
const Model = require("./model/index");
const winston = require("winston");
const expressWinston = require("express-winston");
const winstonMongo = require("winston-mongodb");
const ElasticsearchTransport = require("winston-elasticsearch");
require("winston-daily-rotate-file");
const {performance} = require('perf_hooks');
const {sequelize,User}=require('./models')

/*
api v1
*/
//mongodb://localhost/pulse-gate-suite
// mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.myrxm.mongodb.net/?retryWrites=true&w=majority`, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }, () => {
//   console.log('connected to the database local')
// })
// mongoose.connect(
//   `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.myrxm.mongodb.net/?retryWrites=true&w=majority`,
//  { useNewUrlParser: true,
//   useUnifiedTopology: true},
//   (err) => {
//    if(err) console.log(err)
//    else console.log("mongdb is connected");
//   }
// );

// try {
//   mongoose.connect( `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.myrxm.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true,useNewUrlParser: true,
//   useUnifiedTopology: true });
// console.log("connected")
// } catch (error) {
//   console.error(error);
//   console.log(error)
// }
const getMessage = (req, res) => {
  let obj = {
    correlationId: req.headers["x-correlation-id"],
    requestBody: req.body,
  };

  return JSON.stringify(obj);
};
const fileInfoTransport = new winston.transports.DailyRotateFile({
  filename: "log/log-info-%DATE%.log",
  datePattern: "yyyy-MM-DD-MM",
});
const infoLogger = expressWinston.logger({
  transports: [ fileInfoTransport],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: getMessage,
});

const fileErrorTransport = new winston.transports.DailyRotateFile({
  filename: "log/log-error-%DATE%.log",
  datePattern: "yyyy-MM-DD-MM",
  level: "error",
});

const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.Console(), fileErrorTransport],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: '{  "error": "{{err.message}}" }',
});
const handleRequest = async (req, res, next) => {
  let correlationId = req.headers["x-correlation-id"];
  if (!correlationId) {
    correlationId = Date.now().toString();
    req.headers["x-correlation-id"] = correlationId;
  }

  res.set("x-correlation-id", correlationId);

  return next();
};
const expressJson = express.json(); 
const bodyParser  = express.urlencoded({extended: true}); 
app.use(fileupload());
app.use('/uploads', express.static('uploads'));
app.use([expressJson, bodyParser])
app.use(handleRequest);
app.use(infoLogger);
app.use(
  cors({
    credentials: true,
    origin: [
      "https://pulse-gate-suite-client.herokuapp.com",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:3004",
      "http://localhost:3005",
      "https://pulse-gate-suite-faisalmahamudcs.vercel.app",
      "https://pulse-gate-suite-git-frontend-faisalmahamudcs.vercel.app",
      "https://device-logistic-frontend-faisalmahamudcs.vercel.app",
      "https://asset-master-front.vercel.app",
      "https://asset-master-front-faisalmahamudcs.vercel.app",
      "https://asset-master-git-develop-faisalmahamudcs.vercel.app",
      "https://asset-master-psi.vercel.app",
      "https://device-logistic.vercel.app",
      "https://device-logistic-git-develop-faisalmahamudcs.vercel.app",
      "https://asset-master-bhee0uf2w-faisalmahamudcs.vercel.app",
      "https://tpgs.vercel.app",
      "https://tpgs-git-develop-faisalmahamudcs.vercel.app",
      "https://pulse-gate-suites.vercel.app",
      "https://tpgs-mono-git-develop-faisalmahamudcs.vercel.app",
      "https://tpgs-mono.vercel.app",

      "*",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", v1Routes);

// const db = require("./model/model.js");
// db.sequelize.sync()
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });
  
require("./routes/turorial.routes")(app);
require("./routes/user.routes")(app);
require("./routes/device.routes")(app);
require("./routes/deviceData.routes")(app);
require("./routes/accessory.routes")(app);
require("./routes/vendor.routes")(app);
require("./routes/deviceList.routes")(app);
require("./routes/login.routes")(app);
require("./routes/practice.routes")(app);
require("./routes/kit.routes")(app);
require("./routes/patient.routes")(app);
require("./routes/patientKitAssign.routes")(app);
require("./routes/service.routes")(app);

//show active user
const http = require("http");
//const server = http.createServer(app);
const { Server } = require("socket.io");
const { NotFound } = require("./utils/errors");
//const io = new Server(server);
//var count = 0
/*
Method:socket
Purpose:To show how many user viewing the page
Precondition:must connected with socket port
Postcondition:return number of user
Parameters :socket
return :return number of user
*/

//const server = http.createServer(app);

// const connectToMongo = async() => {
//   await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.myrxm.mongodb.net/?retryWrites=true&w=majority`, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true

//   });
//   return mongoose;
// };

//  connectToMongo().then(async() => console.log('connected yeee'));
/*
Method:verifyJWT
Purpose:To verify role based authentication/authenticated user
Precondition:must have authorized header,access token
Postcondition:send email and info of user

return :decoded email and info
*/

// async function run() {
// try {
// mongodb://${process.env.DB_USER}:{process.env.DB_PASSWORD}@cluster0-shard-00-00.myrxm.mongodb.net:27017,cluster0-shard-00-01.myrxm.mongodb.net:27017,cluster0-shard-00-02.myrxm.mongodb.net:27017/?ssl=true&replicaSet=atlas-3a1elw-shard-0&authSource=admin&retryWrites=true&w=majority
// mongoose.connect(
//   `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-shard-00-00.myrxm.mongodb.net:27017,cluster0-shard-00-01.myrxm.mongodb.net:27017,cluster0-shard-00-02.myrxm.mongodb.net:27017/?ssl=true&replicaSet=atlas-3a1elw-shard-0&authSource=admin&retryWrites=true&w=majority`,
//   {
//     useUnifiedTopology: true,

//     useNewUrlParser: true,
//   },
//   (error, result) => {
//     error
//       ? console.error("this is error", error)
//       : console.log("Mongo Connected");
//   }
// );

//connection.mongodb();
//
app.post("/userCreate", async (req, res) => {
  try {

    const salt = await bcrypt.genSalt(10);
    //console.log(req.body)
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user =await  User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });
    const result = await user.save();
    const { password, ...data } = await user.toJSON();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
})

app.post("/password-reset", async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send("user with given email doesn't exist");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password reset", link);

    res.send("password reset link sent to your email account");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

app.get("/password-reset/:userId/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    res.status(200).send("Valid Url");
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/:userId/:token", async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.params.userId);
    console.log(user);
    if (!user) return res.status(400).send("invalid link or expired");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link or expired");
    const salt = await bcrypt.genSalt(10);
    //console.log(req.body)
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
    console.log(hashedPassword);
    await user.save();
    await token.delete();

    res.send("password reset sucessfully.");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

//checkuser
app.get("/user", async (req, res) => {
  try {
    const cookie = req.headers.authorization;
    const claims = jwt.verify(cookie, "secret");
    if (!claims) {
      return res.status(401).send({
        message: "unauthenticated",
      });
    }
    //console.log(claims) h
    const user = await User.findOne({ _id: claims._id });
    const { password, ...data } = await user.toJSON();
    res.send(data);
  } catch (e) {
    return res.status(401).send({
      message: "unauthenticated",
    });
  }
});

/*  GET  localhost:5000/patient .It will get patient data from Patient
table .PatientRoute set /patient to api.
 POST  localhost:5000/patient
 POST patient information to database
*/

//app.use("/patient", PatientRoute);

app.use("/supervisorQueue", SupervisorQueueRoute);
//ArrhythmiasRoute
app.use("/arrhythmias", ArrhythmiasRoute);
//ectopy post and get
app.use("/ectopy", EctopyRoute);
//InterimReport get and post
app.use("/InterimReport", InterimReportRoute);
//refering physician get and post
app.use("/referingPhysician", ReferingPhysicianRoute);

//comment patch update for techincian when new comment submitted
app.patch("/comment", async (req, res) => {
  try {
    const eventID = req.body.eventID;
    const comment = req.body.comment;
    const filter = { eventID: eventID };
    const update = { comment: comment };
    const result = await Patient.findOneAndUpdate(
      { eventID: eventID },
      { comment: comment }
    );
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

//interpreting physician post
/*
    Resource Description:Allow to post interpreting Doctor information
     to database .
    Resource URL:POST localhost:5000/interpretingPhysician
    Method:POST
    Parameters:
    Request Body Example:
{
  "name":"Dr. Satish",
  "dayPhone":"8489749925",
  "afterHourPhone":"9898775645",
  "hospital":"Apollo",
  "address":"No 987,Texas,USA",
  "fax":"2846827",
  "email":"drsatish@gmail.com"

}
    Header:token
  Example Response Body:
 {
  "acknowledgement":"true"
 }
  Status and ERROR Code:
  200 :Successful
  400:ERROR

    */

app.post("/interpretingPhysician", async (req, res) => {
  try {
    const interpretingphysician = new InterpretingPhysician({
      name: req.body.name,
      dayPhone: req.body.dayPhone,
      afterHourPhone: req.body.afterHourPhone,
      hospital: req.body.hospital,
      address: req.body.address,
      fax: req.body.fax,
      email: req.body.email,
    });
    const result = await interpretingphysician.save();
    const data = await result.toJSON();
    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});
//get interpreting Physician info
/*
    Resource Description:Allow to get all interpreting Doctor informations
     to database .
    Resource URL:GET localhost:5000/interpretingPhysician
    Method:GET
    Parameters :
    Request Body Example:
    Header:token
    Example Response Body:
{
    "name": "Dr. Satish",
    "dayPhone": "8489749925",
    "afterHourPhone": "9898775645",
    "hospital": "Apollo",
    "address": "No 987,Texas,USA",
    "fax": "2846827",
    "email": "drsatish@gmail.com",
    "_id": "62ed198d702fc48f07908b4b",
    "createdAt": "2022-08-05T13:22:21.783Z",
    "updatedAt": "2022-08-05T13:22:21.783Z",
    "__v": 0
}
  Status and ERROR Code:
  200 :Successful
  400:ERROR

    */
app.get("/interpretingPhysician", async (req, res) => {
  try {
    const result = await InterpretingPhysician.find({});
    return res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

//get populating interpretingPhysican with doctor
/*
    Resource Description:Allow to get per patient associated doctor
    by populating doctor with patient.
    Resource URL:GET http://localhost:5000/patientInterpreting/eventID
    Method:GET
    Parameters :eventID
    Request Body Example:
    Header:token
    Example Response Body:
{
    "_id": "62ed569aa1db93fa36b4889c",
    "eventType": "Arterial Fibrillation",
    "eventID": "484525",
    "maxHR": "93",
    "patientName": "Fatema",
    "age": "34",
    "gender": "Female",
    "implantDevice": "implantDevice",
    "criteria": [
        {
            "mctNoticeRhythm": "Arterial Rhythms",
            "reportWeekly": "Yes 1 Baseline ",
            "urgentNotification": "N/A",
            "immediateNotification": "N/A",
            "status": "Yes"
        },
        {
            "mctNoticeRhythm": "Baseline",
            "reportWeekly": "Yes (Symptomatic) ",
            "urgentNotification": "N/A",
            "immediateNotification": "N/A",
            "status": "No"
        }
    ],
    "comment": "good",
    "interpretingPhysicianID": {
        "_id": "62ed521f0cefc1a42af7dd64",
        "name": "Dr. Satish",
        "dayPhone": "8489749925",
        "afterHourPhone": "9898775645",
        "hospital": "Apollo",
        "address": "No 987,Texas,USA",
        "fax": "2846827",
        "email": "drsatish@gmail.com",
        "__v": 0
    },
    "createdAt": "2022-08-05T17:42:50.967Z",
    "updatedAt": "2022-08-05T17:42:50.967Z",
    "__v": 0
}
  Status and ERROR Code:
  200 :Successful
  400:ERROR

    */

app.get("/patientInterpreting/:eventID", async (req, res, next) => {
  try {
    eventID = req.params.eventID;
    let result = await Model.Patient.findOne({ eventID: eventID });
    if (!result) {
      throw new NotFound("Patient Not found by eventID" + eventID);
    }
    Model.Patient.findOne({ eventID: eventID })
      .populate("interpretingPhysicianID")
      .then((p) => res.send(p))
      .catch((error) => console.log(error));
  } catch (error) {
    // if(error.message==='notFound'){
    //   next({status:404,message:'Patient Not Found'})
    // }
    // elseP
    return next(error, req, res);
    //res.status(400).send(error);
  }
});
app.get("/patientInterpretingTest/:eventID", async (req, res, next) => {
  try {
    eventID = req.params.eventID;
    let result = await Model.Patient.findOne({ eventID: eventID });
    if (result) {
      res.send(result);
    }
  } catch (error) {
    return next({ status: 404, message: "Patient Not Found" });

    // console.log("error",error)
    // return next(error,req,res);
    // res.status(400).send(error);
  }
});

app.use(errorLogger);
app.use(handleErrors);

// } finally {
// }
//}
var server = app.listen(port, async ()=> {
  console.log("server listening at", server.address());
  //  await sequelize.sync({force:false})
  console.log('database sync')
});
//var io = require('socket.io')(server)
//const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://pulse-gate-suite-client.herokuapp.com",
      "http://localhost:3001",
      "https://pulse-gate-suite-faisalmahamudcs.vercel.app",
      "https://pulse-gate-suite-git-frontend-faisalmahamudcs.vercel.app",
      "https://device-logistic-frontend-faisalmahamudcs.vercel.app",
      "https://asset-master-front.vercel.app",
      "https://asset-master-front-faisalmahamudcs.vercel.app",
      "https://asset-master-git-develop-faisalmahamudcs.vercel.app",
      "https://asset-master-psi.vercel.app",
      "https://device-logistic.vercel.app",
      "https://device-logistic-git-develop-faisalmahamudcs.vercel.app",
      "https://tpgs-mono.vercel.app",
      "*",
      "https://tpgs-mono-git-develop-faisalmahamudcs.vercel.app"

    ],
    methods: ["GET", "POST"],
  },
});
let count = 0;

let users = [];
console.log(users);
let viewingUser = [];
console.log("viewing ", viewingUser);
const addViewingUser = (data, _id,role) => {
  !viewingUser.some((user) => user.data === data) &&
    viewingUser.push({ data, _id ,role});

  console.log(data, _id);
  // viewingUser.push({ data, _id });
};
const addUser = (userId, socketId) => {
  console.log(userId, socketId);
  if (userId !== null && typeof userId !== "undefined") {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
//removeView

const removeView = (_id) => {
  console.log('id for remove',_id)
  viewingUser = viewingUser.filter((viewingUser) => viewingUser._id !== _id);
  console.log("removed",viewingUser)
 // return viewingUser
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
 // console.log("a user connected.");
  setTimeout(function () {
    socket.send("Fahim sent ");
  }, 5000);
  socket.emit("getViewUsers", viewingUser);
  //take userId and socketId from user
  socket.on("addUser", (user) => {
    addUser(user, socket.id);

    console.log(users);
    io.emit("getUsers", users);
    // io.emit("getViewUsers", viewingUser);
  });
  socket.on("times", (data, _id,role,date) => {
    //console.log(data, _id,role,date);
    // addViewingUser(data, _id,role);
    // io.emit("getViewUsers", viewingUser);
    var startTime,endTIme
startTime=date
    endTime = performance.now();
    var timeDiff = endTime - startTime; //in ms 
    // strip the ms 
    timeDiff /= 1000; 
    
    // get seconds 
    var seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");



    console.log('date  inside times',data,_id,role,new Date(date).getMinutes())
  });
  socket.on("timer", (data, _id,role,date) => {
   // socket.on("times",( data, _id,role,date) )
    //   console.log(data, _id,role,date);
    //   console.log('_id',_id)
    //   const datas= removeView(_id)
    //   console.log("reload data",datas);
    // socket.emit("timer",datas,date)
    // socket.emit("getViewUsers", datas,_id,role);
      // addViewingUser(data, _id,role);
      // io.emit("getViewUsers", viewingUser);
   
    console.log(data, _id,role);
      console.log('date  inside timer',new Date(date).getMinutes())
      console.log('date  new timer',new Date().getMinutes())
      const datas= removeView(_id)
      console.log("reload data",datas);
    io.emit("timer",datas,date)
  io.emit("getViewUsers", datas,_id,role);
    console.log("reload data",data);
    console.log('_id',data._id)
  // const datas= removeView(_id)
  // console.log("reload data",datas);
   // socket.emit("timer",datas,date)
 //   socket.emit("getViewUsers", datas);
    // addViewingUser(data, _id,role);
    // io.emit("getViewUsers", viewingUser);
  });



  //event detail page viewing user
  socket.on("viewing", (data, _id,role,date) => {
    console.log("viewing",data, _id,role,date);
    addViewingUser(data, _id,role);
    io.emit("getViewUsers", viewingUser);
  });//act clartimeout unmount created at (currentTime-createTime) date-fns pkg
//removeuserevent user if not active remove it also check set time current time-active=15 then access
  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
  //  console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
   // console.log(users);
  });
});
app.use((err,req,res,next)=>{
  console.log(err)
  console.error(err.stack)
})
// run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Velozity App");
});

// app.listen(port, () => {
//   console.log(
//     `Velozity Server running is listening App listening on port ${port}`
//   );
// });
// server.listen(port, () => console.log(`Listening on port ${port}`));

console.log("port",port)
