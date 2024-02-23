#first things first, this is not right, I'll delete thid

#/signup
curl -X POST \
-d '{"password": "a123", "fname":"login", "lname": "Prince", "email": "test", "gender": "M"}' \
http://localhost:8000/signup