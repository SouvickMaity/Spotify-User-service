import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from './route.js'
import cors from "cors";

const app=express();
dotenv.config();

const connectDb = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL,{
      dbName: "Spotify",
    });
    console.log("Mongo Db Connected");
  } catch (error) {
    console.log(error);
  }
};

app.use(cors());
app.use(express.json());


app.use("/api/v1",userRoutes);


app.get("/",(req,res)=>{
    res.send("running");
})


const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`server is running on port:${port}`);
    connectDb();
});


