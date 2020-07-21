const app=require('express')();
let path=require('path');
const bodyParser=require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const axios = require('axios').default;
const qs = require('query-string');

let user;
let pass;
const userData = {
"authenticationProfile": "mcu_ldaps",
"username": user,
"password": pass,
"institution": "886UCO_MCU",
"view": "886MCU_INST"
};

const loginUrl = "https://uco-mcu.primo.exlibrisgroup.com/primaws/suprimaLogin";
const queryUrl = 'https://uco-mcu.primo.exlibrisgroup.com/primaws/rest/priv/myaccount/loans?bulk=10&lang=zh-tw&offset=1&type=active';
const port=3000;


app.get('/',function(req,res){
    console.log("Recieved GET request on [/] path.");
    res.sendFile(path.join(__dirname, 'login.html')); 
    //使用sendFile傳送html檔
});
app.post('/show',urlencodedParser,function(req,res){
    user=req.body.username;
    pass=req.body.password;
    console.log(user,pass)
    let borrowData=(async () => {
        console.log("running");
        try{
            const loginResponse = (await axios.post(loginUrl, qs.stringify(userData)));
            const token = loginResponse.data['jwtData']
            const [XPersist] = loginResponse.headers['set-cookie'].filter((cookie) => { return cookie.startsWith('X-Persist');});
            // console.log(token)
            //console.log(XPersist)
            const queryResponse = await axios.get(queryUrl, { headers: { Authorization: `Bearer ${token}`, cookie: XPersist }})
            return queryResponse.data['data']['loans']['loan'];
            
        }catch(err){
            console.log("err");
           
        }
    })();
    console.log(borrowData);
    res.send();
});

app.listen(port,function(){
    console.log("Listening on "+ port + " prot.")
})

