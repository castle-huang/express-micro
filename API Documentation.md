<h1 align="center">API Documentation</h1>
<h1>Merchant Backend API Documentation</h1>

## General Information

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

# Authentication  APIs

---

# 1. New Appointment

# 1. Register

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

# 2. Login

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

# 3. Update merchant user

### Request Details

- **Method:** `PUT`

- **Endpoint:** `{{baseUrl}}/api/auth/merchant/update`

## Request Body Parameters

| Parameter   | Type   | Required | Description                                   |
| ----------- | ------ | -------- | --------------------------------------------- |
| `id`        | string | YES      | The unique identifier of the user             |
| `avatarUrl` | string | NO       | URL or identifier for the user's avatar image |
| `fullName`  | string | NO       | The user's full name                          |
| `phoneCode` | string | NO       | Country/region phone code (e.g., "+1", "+44") |
| `phone`     | string | NO       | Phone number without country code             |
| `email`     | string | YES      | User's email address                          |

**Example Request Body:**

JSON

```json
{  
  "id": "string",  
  "avatarUrl": "avatar",  
  "fullName": "John Doe",  
  "phoneCode": "+1",  
  "phone": "1234567890", 
  "email": "john.doe@example.com"
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

# 4. Query merchant user

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





# Calendar-Related APIs

---

# 1. Add new appointment

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



# 2. Query Appointment

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



# 