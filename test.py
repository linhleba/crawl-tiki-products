import json
import csv
import re
import requests
import json
import ast


url = "https://api.themoviedb.org/3/movie/550?api_key=ce69864d6bf2d8c310737e66f4e7a4f3"

response = requests.request("GET", url)


# mystring = json.dumps(response.text)
# print(mystring)
string = '{a:3,b:4}'
# json_data = json.loads(json.dumps(response.text))
json_data = json.loads()
# formatDataJson = json_data.stringify(response.text)


# print(json_data)


def save_product_list(data):
    file = open("./out.csv", "w")
    csv_writer = csv.writer(file)

    count = 0
    for p in data:
        if p is not None:
            if count == 0:
                header = p.keys()
                csv_writer.writerow(header)
                count += 1
            csv_writer.writerow(p.values())
    file.close()
    print("Save file: ", "./out.csv")


save_product_list(json_data)