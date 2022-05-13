from cgi import print_environ_usage
import requests
import json
import csv
import re
import numpy as np

category_page_url = "http://localhost:5432/api/category"
book_page_url = "http://localhost:5432/api/book"
user_url = "http://localhost:5432/api/account/getAll"

category_file = "./data/ml/category.txt"
u_genre_file  = "./data/ml/u.genre.txt"
u_book_file = "./data/ml/u.item.txt"
u_user_file = "./data/ml/u.user.txt"
u_rating_file = "./data/ml/ua.test.txt"


headers = {"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36",
"authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjEiLCJ0eXBlIjoxLCJpYXQiOjE2NTI0Mzg2MTgsImV4cCI6MTY1MjQ0MjIxOH0.dEgZr_rigcrPUSx-ELMLSCtD-_kQHipKZirplmbMrTQ"}

global categories_global_list
global users_global_list


def crawl_category(category_list=[]):
    category_list = []
    response = requests.get(category_page_url, headers=headers)
    if (response.status_code == 200):
        # print(response);
        # category_list.append(response.text)
        global categories_global_list
        categories_global_list = response.json()
        # handle craw txt
        for item in response.json():
            category_list.append(item['name']+"|"+item['id'])
        # print("Crawl product: ", category_id, ": ", response.status_code)
    return category_list

def save_file(product_detail_list=[], file_name=None):
    file = open(file_name, "w+")
    str = "\n".join(product_detail_list)
    file.write(str)
    file.close()
    print("Save file: ", file_name)

def load_raw_category():
    file = open(category_file, "r")
    return file.readlines()

def generate_lines_that_equal(string, fp):
    i = 0
    for line in fp:
        i = i + 1
        # print("line",line)
        if string in line:
            yield i

def crawl_book(book_list=[]):
    book_list = []
    response = requests.get(book_page_url, headers=headers)
    if (response.status_code == 200):
        for item in response.json():
            # zeros_array = np(len(categories_global_list))
            # print(zeros_array)
            print(item['category'][0]['id'])
            zeros_list= [0]*len(categories_global_list)
            with open(u_genre_file, "r") as fp:
                for line in generate_lines_that_equal(item['category'][0]['id'], fp):
                    zeros_list[line-1]=1
            
            categories_string = '|'.join(str(item) for item in zeros_list)
            book_list.append(item['id']+"|"+item['name']+"|"+categories_string)
    return book_list


def crawl_user(user_list=[]):
    user_list = []
    response = requests.get(user_url, headers=headers)
    if (response.status_code == 200):
        global users_global_list
        users_global_list = response.json()
        for item in response.json():
            user_list.append(item['username']+"|"+str(item['name'])+"|"+str(item['telephone']))
        # print("Crawl product: ", category_id, ": ", response.status_code)
    else:
        print("Sth wrong when crawl user")
    return user_list

def generate_rating(rating_list=[]):
    rating_list = []
    # print(users_global_list[1])
    array = np.random.randint(5, size=(len(users_global_list),len(categories_global_list)))

    
    for index,rating_value in np.ndenumerate(array):

        username = str(users_global_list[index[0]]["username"])
        category_id = str(categories_global_list[index[1]]["id"])
        rating_list.append(username+"|"+category_id+"|"+str(rating_value))

    return rating_list
    # print(array)



# def update_genre(category):
#     e = json.loads(category)
#     if not e.get("id", False):
#         return None
#     # handle get some properties (fixed)
#     jsonData = {
#         "id": e['id'],
#         "name": e['name'],
#     }
#     # formatDataJson = jsonData.stringify(jsonData)
#     return jsonData

# def save_u_genre(format_category_list=[]):
#     file = open(u_genre_file, "w+")
#     str = "\n".join(format_category_list)
#     # print(str);
#     file.write(str)
#     file.close()
#     print("Save file: ", u_genre_file)


category_list = crawl_category()
save_file(category_list,u_genre_file)
category_data = load_raw_category()
# print(category_list)
# save category|id into u.genre

book_list = crawl_book()
save_file(book_list,u_book_file)

user_list = crawl_user()
save_file(user_list,u_user_file)

# Generate random
rating_list = generate_rating()
save_file(rating_list,u_rating_file)




# format_category_list = [update_genre(c) for c in category_data]
# save_u_genre(format_category_list)


# print(format_category_list)
