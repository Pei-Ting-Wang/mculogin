const app = require('express')();
let path = require('path');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const axios = require('axios').default;
const qs = require('query-string');

let user;
let pass;

const loginUrl = "https://uco-mcu.primo.exlibrisgroup.com/primaws/suprimaLogin";
const queryUrl = 'https://uco-mcu.primo.exlibrisgroup.com/primaws/rest/priv/myaccount/loans?bulk=10&lang=zh-tw&offset=1&type=active';
const port = 3000;


app.get('/', function (req, res) {
    console.log("Recieved GET request on [/] path.");
    res.sendFile(path.join(__dirname, 'login.html'));
    //使用sendFile傳送html檔
});
app.post('/', urlencodedParser, async (req, res) => {
    user = req.body.username;
    pass = req.body.password;
    const userData = {
        "authenticationProfile": "mcu_ldaps",
        "username": user,
        "password": pass,
        "institution": "886UCO_MCU",
        "view": "886MCU_INST"
    };
    try {
        const loginResponse = (await axios.post(loginUrl, qs.stringify(userData)));
        const token = loginResponse.data['jwtData']
        console.log(token)
        const [XPersist] = loginResponse.headers['set-cookie'].filter((cookie) => { return cookie.startsWith('X-Persist'); });
        console.log(XPersist)
        const queryResponse = await axios.get(queryUrl, { headers: { Authorization: `Bearer ${token}`, cookie: XPersist } })
        console.log(queryResponse.data['data']['loans']['loan']);
        res.send("<h1>"+"登入成功"+"</h1>");
    } catch (err) {
        console.log(err)
        console.log("err");
        res.send("<h1>"+"登入失敗"+"</h1>");

    }
    // console.log(borrowData);
    res.send();
});

app.listen(port, function () {
    console.log("Listening on " + port + " port.")
})
