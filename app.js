const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const path=require("path");
const methodOverride=require("method-override")
app.get("/",(req,res)=>{
    res.send("hi i am root");
});
app.get("/testListing",async (req,res)=>{
    let sampleListing=new Listing({
        title:"my new Villa",
        description:"by the beach",
        price:1200,
        location:"Calangute,Goa",
        country:"India",
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");
})
app.listen(8080,()=>{
    console.log("server is listening to port 8080");

});
app.get("/listings",async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    })
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})
app.get("/listings")
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});
//create route
app.post("/listings",async (req,res)=>{
   // let {title,description,image,price,country,location}=req.body;
const newListing=new Listing(req.body.listing);
await newListing.save();
res.redirect("/listings");
})
//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
})
//update route
app.put("/lsitings/:id",async(req,res)=>{
    let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing})
res.redirect(`/listings/${id}`);
})