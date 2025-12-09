<h1 align="center">API Documentation</h1>
<h1>Customer Backend API Documentation</h1>

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
- [1.6 Send reset password email](#16-send-reset-password-email)
- [1.7 Verify reset password code](#17-verify-reset-password-code)
- [1.8 Reset password](#18-reset-password)

### [2 Business-Related APIs](#2-business-related-apis)

- [2.1 Get business](#21-get-business)
- [2.2 Page query business](#22-page-query-business)

### [3 Service-Related APIs](#3-service-related-apis)

- [3.1 Page query service](#31-page-query-service)

### [4 Order-Related APIs](#4-order-related-apis)

- [4.1 Place order](#41-place-order)

### [5 Appointment-Related APIs](#5-appointment-related-apis)

- [5.1 Query appointment records](#51-query-appointment-records)

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

## 1.5 Update passoword

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

## 1.6 Send reset password email

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/auth/customer/user/send-reset-pwd-email`

### Request Body

| Parameter | Type   | Required | Description              |
| --------- | ------ | -------- | ------------------------ |
| `email`   | string | Yes      | Customer's email address |

### Example Request Body

```json
{
    "email": "aa@163.com"
}
```

### Respaaonse

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": true
}
```

## 1.7 Verify reset password code

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/auth/customer/user/verify-reset-pwd-code`

### Request Body

| Parameter | Type   | Required | Description                          |
| --------- | ------ | -------- | ------------------------------------ |
| `code`    | string | Yes      | Verification code received via email |
| email     | string | Yes      | Customer's email address             |

#### Example Request Body

```json
{
  "code": "136140",
  "email": "aa@163.com"
}
```

### Response

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": {
 "resetPwdToken": "J0k4QJYW"
 }
}
```

#### Error Responses

##### Verification Failed

```json
{
 "code": "1009",
 "msg": "Verification code error",
 "data": {}
}
```

## 1.8 Reset password

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/auth/customer/user/reset-pwd`

### Request Body

| Parameter    | Type   | Required | Description                                     |
| ------------ | ------ | -------- | ----------------------------------------------- |
| `resetToken` | string | Yes      | Reset password token obtained from verification |
| `password`   | string | Yes      | New password to set                             |
| email        | string | Yes      |                                                 |

#### Example Request Body

```json
{
 "resetToken": "ffLKRYie",
 "password": "654321",
 "email": "aa@163.com"
}
```

### Response

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": {}
}
```

#### Error Responses

##### Reset Failed

```json
{
 "code": "1000104",
 "msg": "Password reset failed",
 "data": {}
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
{
    "code": "0",
    "msg": "Success",
    "data": {
        "list": [
            {
                "businessId": "1",
                "name": "hair srvice2",
                "serviceTypeId": "haircut_001",
                "duration": 30,
                "price": 50,
                "currency": "CNY",
                "id": "7398200308268142592",
                "chairs": 1,
                "rooms": 0,
                "isActive": true,
                "deleted": false,
                "updateTime": 1764582490035,
                "createTime": 1763868405406,
                "merchantId": "7397110941072101376",
                "description": "desc",
                "imgUrl": "https://example.com/logo.png"
            }
        ],
        "total": 1
    }
}
```

# 4 Order-Related APIs

---

## 4.1 Place order

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/customer/order/place-order`

### Request Body

| Parameter         | Type   | Required | Description                                     |
| ----------------- | ------ | -------- | ----------------------------------------------- |
| `businessId`      | string | Yes      | Business identifier                             |
| `appointmentTime` | number | Yes      | Appointment timestamp in milliseconds           |
| `timeSlot`        | string | Yes      | Time slot for appointment (e.g., "14:00-15:00") |
| `fullName`        | string | Yes      | Customer's full name                            |
| `phone`           | string | Yes      | Customer's phone number                         |
| `email`           | string | Yes      | Customer's email address                        |
| `services`        | array  | Yes      | List of services to book                        |

#### Services Structure

| Parameter   | Type   | Required | Description                |
| ----------- | ------ | -------- | -------------------------- |
| `serviceId` | string | Yes      | Service unique identifier  |
| `count`     | number | Yes      | Number of service bookings |

#### Example Request Body

```json
{
    "businessId": "7399369444537012224",
    "appointmentTime": 1764762926000,
    "timeSlot": "14:00-15:00",
    "fullName": "Tom",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "services": [
        {
            "serviceId": "7401588151787065344",
            "count": 1
        }
    ]
}
```

### Response

#### Response Parameters

| Parameter | Type   | Description             |
| --------- | ------ | ----------------------- |
| `orderId` | string | Order unique identifier |

#### Success Response

```json
{
    "code": "0",
    "msg": "Success",
    "data": {
        "orderId": "7401600101803757568"
    }
}
```

# 5 Appointment-Related APIs

---

## 5.1 Query appointment records

### Request Details

- **Method:** `GET`

- **Endpoint:** `{{baseUrl}}/api/biz/customer/appointment`

### Request Body

无

### Response

#### Response Parameters

| Parameter         | Type   | Description                                     |
| ----------------- | ------ | ----------------------------------------------- |
| `id`              | string | Appointment unique identifier                   |
| `staffId`         | string | Staff member identifier                         |
| `staffName`       | string | Staff member's name                             |
| `serviceId`       | string | Service identifier                              |
| `serverName`      | string | Service name                                    |
| `customerName`    | string | Customer's name                                 |
| `appointmentTime` | number | Appointment timestamp in milliseconds           |
| `timeSlot`        | string | Time slot for appointment (e.g., "14:00-15:00") |
| `imgUrl`          | string | Service image URL                               |

#### Success Response

```json
{
    "code": "0",
    "msg": "Success",
    "data": [
        {
            "id": "7401598200479617024",
            "staffId": "7401588378145263616",
            "staffName": "staff_test",
            "serviceId": "7401588151787065344",
            "serverName": "hair srvice",
            "customerName": "Tom",
            "appointmentTime": 1764762926000,
            "timeSlot": "14:00-15:00",
            "imgUrl": "https://example.com/logo.png"
        }
    ]
}
```