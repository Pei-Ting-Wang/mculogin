import requests
import json
import getpass

loginUrl = 'https://uco-mcu.primo.exlibrisgroup.com/primaws/suprimaLogin'
queryUrl = 'https://uco-mcu.primo.exlibrisgroup.com/primaws/rest/priv/myaccount/loans?bulk=10&lang=zh-tw&offset=1&type=active'

username=input("帳號:")
password=getpass.getpass("密碼:")

def readUserDataJson(username,password):
    with open('userdata.json' , 'r') as file: 
        userdata=json.loads(file.read())
        userdata['username']=username
        userdata['password']=password
        return userdata

def getLoginData(userData):
    response = requests.post(loginUrl, data = userData)
    token=json.loads(response.text)
    return {
        "token": token['jwtData'],
        "X-Persist": response.cookies['X-Persist']
    }

def queryLoanRecords(loginData):
    headers={
        "Authorization": f'Bearer {loginData["token"]}', 
        "cookie": f"X-Persist={loginData['X-Persist']}"
    } 
    return requests.get(queryUrl, headers = headers)

userData = readUserDataJson(username,password)
loginData = getLoginData(userData)
response = queryLoanRecords(loginData)
print(response.text)