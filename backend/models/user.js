import mongoose from "mongoose";
 const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },

        email :{
            type: String,
            required : true,
            unique : true,
        },

        mobile : {
            type: String,
        },

        specialization : {
            type: String,
        },

        dob : {
            type:Date,
        },

        gender : {
            type : String,
        },

        address : {
            type : String,
        },

        username: {
            type:String,
            required : true,
            unique : true,
        },

        password : {
            type:String,
            required : true,
        },

        role : {
            type: String,
            enum: [
                "manager",
                "frontoffice",
                "seniordoctor",
                "juniordoctor",
                "nurse",
                "pharmacist",
            ],

            required : true,
        },

        status : {
            type: String,
            default : "Active",
        },
    },
    {
        timestamps: true,
    }
 );

 export default mongoose.model("User",userSchema);