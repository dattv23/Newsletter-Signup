const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res){
    const firstname = req.body.fName;
    const lastname = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/ade2dded5b/";

    const options = {
        method: "POST",
        auth: "dat:f1e6699bb4b6ace486bbe6f1f9b4d32d-us17"
    }

    const request = https.request(url, options, function (responsive) {
        if (responsive.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        // responsive.on("data", function (data) {
        //     console.log(JSON.parse(data)); 
        // });
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/")
});

// API KEY: f1e6699bb4b6ace486bbe6f1f9b4d32d-us17
// ID: ade2dded5b

app.listen(process.env.POST || 3000, function(){
    console.log("Server is running on port 3000.");
})

