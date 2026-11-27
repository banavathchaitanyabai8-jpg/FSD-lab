import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const app=express();
app.use(express.json());
const PORT=process.env.PORT || 8000;
const dbUrl=process.env.MONGO_URI;
const dbname=process.env.DB_NAME;
mongoose.connect(dbUrl,{
    dbName:dbname,
}).then(()=>{
    console.log("Database connected successfully");
}).catch((err)=>{
    console.log("Database connection failed",err);
});
const moviesSchema=new mongoose.Schema({
    title:{type:String,required:true},
    director:{type:String,required:true},
    year:{type:Number,required:true},
    category:{type:String,required:true},
});
const Movie=mongoose.model("Movie",moviesSchema);
//create a new movie
app.post("/api/v1/movies",async(req,res)=>{
    const newMovie=req.body;
    Movie.create(newMovie).then((result)=>{
        res.status(201).json({message:"Movie created successfully", data:result});
    }).catch((err)=>{
        res.status(500).json({err:err,message:"failed to create movie"});
    });
});
//get all movies and filter by category
app.get("/api/v1/movies",async(req,res)=>{
    const {category}=req.query;
    const query=category?{category}:{};
    Movie.find(query).then((result)=>{
        res.status(200).json({message:"Movies fetched successfully",data:result});
    }).catch((err)=>{
        res.status(500).json({err:err,message:"failed to fetch movies"});
    });
});
//get movie by id
app.get("/api/v1/movies/:id",async(req,res)=>{
    const {id}=req.params;
    Movie.findById(id).then((result)=>{
        res.status(200).json({message:"Movie fetched successfully",data:result});
    }).catch((err)=>{
        res.status(500).json({err:err,message:"Movie not found"});
    });
});
//update movie by id
app.put("/api/v1/movies/:id",async(req,res)=>{
    const {id}=req.params;
    const updatedMovie=req.body;
    Movie.findByIdAndUpdate(id,updatedMovie,{new:true}).then((result)=>{
        if(result){
            res.status(200).json({message:"Movie updated successfully",data:result});
        }else{
            res.status(404).json({message:"Movie not found"});
        }
    }).catch((err)=>{
        res.status(500).json({err:err,message:"failed to update movie"});
    });
});
//delete movie by id
app.delete("/api/v1/movies/:id",async(req,res)=>{
    const {id}=req.params;
    Movie.findByIdAndDelete(id).then((result)=>{
        if(result){
            res.status(200).json({message:"Movie deleted successfully",data:result});
        }else{
            res.status(404).json({message:"Movie not found"});
        }
    }).catch((err)=>{
        res.status(500).json({err:err,message:"failed to delete movie"});
    });
});
//test route
app.get("/",(req,res)=>{ 
    res.status(200).json({message:"Welcome to the movie API"});
});
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});