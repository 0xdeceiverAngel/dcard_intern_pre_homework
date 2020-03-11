import requests
import time

while(1):
    try:
        r = requests.get('http://127.0.0.1')
        print(r.text)
        r = requests.get('http://127.0.0.1/draw')
        print(r.text)
        r = requests.get('http://127.0.0.1/alldata')
        print(r.text)
        time.sleep(2)
    except:
        None