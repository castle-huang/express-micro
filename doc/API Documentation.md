<h1 align="center">API Documentation</h1>

<h1>Merchant Backend API Documentation</h1>

<!-- TOC start -->

<!-- TOC -->

<!-- TOC -->

- [General Information](#general-information)
  - [Base url for request](#base-url-for-request)
  - [Authentication](#authentication)
  - [Response Format](#response-format)
- [Common APIs](#common-apis)
  - [Upload file](#upload-file)
- [1 Authentication APIs](#1-authentication-apis)
  - [1.1 Register](#11-register)
  - [1.2 Login](#12-login)
  - [1.3 Edit Profile](#13-edit-profile)
  - [1.4 Query user profile](#14-query-user-profile)
  - [1.5 Update password](#15-update-password)
  - [1.6 Send reset password email](#16-send-reset-password-email)
  - [1.7 Verify reset password code](#17-verify-reset-password-code)
  - [1.8 Reset password](#18-reset-password)
- [2 Business-Related APIs](#2-business-related-apis)
  - [2.1 Add new business](#21-add-new-business)
  - [2.2 Update business](#22-update-business)
  - [2.3 Query business list](#23-query-business-list)
  - [2.4 Delete business](#24-delete-business)
  - [2.5 Query Business dropdown list](#25-query-business-dropdown-list)
- [3 Service-Related APIs](#3-service-related-apis)
  - [3.1 Query service type list](#31-query-service-type-list)
  - [3.2 Add new service](#32-add-new-service)
  - [3.3 Update service](#33-update-service)
  - [3.4 Search service](#34-search-service)
  - [3.5 Query Service dropdown list](#35-query-service-dropdown-list)
  - [3.6 Delete service](#36-delete-service)
- [4 Staff-Related APIs](#4-staff-related-apis)
  - [4.1 Add new staff](#41-add-new-staff)
  - [4.2 Update staff](#42-update-staff)
  - [4.3 Query staff list](#43-query-staff-list)
  - [4.4 Query Staff dropdown list](#44-query-staff-dropdown-list)
  - [4.5 Delete staff](#45-delete-staff)
- [5 Calendar-Related APIs](#5-calendar-related-apis)
  - [5.1 Add new appointment](#51-add-new-appointment)
  - [5.2 Search Appointment](#52-search-appointment)
  - [5.3 Update appointment](#53-update-appointment)
  - [5.4 Delete appointment](#54-delete-appointment)
- [6 Dashboard-Related APIs](#6-dashboard-related-apis)
  - [6.1 Query dashboard data](#61-query-dashboard-data)
- [7 Order-Related APIs](#7-order-related-apis)
  - [7.1 Search order](#71-search-order)
- [8 Payment-Related APIs](#8-payment-related-apis)
  - [8.1 Create stripe account](#81-create-stripe-account)
  - [8.2 Create stripe account link](#82-create-stripe-account-link)
  - [8.3 Get stripe account status](#83-get-stripe-account-status)
  - [8.4 Create login link](#84-create-login-link)

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

- **Endpoint:** `{{baseUrl}}/api/auth/merchant/register`

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

**Method:** `POST` **URL:** `{{baseUrl}}/api/auth/merchant/login`

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

- **Endpoint:** `{{baseUrl}}/api/auth/merchant/user`

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

- **Endpoint:** `{{baseUrl}}/api/auth/merchant/user`

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

- **Endpoint:** `{{baseUrl}}/api/auth/merchant/user/update-pwd`

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

# 1.6 Send reset password email

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/auth/merchant/user/send-reset-pwd-email`

### Request Body

none

### Response

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

- **Endpoint:** `{{baseUrl}}/api/auth/merchant/user/verify-reset-pwd-code`

### Request Body

| Parameter | Type   | Required | Description                          |
| --------- | ------ | -------- | ------------------------------------ |
| `code`    | string | Yes      | Verification code received via email |

#### Example Request Body

```json
{
 "code": "924230"
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

- **Endpoint:** `{{baseUrl}}/api/auth/merchant/user/reset-pwd`

### Request Body

| Parameter    | Type   | Required | Description                                     |
| ------------ | ------ | -------- | ----------------------------------------------- |
| `resetToken` | string | Yes      | Reset password token obtained from verification |
| `password`   | string | Yes      | New password to set                             |

#### Example Request Body

```json
{
 "resetToken": "ffLKRYie",
 "password": "654321"
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

## 2.1 Add new business

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/business/add

### Request Body

| Parameter       | Type   | Required | Description                                 |
| --------------- | ------ | -------- | ------------------------------------------- |
| `name`          | string | Yes      | Business name                               |
| `logoUrl`       | string | Yes      | Business logo URL                           |
| `website`       | string | Yes      | Business website URL                        |
| `location`      | string | No       | Business location address                   |
| `rooms`         | number | Yes      | Number of rooms                             |
| `chairs`        | number | Yes      | Number of chairs                            |
| `description`   | string | No       | Business description                        |
| `businessHours` | object | No       | Business hours configuration by day of week |

#### BusinessHours Structure

The `businessHours` object contains properties for each day of the week (monday, tuesday, wednesday, thursday, friday, saturday, sunday). Each day is an array of time period objects with the following structure:

| Parameter    | Type   | Required | Description                     |
| ------------ | ------ | -------- | ------------------------------- |
| `start_time` | string | Yes      | Start time in "HH:MM am" format |
| `end_time`   | string | Yes      | End time in "HH:MM pm" format   |

#### Example Request Body

```json
{
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
                "start_time": "09:00 am",
                "end_time": "12:00 pm"
            },
            {
                "start_time": "06:00 pm",
                "end_time": "10:00 pm"
            }
        ],
        "tuesday": [
            {
                "start_time": "09:00 am",
                "end_time": "12:00 pm"
            },
            {
                "start_time": "06:00 pm",
                "end_time": "10:00 pm"
            }
        ],
        "wednesday": [
            {
                "start_time": "09:00 am",
                "end_time": "12:00 pm"
            }
        ],
        "thursday": [
            {
                "start_time": "09:00 am",
                "end_time": "12:00 pm"
            }
        ],
        "friday": [
            {
                "start_time": "09:00 am",
                "end_time": "12:00 pm"
            }
        ],
        "saturday": [],
        "sunday": []
    }
}
        ],
        "sunday": [

        ]
    }
}
```

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": null
}
```

## 2.2 Update business

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/business/update`

### Request Body

| Parameter       | Type   | Required | Description                                 |
| --------------- | ------ | -------- | ------------------------------------------- |
| `id`            | string | Yes      | Business unique identifier                  |
| `name`          | string | Yes      | Business name                               |
| `logoUrl`       | string | Yes      | Business logo URL                           |
| `website`       | string | Yes      | Business website URL                        |
| `location`      | string | Yes      | Business location address                   |
| `rooms`         | number | Yes      | Number of rooms                             |
| `chairs`        | number | Yes      | Number of chairs                            |
| `description`   | string | No       | Business description                        |
| `businessHours` | object | No       | Business hours configuration by day of week |

#### BusinessHours Structure

The `businessHours` object contains properties for each day of the week (monday, tuesday, wednesday, thursday, friday, saturday, sunday). Each day is an array of time period objects with the following structure:

| Parameter    | Type   | Required | Description                     |
| ------------ | ------ | -------- | ------------------------------- |
| `start_time` | string | Yes      | Start time in "HH:MM am" format |
| `end_time`   | string | Yes      | End time in "HH:MM pm" format   |

#### Example Request Body

```json
{
    "merchantId": "7889454",
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
                "start_time": "09:00 am",
                "end_time": "12:00 pm"
            },
            {
                "start_time": "06:00 pm",
                "end_time": "10:00 pm"
            }
        ],
        "tuesday": [
            {
                "start_time": "09:00 am",
                "end_time": "12:00 pm"
            },
            {
                "start_time": "06:00 pm",
                "end_time": "10:00 pm"
            }
        ],
        "wednesday": [
            {
                "start_time": "09:00 am",
                "end_time": "12:00 pm"
            }
        ],
        "thursday": [
            {
                "start_time": "09:00 am",
                "end_time": "12:00 pm"
            }
        ],
        "friday": [
            {
                "start_time": "09:00 am",
                "end_time": "12:00 pm"
            }
        ],
        "saturday": [],
        "sunday": []
    }
}
```

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": null
}
```

## 2.3 Query business list

### Request Details

- **Method:** `GET`

- **Endpoint:** `{{baseUrl}}/api/biz/business/list`

### Request Body

None

### Response

#### Response Parameters

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

| Parameter    | Type   | Description                  |
| ------------ | ------ | ---------------------------- |
| `start_time` | string | Start time in "HH:MM" format |
| `end_time`   | string | End time in "HH:MM" format   |
| `period`     | string | Time period type: "am", "pm" |

#### Success Response

```json
{
    "merchantId": "78994546",
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
                "start_time": "09:00 am",
                "end_time": "12:00 pm"
            },
            {
                "start_time": "06:00 pm",
                "end_time": "10:00 pm"
            }
        ],
        "tuesday": [
            {
                "start_time": "09:00 am",
                "end_time": "12:00 pm"
            },
            {
                "start_time": "06:00 pm",
                "end_time": "10:00 pm"
            }
        ],
        "wednesday": [
            {
                "start_time": "09:00 am",
                "end_time": "12:00 pm"
            }
        ],
        "thursday": [
            {
                "start_time": "09:00 am",
                "end_time": "12:00 pm"
            }
        ],
        "friday": [
            {
                "start_time": "09:00 am",
                "end_time": "12:00 pm"
            }
        ],
        "saturday": [],
        "sunday": []
    }
}
```

## 2.4 Delete business

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/business/delete`

### Request Body

| Parameter | Type   | Required | Description                |
| --------- | ------ | -------- | -------------------------- |
| `id`      | string | Yes      | Business unique identifier |

#### Example Request Body

```json
{
 "id": "7398186777426661376"
}
```

### Response

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": null
}
```

# 2.5 Query Business dropdown list

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/business/dropdown`

### Request Body

None

### Response

#### Response Parameters

| Parameter | Type   | Description                |
| --------- | ------ | -------------------------- |
| `id`      | string | Business unique identifier |
| `name`    | string | Business name              |

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": [
 {
 "id": "7399369444537012224",
 "name": "test merchant"
 },
 {
 "id": "1",
 "name": "test"
 }
 ]
}
```

# 3 Service-Related APIs

---

## 3.1 Query service type list

### Request Details

- **Method:** `GET`

- **Endpoint:** `{{baseUrl}}/api/biz/service/type/list`

### Request Body

none

### Response

#### Response Parameters

| Parameter | Type   | Description             |
| --------- | ------ | ----------------------- |
| `id`      | string | Service type identifier |
| `name`    | string | Service type name       |

#### Success Response

```json
{
    "code": "0",
    "msg": "Success",
    "data": [
        {
            "id": "1",
            "name": "hair"
        },
        {
            "id": "2",
            "name": "Spa"
        }
    ]
}
```

## 3.1 Add new service

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/service/add`

### Request Body

| Parameter       | Type   | Required | Description                 |
| --------------- | ------ | -------- | --------------------------- |
| `businessId`    | string | Yes      | Business identifier         |
| `name`          | string | Yes      | Service name                |
| `serviceTypeId` | string | Yes      | Service type identifier     |
| `duration`      | number | Yes      | Service duration in minutes |
| `price`         | number | Yes      | Service price               |
| `currency`      | string | Yes      | Currency code (e.g., "USD") |
| `chairs`        | number | Yes      | Number of chairs required   |
| `rooms`         | number | Yes      | Number of rooms required    |
| `description`   | string | No       | Service description         |

#### Example Request Body

```json
{
    "businessId": "1",
    "name": "hair srvice",
    "serviceTypeId": "haircut_001",
    "duration": 30,
    "price": 50,
    "currency": "CNY",
    "chairs": 1,
    "rooms": 0,
    "description": "desc"
}
```

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": null
}
```

## 3.2 Update service

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/service/update`

### Request Body

| Parameter       | Type   | Required | Description                 |
| --------------- | ------ | -------- | --------------------------- |
| `id`            | string | Yes      | Service unique identifier   |
| `businessId`    | string | Yes      | Business identifier         |
| `name`          | string | Yes      | Service name                |
| `serviceTypeId` | string | Yes      | Service type identifier     |
| `duration`      | number | Yes      | Service duration in minutes |
| `price`         | number | Yes      | Service price               |
| `currency`      | string | Yes      | Currency code (e.g., "CNY") |
| `chairs`        | number | Yes      | Number of chairs required   |
| `rooms`         | number | Yes      | Number of rooms required    |
| `description`   | string | No       | Service description         |

#### Example Request Body

```json
{
 "id": "7398200308268142592",
 "businessId": "1",
 "name": "hair srvice2",
 "serviceTypeId": "haircut_001",
 "duration": 30,
 "price": 50,
 "currency": "CNY",
 "chairs": 1,
 "rooms": 0,
 "description": "desc"
}
```

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": null
}
```

## 3.3 Search service

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/service/search`

### Request Body

| Parameter  | Type   | Required | Description                  |
| ---------- | ------ | -------- | ---------------------------- |
| `name`     | string | No       | Service name (fuzzy search)  |
| `pageNo`   | number | No       | Page number, starting from 1 |
| `pageSize` | number | No       | Number of items per page     |

#### Example Request Body

```json
{
 "name": "hair srvice",
 "pageNo": 1,
 "pageSize": 10
}
```

### Response Parameters

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
                "name": "hair srvice",
                "serviceTypeId": "haircut_001",
                "duration": 30,
                "price": 50,
                "currency": "CNY",
                "id": "7398200308268142592",
                "chairs": 1,
                "rooms": 0,
                "isActive": true,
                "deleted": false,
                "updateTime": 1763868405406,
                "createTime": 1763868405406,
                "merchantId": "7397110941072101376",
                "description": "desc"
            }
        ],
        "total": 1
    }
}
```

## 3.4 Query Service dropdown list

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/service/dropdown`

### Request Body

| Parameter    | Type   | Required | Description         |
| ------------ | ------ | -------- | ------------------- |
| `businessId` | string | Yes      | Business identifier |

#### Example Request Body

```json
{
 "businessId": "1"
}
```

### Response

#### Response Parameters

| Parameter | Type   | Description               |
| --------- | ------ | ------------------------- |
| `id`      | string | Service unique identifier |
| `name`    | string | Service name              |

#### Success Response

```json
{
    "code": "0",
    "msg": "Success",
    "data": [
        {
            "id": "7398200308268142592",
            "name": "hair srvice2"
        }
    ]
}
```

## 3.5 Delete service

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/service/delete`

### Request Body

| Parameter | Type   | Required | Description               |
| --------- | ------ | -------- | ------------------------- |
| `id`      | string | Yes      | Service unique identifier |

#### Example Request Body

```json
{
 "id": "7398186777426661376"
}
```

### Response

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": null
}
```

# 4 Staff-Related APIs

---

## 4.1 Add new staff

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/staff/add`

### Request Body

| Parameter    | Type   | Required | Description                            |
| ------------ | ------ | -------- | -------------------------------------- |
| `businessId` | string | Yes      | Business identifier                    |
| `name`       | string | Yes      | Staff member's name                    |
| `email`      | string | Yes      | Staff member's email address           |
| `phoneCode`  | string | No       | Country/region phone code (e.g., "11") |
| `phone`      | string | No       | Phone number without country code      |

#### Example Request Body

```json
{
 "businessId": "test",
 "name": "tet",
 "email": "bb@gmail.com",
 "phoneCode": "11",
 "phone": "1234"
}
```

### Response

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": null
}
```

## 4.2 Update staff

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/staff/update`

### Request Body

| Parameter    | Type   | Required | Description                            |
| ------------ | ------ | -------- | -------------------------------------- |
| `id`         | string | Yes      | Staff member unique identifier         |
| `businessId` | string | Yes      | Business identifier                    |
| `name`       | string | Yes      | Staff member's name                    |
| `email`      | string | Yes      | Staff member's email address           |
| `phoneCode`  | string | No       | Country/region phone code (e.g., "11") |
| `phone`      | string | No       | Phone number without country code      |

#### Example Request Body

```json
{
 "id": "1",
 "businessId": "test",
 "name": "tet2",
 "email": "bb@gmail.com",
 "phoneCode": "11",
 "phone": "1234"
}
```

### Response

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": null
}
```

## 4.3 Query staff list

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/staff/list`

### Request Body

| Parameter    | Type   | Required | Description                        |
| ------------ | ------ | -------- | ---------------------------------- |
| `businessId` | string | No       | Business identifier                |
| `name`       | string | No       | Staff member's name (fuzzy search) |

#### Example Request Body

```json
{
 "businessId": "test",
 "name": "tet2"
}
```

### Response

#### Response Parameters

| Parameter      | Type   | Description                    |
| -------------- | ------ | ------------------------------ |
| `id`           | string | Staff member unique identifier |
| `businessId`   | string | Business identifier            |
| `businessName` | string | Business name                  |
| `name`         | string | Staff member's name            |
| `email`        | string | Staff member's email address   |
| `fullPhone`    | string | Complete phone number          |
| `merchantId`   | string | Merchant identifier            |

#### Success Response

```json
{
  "code": "0",
  "msg": "Success",
  "data": [
    {
      "id": "1",
      "businessId": "test",
      "name": "tet2",
      "email": "bb@gmail.com",
      "phoneCode": "11",
      "phone": "1234""具体邮箱地址",
      "fullPhone": "111234",
      "merchantId": "test"
    }
  ]
}
```

## 4.4 Query Staff dropdown list

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/staff/dropdown`

### Request Body

| Parameter    | Type   | Required | Description         |
| ------------ | ------ | -------- | ------------------- |
| `businessId` | string | Yes      | Business identifier |

#### Example Request Body

```json
{
 "businessId": "test"
}
```

### Response

#### Response Parameters

| Parameter | Type   | Description             |
| --------- | ------ | ----------------------- |
| `id`      | string | Staff unique identifier |
| `name`    | string | Staff name              |

#### Success Response

```json
{
    "code": "0",
    "msg": "Success",
    "data": [
        {
            "id": "7397997197859622912",
            "name": "tet"
        },
        {
            "id": "1",
            "name": "tet2"
        }
    ]
}
```

## 4.5 Delete staff

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/staff/delete

### Request Body

| Parameter | Type   | Required | Description             |
| --------- | ------ | -------- | ----------------------- |
| `id`      | string | Yes      | Staff unique identifier |

#### Example Request Body

```json
{
 "id": "7398186777426661376"
}
```

### Response

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": null
}
```

# 5 Calendar-Related APIs

---

## 5.1 Add new appointment

## Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/appointment`

## Request Body

| Parameter         | Type   | Required | Description                                     |
| ----------------- | ------ | -------- | ----------------------------------------------- |
| `businessId`      | string | Yes      | Business identifier                             |
| `staffId`         | string | Yes      | Staff member identifier                         |
| `serviceId`       | string | Yes      | Service identifier                              |
| `customerName`    | string | Yes      | Customer's name                                 |
| `timeSlot`        | string | Yes      | Time slot for appointment (e.g., "14:00-15:00") |
| `appointmentTime` | number | Yes      | Appointment timestamp in milliseconds           |

### Example Request Body

JSON

```json
{
 "businessId": "test11",
 "staffId": "staff_67890",
 "serviceId": "serv_54321",
 "customerName": "张三",
 "timeSlot": "14:00-15:00",
 "appointmentTime": 1719820800000,
 "merchantId": "merchant_abc123"
}
```

## Response

### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": true
}
```

## 5.2 Search Appointment

## Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/appointment/search`

## Request Body

| Parameter              | Type   | Required | Description                                                             |
| ---------------------- | ------ | -------- | ----------------------------------------------------------------------- |
| `businessId`           | string | No       | Business identifier                                                     |
| `staffId`              | string | No       | Staff member identifier                                                 |
| `serviceId`            | string | No       | Service identifier                                                      |
| `appointmentStartTime` | number | No       | Start time range for filtering appointments (timestamp in milliseconds) |
| `appointmentEndTime`   | number | No       | End time range for filtering appointments (timestamp in milliseconds)   |

### Example Request Body

```json
{
 "businessId": "bus_12345",
 "staffId": "staff_67890",
 "serviceId": "serv_54321",
 "appointmentStartTime": 1719820800000,
 "appointmentEndTime": 1719824400000
}
```

## Response

Response Parameters

| Parameter         | Type   | Description                           |
| ----------------- | ------ | ------------------------------------- |
| `id`              | string | Appointment unique identifier         |
| `merchantId`      | string | Merchant identifier                   |
| `businessId`      | string | Business identifier                   |
| `staffId`         | string | Staff member identifier               |
| `serviceId`       | string | Service identifier                    |
| `customerName`    | string | Customer's name                       |
| `appointmentTime` | number | Appointment timestamp in milliseconds |
| `timeSlot`        | string | Time slot for appointment             |
| `updateTime`      | number | Last update timestamp in milliseconds |
| `createTime`      | number | Creation timestamp in milliseconds    |

```json
{
 "code": "0",
 "msg": "Success",
 "data": [
 {
 "id": "apt_123456",
 "merchantId": "merchant_abc123",
 "businessId": "bus_12345",
 "staffId": "staff_67890",
 "serviceId": "serv_54321",
 "customerName": "张三",
 "appointmentTime": 1719820800000,
 "timeSlot": "14:00-15:00",
 "updateTime": 1719734400000,
 "createTime": 1719648000000
 }
 ]
}
```

# 5.3 Update appointment

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/appointment/update`

### Request Body

| Parameter         | Type   | Required | Description                                     |
| ----------------- | ------ | -------- | ----------------------------------------------- |
| `id`              | string | Yes      | Appointment unique identifier                   |
| `businessId`      | string | Yes      | Business identifier                             |
| `staffId`         | string | Yes      | Staff member identifier                         |
| `serviceId`       | string | Yes      | Service identifier                              |
| `customerName`    | string | Yes      | Customer's name                                 |
| `timeSlot`        | string | Yes      | Time slot for appointment (e.g., "14:00-15:00") |
| `appointmentTime` | number | Yes      | Appointment timestamp in milliseconds           |

#### Example Request Body

```json
{
 "id": "7401589441942392832",
 "businessId": "7399369444537012224",
 "staffId": "7401588378145263616",
 "serviceId": "7401588151787065344",
 "customerName": "张三",
 "timeSlot": "14:00-15:00",
 "appointmentTime": 1719820800000
}
```

### Response

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": null
}
```

## 5.4 Delete appointment

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/appointment/delete`

### Request Body

| Parameter | Type   | Required | Description                   |
| --------- | ------ | -------- | ----------------------------- |
| `id`      | string | Yes      | Appointment unique identifier |

#### Example Request Body

```json
{
 "id": "1"
}
```

### Response

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": null
}
```

# 6 Dashboard-Related APIs

--- 

## 6.1 Query dashborad data

### Request Details

- **Method:** `GET`

- **Endpoint:** `{{baseUrl}}/api/report/dashboard`

### Request Body

none

### Response

#### Response Parameters

**Dashboard Data Structure:**

| Parameter                  | Type   | Description                          |
| -------------------------- | ------ | ------------------------------------ |
| `changeRevenue`            | number | Revenue change percentage            |
| `totalAppointment`         | number | Total number of appointments         |
| `customerRetention`        | number | Customer retention rate percentage   |
| `newCustomers`             | number | Number of new customers              |
| `recentBookedAppointments` | array  | List of recently booked appointments |
| `revenueTrends`            | array  | Revenue trends over time             |
| `bookingsService`          | array  | Bookings count by service            |

**Recent Booked Appointments Structure:**

| Parameter         | Type   | Description                           |
| ----------------- | ------ | ------------------------------------- |
| `id`              | string | Appointment unique identifier         |
| `customerName`    | string | Customer's name                       |
| `serviceName`     | string | Service name                          |
| `staffName`       | string | Staff member's name                   |
| `appointmentTime` | number | Appointment timestamp in milliseconds |
| `bookedAt`        | number | Booking timestamp in milliseconds     |

**Revenue Trends Structure:**

| Parameter | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| `date`    | string | Date period (e.g., "Jan 2024") |
| `revenue` | number | Revenue amount                 |

**Bookings Service Structure:**

| Parameter     | Type   | Description                        |
| ------------- | ------ | ---------------------------------- |
| `serviceName` | string | Service name                       |
| `bookings`    | number | Number of bookings for the service |

#### Success Response

```json
{
    "code": "0",
    "msg": "Success",
    "data": {
        "changeRevenue": 12.5,
        "totalAppointment": 42,
        "customerRetention": 85.3,
        "newCustomers": 18,
        "recentBookedAppointments": [
            {
                "id": "1",
                "customerName": "John Smith",
                "serviceName": "Haircut",
                "staffName": "Michael Johnson",
                "appointmentTime": 1700123456789,
                "bookedAt": 1699987654321
            }
        ],
        "revenueTrends": [
            {
                "date": "Jan",
                "revenue": 12500
            },
            {
                "date": "Feb",
                "revenue": 14200
            },
            {
                "date": "Mar",
                "revenue": 15800
            },
            {
                "date": "Apr",
                "revenue": 13600
            },
            {
                "date": "May",
                "revenue": 16800
            },
            {
                "date": "Jun",
                "revenue": 14900
            },
            {
                "date": "Jul",
                "revenue": 15200
            },
            {
                "date": "Aug",
                "revenue": 16100
            },
            {
                "date": "Sep",
                "revenue": 14700
            },
            {
                "date": "Oct",
                "revenue": 15300
            },
            {
                "date": "Nov",
                "revenue": 16900
            },
            {
                "date": "Dec",
                "revenue": 18200
            }
        ],
        "bookingsService": [
            {
                "serviceName": "Haircut",
                "bookings": 45
            },
            {
                "serviceName": "Hair Coloring",
                "bookings": 28
            },
            {
                "serviceName": "Perm",
                "bookings": 15
            },
            {
                "serviceName": "Hair Treatment",
                "bookings": 32
            },
            {
                "serviceName": "Styling",
                "bookings": 22
            }
        ]
    }
}
```

# 7 Order-Related APIs

---

## 7.1 Search order

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/biz/order/search`

### Request Body

| Parameter      | Type   | Required | Description                  |
| -------------- | ------ | -------- | ---------------------------- |
| `customerName` | string | No       | Customer name (fuzzy search) |
| `pageNo`       | number | No       | Page number, starting from 1 |
| `pageSize`     | number | No       | Number of items per page     |

#### Example Request Body

```json
{
 "customerName": "Tom",
 "pageNo": 1,
 "pageSize": 10
}
```

### Response

#### Response Parameters

**Data Structure:**

| Parameter | Type   | Description            |
| --------- | ------ | ---------------------- |
| `list`    | array  | List of orders         |
| `total`   | number | Total number of orders |

**Order Structure:**

| Parameter      | Type   | Description                                                         |
| -------------- | ------ | ------------------------------------------------------------------- |
| `id`           | string | Order unique identifier                                             |
| `merchantId`   | string | Merchant identifier                                                 |
| `businessId`   | string | Business identifier                                                 |
| `totalAmount`  | number | Total order amount                                                  |
| `customerName` | string | Customer's name                                                     |
| `phone`        | string | Customer's phone number                                             |
| `email`        | string | Customer's email address                                            |
| `serviceFee`   | number | Service fee                                                         |
| `orderTime`    | number | Order creation timestamp in milliseconds                            |
| `paymentTime`  | number | Payment timestamp in milliseconds                                   |
| `status`       | number | Order status (1: pending, 2: confirmed, 3: completed, 4: cancelled) |
| `orderItems`   | array  | List of order items                                                 |

**Order Item Structure:**

| Parameter         | Type   | Description                           |
| ----------------- | ------ | ------------------------------------- |
| `id`              | number | Order item unique identifier          |
| `appointmentTime` | number | Appointment timestamp in milliseconds |
| `serviceId`       | string | Service identifier                    |
| `serviceName`     | string | Service name                          |
| `staffId`         | string | Staff member identifier               |
| `staffName`       | string | Staff member's name                   |
| `customerName`    | string | Customer's name                       |
| `amount`          | number | Item total amount                     |
| `count`           | number | Number of bookings                    |
| `price`           | number | Unit price                            |
| `timeSlot`        | string | Time slot for appointment             |
| `createTime`      | number | Creation timestamp in milliseconds    |
| `updateTime`      | number | Last update timestamp in milliseconds |

#### Success Response

```json
{
    "code": "0",
    "msg": "Success",
    "data": {
        "list": [
            {
                "id": "7401600101803757568",
                "merchantId": "7397110941072101376",
                "businessId": "7399369444537012224",
                "totalAmount": 50,
                "customerName": "Tom",
                "phone": "13800138000",
                "email": "zhangsan@example.com",
                "serviceFee": 2.5,
                "orderTime": 1764678979350,
                "paymentTime": 1764678979350,
                "status": 1,
                "orderItems": [
                    {
                        "id": 7401600106862088000,
                        "appointmentTime": 1764762926000,
                        "serviceId": "7401588151787065344",
                        "serviceName": "hair srvice",
                        "staffId": "7401588378145263616",
                        "staffName": "staff_test",
                        "customerName": "Tom",
                        "amount": 50,
                        "count": 1,
                        "price": 50,
                        "timeSlot": "14:00-15:00",
                        "createTime": 1764678979350,
                        "updateTime": 1764678979350
                    }
                ]
            }
        ],
        "total": 1
    }
}
```

# 8 Payment-Related APIs

---

## 8.1 Create stripe account

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/payments/pay/create-stripe-account`

### Request Body

| Parameter      | Type   | Required | Description                              |
| -------------- | ------ | -------- | ---------------------------------------- |
| `country`      | string | Yes      | Country code (e.g., "US", "GB", "AU")    |
| `email`        | string | Yes      | Business email address                   |
| `businessType` | string | Yes      | Business type: "individual" or "company" |

#### Example Request Body

```json
{
 "country": "test",
 "email": "test@gmail.com",
 "businessType": "individual"
}
```

### Response

#### Response Parameters

| Parameter | Type    | Description             |
| --------- | ------- | ----------------------- |
| `id`      | string  | Stripe account ID       |
| `status`  | boolean | Account creation status |

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": {
   "id": "1998631288050810880",
   "status": true
 }
}
```

## 8.2 Create stripe account link

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/payments/pay/create-account-link`

### Request Body

| Parameter    | Type   | Required | Description                                    |
| ------------ | ------ | -------- | ---------------------------------------------- |
| `id`         | string | Yes      | Stripe account ID                              |
| `refreshUrl` | string | Yes      | URL to redirect if the link expires            |
| `returnUrl`  | string | Yes      | URL to redirect after account setup completion |

#### Example Request Body

```json
{
   "id": "1998631291045543936",
   "refreshUrl": "https://business.metryai.com",
   "returnUrl": "https://business.metryai.com"
}
```

### Response

#### Response Parameters

| Parameter | Type   | Description              |
| --------- | ------ | ------------------------ |
| `url`     | string | Stripe account setup URL |

#### Success Response

```json
{
    "code": "0",
    "msg": "Success",
    "data": {
        "url": "https://connect.stripe.com/setup/c/acct_1ScgHkQpJSEawOd5/CQ9IWlaU7rNf"
    }
}
```

## 8.3 Get stripe account status

### Request Details

- **Method:** `GET`

- **Endpoint:** `{{baseUrl}}/api/payments/pay/get-stripe-account-status`

### Request Body

none

### Response

#### Response Parameters

| Parameter | Type    | Description                                                  |
| --------- | ------- | ------------------------------------------------------------ |
| `id`      | string  | Stripe account ID                                            |
| `status`  | boolean | Account status (true: active, false: inactive or not set up) |

#### Success Response

```json
{
    "code": "0",
    "msg": "Success",
    "data": {
        "status": false,
        "id": 1998631291045544000
    }
}
```

## 8.4 Create login link

### Request Details

- **Method:** `POST`

- **Endpoint:** `{{baseUrl}}/api/payments/pay/create-login-link`

### Request Body

| Parameter | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| `id`      | string | Yes      | Stripe account ID |

#### Example Request Body

```json
{
 "id": "test"
}
```

### Response

#### Response Parameters

| Parameter | Type   | Description                |
| --------- | ------ | -------------------------- |
| `url`     | string | Stripe dashboard login URL |

#### Success Response

```json
{
 "code": "0",
 "msg": "Success",
 "data": {
   "url": "url"
 }
}
```