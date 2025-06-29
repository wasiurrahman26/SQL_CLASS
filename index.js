const { faker } = require('@faker-js/faker');
const mysql=require('mysql2');
const express=require("express");
const app=express();
const port=8080;
const path=require("path");
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');
app.use(methodOverride('_method'));

app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'college',
  password: 'Wasi'
});
app.get("/",(req,res)=>{
  let q=`SELECT COUNT(*) FROM USER`;
  try{
  connection.query(q,(err,result)=>{
  if(err)
  {
    throw err;
  }
  let count=result[0]['COUNT(*)'];
  res.render("home.ejs",{count});
});
} catch{
  res.send("some error");
}
app.get("/user",(req,res)=>{
  let q=`SELECT * FROM USER`;
  try{
  connection.query(q,(err,users)=>{
  if(err)
  {
    throw err;
  }
  
  res.render("user.ejs",{users});
});
} catch{
  res.send("some error");
}
})

 
})
app.get("/user/:id/edit",(req,res)=>{
   let {id}=req.params;
  let q=`SELECT * FROM USER WHERE id='${id}'`;
    try{
  connection.query(q,(err,result)=>{
  if(err)
  {
    throw err;
  }
  let user=result[0];
 res.render("edit.ejs",{user});
});
} catch{
  res.send("some error");
}
  
  
})
app.patch("/user/:id",(req,res)=>{
  
   let {id}=req.params;
   let {user:formuser,password:newpassword}=req.body;
  let q=`SELECT * FROM USER WHERE id='${id}'`;
    try{
  connection.query(q,(err,result)=>{
  if(err)
  {
    throw err;
  }
  let user=result[0];
  if(user.password !=newpassword)
  {
    res.send("wrong password");
  }
  else{
   let q2=`UPDATE user SET user='${formuser}' WHERE id='${id}'`;
      connection.query(q2, (err,result)=>{
      if(err) throw err;
      
      res.redirect("/user");
   });
   
  }
});
} catch{
  res.send("some error");
}
})
app.get("/user/:id/delete",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`;
   try{
  connection.query(q,(err,result)=>{
  if(err)
  {
    throw err;
  }
  let user=result[0];
 res.render("deleteform.ejs",{user});
});
} catch{
  res.send("some error");
}

})
app.delete("/user/:id",(req,res)=>{
   let {id}=req.params;
   let {password:oldpassword}=req.body;
  let q=`SELECT * FROM user WHERE id='${id}'`;
   try{
  connection.query(q,(err,result)=>{
  if(err)
  {
    throw err;
  }
  let user=result[0];
  if(user.password != oldpassword)
  {
    res.send("wrong pasword");
  }
  else{
  let q3=`DELETE FROM user WHERE id='${id}'`;
  connection.query(q3,(err,result)=>{
    if(err) throw err;
   res.redirect("/");
  })
    
  }
 
});
} catch{
  res.send("some error");
}
})
app.get("/user/add",(req,res)=>{
  res.render("added.ejs");
})
app.post("/user/add",(req,res)=>{
   let { user, email, password } = req.body;
  let id = uuidv4();
  //Query to Insert New User
  let q = `INSERT INTO user (id, user, email, password) VALUES ('${id}','${user}','${email}','${password}') `;


  
   try{
  connection.query(q,(err,result)=>{
  if(err)
  {
    throw err;
  }
  res.redirect("/user");
 
 
});
} catch{
  res.send("some error");
}
})

app.listen(port,()=>{
  console.log("server is listning on port 8080");
})








