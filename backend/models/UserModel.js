const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const usermodel=new mongoose.Schema({
        name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
)
usermodel.pre('save',async function(next){

  if(this.isModified('password'))
  {
    const salt= await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);
  }

   next();

})
usermodel.methods.matchPassword=async function(enteredPassword)
  {
      return await bcrypt.compare(enteredPassword,this.password);
  }

const User=mongoose.model('Users',usermodel);

module.exports=User;