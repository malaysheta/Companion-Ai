import requests

url = "http://127.0.0.1:8000/manual_query"
data = {
  "query": "where is the battery",
  "company_name": "TestCompany",
  "product_name": "TestProduct",
  "product_code": "123",
  "top_k": 5
}
headers = {} # Need token? Let's check the endpoint
response = requests.post(url, json=data, headers=headers)
print(response.status_code)
print(response.text)
