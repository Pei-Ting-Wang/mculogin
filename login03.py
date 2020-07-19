import requests
import json
import getpass

loginUrl = 'https://uco-mcu.primo.exlibrisgroup.com/primaws/suprimaLogin'
queryUrl_01 = 'https://uco-mcu.primo.exlibrisgroup.com/primaws/rest/priv/myaccount/loans?bulk=10&lang=zh-tw&offset=1&type=active'
queryUrl_11 = 'https://uco-mcu.primo.exlibrisgroup.com/primaws/rest/priv/myaccount/loans?bulk=10&lang=zh-tw&offset=11&type=active'
queryUrl_21 = 'https://uco-mcu.primo.exlibrisgroup.com/primaws/rest/priv/myaccount/loans?bulk=10&lang=zh-tw&offset=21&type=active'
username = input("帳號:")
password = getpass.getpass("密碼:")

userData = {
    "authenticationProfile": "mcu_ldaps",
    "username": username,
    "password": password,
    "institution": "886UCO_MCU",
    "view": "886MCU_INST"
}
borrowData = {
    "count": 0,
    "title": [],
    "duedate": [],
}


def getLoginData(userData):
    response = requests.post(loginUrl, data=userData)
    token = json.loads(response.text)
    return {
        "token": token['jwtData'],
        "X-Persist": response.cookies['X-Persist']
    }


def queryLoanRecords(loginData, queryUrl_num):
    headers = {
        "Authorization": f'Bearer {loginData["token"]}',
        "cookie": f"X-Persist={loginData['X-Persist']}"
    }
    queryUrl = queryUrl_num
    return requests.get(queryUrl, headers=headers)


def borrowList(response):
    for r in range(len(response)):
        data = response[r].text
        borrow_data = json.loads(data)
        borrowData['count'] += len(borrow_data['data']['loans']['loan'])
        for i in range(len(borrow_data['data']['loans']['loan'])):
            borrowData['title'].append(borrow_data['data']['loans']['loan'][i]['title'])
            borrowData['duedate'].append(borrow_data['data']['loans']['loan'][i]['duedate'])

try:
    loginData = getLoginData(userData)
    response_01 = queryLoanRecords(loginData,queryUrl_01)
    response_11 = queryLoanRecords(loginData,queryUrl_11)
    response_21 = queryLoanRecords(loginData,queryUrl_21)
    response=[response_01,response_11,response_21]
    borrowList(response)
    if borrowData['count']==0:
        print("你沒有借書!!")
    else:
        print(borrowData['count'])
        for i in range(len(borrowData['title'])):
            print (str(i+1)+"."+borrowData['title'][i]+"到期日:"+borrowData['duedate'][i])
except:
    print("密碼錯誤!!")
        




