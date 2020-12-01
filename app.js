const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname+"/signup.html");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
});

app.post("/", function(req, res){
  var apiKey = "3b09b0a075b94ea0d9e2a762f42b1d4a-us7";
  const fname = req.body.firstName;
  const lname = req.body.lastName;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        }
      }

    ]
  }

  const jsonData = JSON.stringify(data);

  const url = "https://us7.api.mailchimp.com/3.0/lists/e8056c4b01";
  const options = {
      method: "POST",
      auth: "jont:3b09b0a075b94ea0d9e2a762f42b1d4a-us7"
  };

  const request = https.request(url, options, function(response){
    if(response.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req,res){
  res.redirect("/");
});
//list id
//e8056c4b01
