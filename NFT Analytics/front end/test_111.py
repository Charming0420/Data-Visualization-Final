import requests, time, re
from selenium import webdriver #自動化測試工具
import json
from bs4 import BeautifulSoup
import csv
import sys

address = str(sys.argv[1])
#address = '0xbCe3781ae7Ca1a5e050Bd9C4c77369867eBc307e'

browser = webdriver.Chrome()
url = 'https://www.gem.xyz/collection/'+address
browser.get(url)
prev_sel = None
dict = {
    'name':[],
    'price': []
}
for i in range(7):
    
    html = browser.page_source
    soup = BeautifulSoup(html, features='html.parser')
    sel = soup.select("div.p-2 div.gap-2 div.truncate")
    #print(sel)
    # if prev_sel in sel:
    #     sel = sel[sel.index(prev_sel):]
        
    # prev_sel = sel[-2]
    
    for s in range(1,len(sel),2):
        if(sel[s-1].text) in dict['name']:
            continue
        else:
            dict['name'].append(sel[s-1].text)
            dict["price"].append(sel[s].text)
    
    browser.execute_script('window.scrollTo(0, document.body.scrollHeight);')
    time.sleep(1)
#取HTML標中的 <div  class="title-row"></div> 中的<a>標籤存入sel
# sel = soup.select("div.nbcp")
# print(sel)

del dict['name'][-1]
del dict['price'][-1]
set_lst = set(dict["name"])
# if (len(set_lst)==len(dict["name"])):
#     print('okay')

#轉換資料型態
dict['price'][:] = [float(x) for x in dict['price']]


#轉csv
# with open('maintest.csv', 'w', newline='') as csvfile:
#     header_key = ['name', 'price']
#     new_val = csv.DictWriter(csvfile, fieldnames=header_key)
#     new_val.writeheader()
#     for new_k in range(0,len(dict['name'])):
#         new_val.writerow({'name':dict['name'][new_k], 'price': dict['price'][new_k]})

#轉json
json_object = json.dumps(dict, indent = 4) 
print(json_object)