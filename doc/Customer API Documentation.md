<h1 align="center">API Documentation</h1>
<h1>Merchant Backend API Documentation</h1>

<!-- TOC start -->

<!-- TOC start -->

### [General Information](#general-information)

- [Base url for request](#base-url-for-request)
- [Authentication](#authentication)
- [Response Format](#response-format)

### [Common APIs](#common-apis)

- [1 Upload file](#1-upload-file)

### [1 Authentication APIs](#1-authentication-apis)

- [1.1 Register](#11-register)
- [1.2 Login](#12-login)
- [1.3 Edit Profile](#13-edit-profile)
- [1.4 Query user profile](#14-query-user-profile)
- [1.5 Update password](#15-update-password)

### [2 Business-Related APIs](#2-business-related-apis)

- [2.1 Get business](#21-get-business)
- [2.2 Page query business](#22-page-query-business)
  
  <!-- TOC end -->

## General Information

### Base url for request

```textile
TEST_BASE_URL = https://express-micro-gateway.vercel.app
```

### Authentication

Certain endpoints require a valid Bearer Token in the request header for authentication.

**Authentication Header Format:**

```textile
Authorization: Bearer <your_jwt_token>
```

### Response Format

All endpoints return JSON responses with the following structure:

```json
{
 "code": "string",
 "msg": "string",
 "data": {}
}
```

# Common APIs

---

## 1 Upload file

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/upload`

### Request Body

**Content-Type:** `multipart/form-data`

| Parameter | Type | Required | Description         |
| --------- | ---- | -------- | ------------------- |
| `file`    | file | Yes      | File to be uploaded |

### Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": "https://example.com/uploads/file_123456.jpg"
}
```

#### Response Parameters

| Parameter | Type   | Description              |
| --------- | ------ | ------------------------ |
| `data`    | string | URL of the uploaded file |

# 1 Authentication APIs

---

## 1.1 Register

## Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/auth/customer/register`

## Request Body

| Field      | Type   | Required | Description                                   |
| ---------- | ------ | -------- | --------------------------------------------- |
| `fullName` | string | Yes      | The name of the merchant contact person       |
| `email`    | string | Yes      | The merchant's email address (used for login) |
| `password` | string | Yes      | The merchant's password for account access    |

### Example Request Body

JSON

```json
{  "fullName": "John Doe",  
   "email": "merchant@example.com",  
   "password": "securePassword123"
}
```

## Response

JSON

```json
{  
  "code": "string",  
  "msg": "string",  
  "data": {    
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ..."  
  }
}
```

### Error Responses

- **'1000102'** - Email already in use

## 1.2 Login

## Request Details

**Method:** `POST` **URL:** `{{baseUrl}}/api/auth/customer/login`

## Request Body

The request requires a JSON payload with the following parameters:

| Parameter  | Type   | Required | Description                             |
| ---------- | ------ | -------- | --------------------------------------- |
| `email`    | string | Yes      | The merchant's registered email address |
| `password` | string | Yes      | The merchant's account password         |

### Example Request Body

JSON

```json
{  
  "email": "aa1@qq.com",  
  "password": "123456"
}
```

## Response

JSON

```json
{  
  "code": "0",  
  "msg": "Success",  
  "data": {    
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ..."  
  }
}
```

### Error Responses

- **'1000101'** - Invalid email or password

## 1.3 Edit Profile

### Request Details

- **Method:** `PUT`

- **Endpoint:** `{{baseUrl}}/api/auth/customer/update`

## Request Body Parameters

| Parameter   | Type   | Required | Description                                   |
| ----------- | ------ | -------- | --------------------------------------------- |
| `avatarUrl` | string | NO       | URL or identifier for the user's avatar image |
| `fullName`  | string | NO       | The user's full name                          |
| `phoneCode` | string | NO       | Country/region phone code (e.g., "+1", "+44") |
| `phone`     | string | NO       | Phone number without country code             |

**Example Request Body:**

JSON

```json
{   
  "avatarUrl": "avatar",  
  "fullName": "John Doe",  
  "phoneCode": "+1",  
  "phone": "1234567890"
}
```

## Response

JSON

```json
{  
  "code": "0",  
  "msg": "Success",  
  "data": {}
}
```

## 1.4 Query user profile

## Request Details

- **Method:** `GET`

- **Endpoint:** `{{baseUrl}}/api/auth/customer/user`

### Example Request Body

none

## Response

Response Parameters

| Parameter   | Type   | Description                                   |
| ----------- | ------ | --------------------------------------------- |
| `avatarUrl` | string | URL or identifier for the user's avatar image |
| `fullName`  | string | The user's full name                          |
| `phoneCode` | string | Country/region phone code (e.g., "+1", "+44") |
| `phone`     | string | Phone number without country code             |
| `fullPhone` | string | Complete phone number                         |
| `email`     | string | User's email address                          |

### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": {
 "avatarUrl": "avatar",
 "fullName": "bb",
 "phoneCode": "+11",
 "phone": "1234",
 "fullPhone": "1234",
 "email": "aa1@qq.com"
 }
} 
```

# 1.5 Update passoword

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/auth/customer/user`

### Request Body

| Parameter     | Type   | Required | Description      |
| ------------- | ------ | -------- | ---------------- |
| `oldPassword` | string | Yes      | Current password |
| `newPassword` | string | Yes      | New password     |

#### Example Request Body

```json
{
 "oldPassword": "123457",
 "newPassword": "123456"
}
```

### Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": null
}
```

# 2 Business-Related APIs

---

## 2.1 Get business

### Request Details

- **Method:** `GET`

- **Endpoint:** `{{baseUrl}}/api/biz/customer/business/get`

### Query Parameters

| Parameter | Type   | Required | Description                |
| --------- | ------ | -------- | -------------------------- |
| `id`      | string | Yes      | Business unique identifier |

### Response

#### Response Parameters

| Parameter       | Type    | Description                                 |
| --------------- | ------- | ------------------------------------------- |
| `id`            | string  | Business unique identifier                  |
| `merchantId`    | string  | Merchant identifier                         |
| `name`          | string  | Business name                               |
| `logoUrl`       | string  | Business logo URL                           |
| `website`       | string  | Business website URL                        |
| `location`      | string  | Business location address                   |
| `rooms`         | number  | Number of rooms                             |
| `chairs`        | number  | Number of chairs                            |
| `description`   | string  | Business description                        |
| `businessHours` | object  | Business hours configuration by day of week |
| `deleted`       | boolean | Whether the business is deleted             |
| `updateTime`    | number  | Last update timestamp in milliseconds       |
| `createTime`    | number  | Creation timestamp in milliseconds          |

#### BusinessHours Structure

The `businessHours` object contains properties for each day of the week (monday, tuesday, wednesday, thursday, friday, saturday, sunday). Each day is an array of time period objects with the following structure:

| Parameter   | Type   | Description                                        |
| ----------- | ------ | -------------------------------------------------- |
| `startTime` | string | Start time in "hh:mm aa" format (e.g., "09:00 am") |
| `endTime`   | string | End time in "hh:mm aa" format (e.g., "12:00 pm")   |

#### Success Response

```json
{
    "code": "0",
    "msg": "Success",
    "data": {
        "merchantId": "7397110941072101376",
        "name": "test",
        "logoUrl": "https://example.com/logo.png",
        "website": "https://example.com",
        "location": "北京市朝阳区xxx街道",
        "rooms": 5,
        "chairs": 50,
        "description": "这是一个商家描述",
        "businessHours": {
            "monday": [
                {
                    "startTime": "09:00 am",
                    "endTime": "12:00 pm"
                },
                {
                    "startTime": "06:00 pm",
                    "endTime": "10:00 pm"
                }
            ],
            "tuesday": [
                {
                    "startTime": "09:00 am",
                    "endTime": "12:00 pm"
                },
                {
                    "startTime": "06:00 pm",
                    "endTime": "10:00 pm"
                }
            ],
            "wednesday": [
                {
                    "startTime": "09:00 am",
                    "endTime": "12:00 pm"
                }
            ],
            "thursday": [
                {
                    "startTime": "09:00 am",
                    "endTime": "12:00 pm"
                }
            ],
            "friday": [
                {
                    "startTime": "09:00 am",
                    "endTime": "12:00 pm"
                }
            ],
            "saturday": [

            ],
            "sunday": [

            ]
        },
        "id": "1",
        "deleted": false,
        "updateTime": 1763866082163,
        "createTime": null
    }
}
```

## 2.2 Page query business

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/customer/business/page`

### Request Body

| Parameter  | Type   | Required | Description                  |
| ---------- | ------ | -------- | ---------------------------- |
| `name`     | string | No       | Business name (fuzzy search) |
| `pageNo`   | number | No       | Page number, starting from 1 |
| `pageSize` | number | No       | Number of items per page     |

#### Example Request Body

```json
{
 "name": null,
 "pageNo": 1,
 "pageSize": 1
}
```

### Response

#### Response Parameters

**Data Structure:**

| Parameter | Type   | Description                |
| --------- | ------ | -------------------------- |
| `list`    | array  | List of businesses         |
| `total`   | number | Total number of businesses |

**Business Item Structure:**

| Parameter       | Type   | Description                                 |
| --------------- | ------ | ------------------------------------------- |
| `id`            | string | Business unique identifier                  |
| `name`          | string | Business name                               |
| `logoUrl`       | string | Business logo URL                           |
| `website`       | string | Business website URL                        |
| `location`      | string | Business location address                   |
| `rooms`         | number | Number of rooms                             |
| `chairs`        | number | Number of chairs                            |
| `description`   | string | Business description                        |
| `businessHours` | object | Business hours configuration by day of week |

#### BusinessHours Structure

The `businessHours` object contains properties for each day of the week (monday, tuesday, wednesday, thursday, friday, saturday, sunday). Each day is an array of time period objects with the following structure:

| Parameter   | Type   | Description                                        |
| ----------- | ------ | -------------------------------------------------- |
| `startTime` | string | Start time in "hh:mm aa" format (e.g., "09:00 am") |
| `endTime`   | string | End time in "hh:mm aa" format (e.g., "12:00 pm")   |

#### Success Response

```json
{
    "code": "0",
    "msg": "Success",
    "data": {
        "list": [
            {
                "id": "7399369444537012224",
                "name": "test merchant",
                "logoUrl": "https://example.com/logo.png",
                "website": "https://example.com",
                "location": "city",
                "rooms": 5,
                "chairs": 50,
                "description": "desc",
                "businessHours": {
                    "monday": [
                        {
                            "startTime": "09:00 am",
                            "endTime": "12:00 pm"
                        },
                        {
                            "startTime": "06:00 pm",
                            "endTime": "10:00 pm"
                        }
                    ],
                    "tuesday": [
                        {
                            "startTime": "09:00 am",
                            "endTime": "12:00 pm"
                        },
                        {
                            "startTime": "06:00 pm",
                            "endTime": "10:00 pm"
                        }
                    ],
                    "wednesday": [
                        {
                            "startTime": "09:00 am",
                            "endTime": "12:00 pm"
                        }
                    ],
                    "thursday": [
                        {
                            "startTime": "09:00 am",
                            "endTime": "12:00 pm"
                        }
                    ],
                    "friday": [
                        {
                            "startTime": "09:00 am",
                            "endTime": "12:00 pm"
                        }
                    ],
                    "saturday": [

                    ],
                    "sunday": [

                    ]
                }
            }
        ],
        "total": 4
    }
}
```

# 3 Service-Related APIs

---

## 3.1 Page query service

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/customer/service/page`

### Request Body

| Parameter    | Type   | Required | Description                  |
| ------------ | ------ | -------- | ---------------------------- |
| `businessId` | string | Yes      | Business identifier          |
| `pageNo`     | number | No       | Page number, starting from 1 |
| `pageSize`   | number | No       | Number of items per page     |

#### Example Request Body

```json
{
 "businessId": "1",
 "pageNo": 1,
 "pageSize": 2
}
```

### Response

#### Response Parameters

**Data Structure:**

| Parameter | Type   | Description              |
| --------- | ------ | ------------------------ |
| `list`    | array  | List of services         |
| `total`   | number | Total number of services |

**Service Item Structure:**

| Parameter       | Type    | Description                           |
| --------------- | ------- | ------------------------------------- |
| `id`            | string  | Service unique identifier             |
| `businessId`    | string  | Business identifier                   |
| `merchantId`    | string  | Merchant identifier                   |
| `name`          | string  | Service name                          |
| `serviceTypeId` | string  | Service type identifier               |
| `duration`      | number  | Service duration in minutes           |
| `price`         | number  | Service price                         |
| `currency`      | string  | Currency code (e.g., "CNY")           |
| `chairs`        | number  | Number of chairs required             |
| `rooms`         | number  | Number of rooms required              |
| `description`   | string  | Service description                   |
| `imgUrl`        | string  | Service image URL                     |
| `isActive`      | boolean | Whether the service is active         |
| `deleted`       | boolean | Whether the service is deleted        |
| `createTime`    | number  | Creation timestamp in milliseconds    |
| `updateTime`    | number  | Last update timestamp in milliseconds |

#### Success Response

```json

```