import csv
import secrets
import string
import requests

alphabet = string.ascii_uppercase + string.digits


def randPass(length):
    password = ''.join(secrets.choice(alphabet) for i in range(length))
    return password


if __name__ == "__main__":

    with open('./data.txt') as csv_file:

        csv_reader = csv.DictReader(csv_file, delimiter=',')
        categories_dictionary = dict()
        for user in csv_reader:
            name = user["name"].strip()
            email = user["email"].strip()
            password = randPass(8)
            print("{}, {}, {}".format(name, email, password))
            response = requests.post("http://localhost:5000/user/signup", {
                "name": name,
                "email": email,
                "password": password
            })
            # print(response.json())
