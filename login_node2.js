const axios = require('axios').default;
const qs = require('query-string');

const userData = {
    "authenticationProfile": "mcu_ldaps",
    "username": "06130035",
    "password": "penny06130035",
    "institution": "886UCO_MCU",
    "view": "886MCU_INST"
};

const loginUrl = "https://uco-mcu.primo.exlibrisgroup.com/primaws/suprimaLogin";
const queryUrl = 'https://uco-mcu.primo.exlibrisgroup.com/primaws/rest/priv/myaccount/loans?bulk=10&lang=zh-tw&offset=1&type=active';

(async () => {
    try {
        const loginResponse = (await axios.post(loginUrl, qs.stringify(userData)));
        const token = loginResponse.data['jwtData']
        const XPersist = loginResponse.headers['set-cookie'].filter((cookie) => { return cookie.startsWith('X-Persist'); });
        // console.log(token)
        console.log(XPersist)
        const queryResponse = await axios.get(queryUrl, { headers: { Authorization: `Bearer ${token}`, cookie: XPersist } })
        //console.log(queryResponse.data['data']['loans']['loan'])
    } catch (err) {

    }
})()