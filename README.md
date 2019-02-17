# movie-lists

<!-- TOC -->

- [movie-lists](#movie-lists)
  - [Description](#description)
  - [Docs](#docs)
  - [Backend](#backend)
    - [Libraries](#libraries)
    - [Cookies](#cookies)
    - [Endpoints](#endpoints)
      - [tests](#tests)
        - [get /tests](#get-tests)
        - [post /tests/add](#post-testsadd)
      - [users](#users)
        - [get /users](#get-users)
      - [post /users/signup](#post-userssignup)
        - [post /users/login](#post-userslogin)
      - [lists](#lists)
  - [Frontend](#frontend)

<!-- /TOC -->

## Description

decode final project (Denis, Konrad, Jonathan)

## Docs

[Goodle doc](https://docs.google.com/document/d/1URSVsR-8AnsH6TIttTHO3VzwFVnCy02FoL5B8xFF9T4/edit)

[Github repository](https://github.com/code-magi/movie-lists)

## Backend

Server port: 5050

### Libraries

express, MongoClient, MongoDB by mLab,

### Cookies

Session id generator to a digit from 10mln to 99,999mln

Name: `__sid__`
Value: `77003076`
Expired: `never`

### Endpoints

#### tests

##### get /tests

url: http://localhost:5050/tests
method: get
body: none

*response*:

```JSON
{
    "success": true,
    "tests": [
        {
            "_id": "5c5f76a8bfc646349070c2d4",
            "name": "Forrest",
            "surname": "Gump"
        },
        {
            "_id": "5c66f9311621e129c25ccbfa",
            "name": "Buzz",
            "surname": "Lightyear"
        }
    ]
}
```

##### post /tests/add

url: http://localhost:5050/tests/add
method: post
body:  

```JSON
{
  "name": "Buzz",
  "surname": "Lightyear"
}
```

*response*:

```JSON
{
    "success": true,
    "message": "test added",
    "doc": {
        "n": 1,
        "opTime": {
            "ts": "6658289882600833025",
            "t": 1
        },
        "electionId": "7fffffff0000000000000001",
        "ok": 1,
        "operationTime": "6658289882600833025",
        "$clusterTime": {
            "clusterTime": "6658289882600833025",
            "signature": {
                "hash": "lz4i5xB7ArylNevlRM0zqArcs8s=",
                "keyId": "6656070557034872833"
            }
        }
    }
}
```

#### users

##### get /users

url: http://localhost:5050/users
method: get
body: none

*response*:

```JSON
{
    "success": true,
    "users": [
        {
            "_id": "5c670254552be03f4005fcd2",
            "email": "den@gmail.com",
            "password": "123"
        }
    ]
}
```

#### post /users/signup

url: http://localhost:5050/users/signup
method: post
body:  

```JSON
{
  "email": "den@gmail.com",
  "password": "123"
}
```

*response*:

Cookie: __sid__:

```JSON
{
    "success": true,
    "message": "user added",
    "doc": {
        "n": 1,
        "opTime": {
            "ts": "6658320518602555393",
            "t": 1
        },
        "electionId": "7fffffff0000000000000001",
        "ok": 1,
        "operationTime": "6658320518602555393",
        "$clusterTime": {
            "clusterTime": "6658320518602555393",
            "signature": {
                "hash": "1nTYbjTK4zksxBzm/UmoeO9wlEs=",
                "keyId": "6656070557034872833"
            }
        }
    }
}
```

##### post /users/login

url: http://localhost:5050/users/login
method: post
body:  

```JSON
{
  "email": "den@gmail.com",
  "password": "123"
}
```

*response*:

Cookie: __sid__:

```JSON
{
    "success": true,
    "message": "Logged in successfully"
}
```

#### lists

## Frontend

Dev Client port: 3080
