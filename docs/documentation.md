# **API documentation** 📄

## Table of content

- **[Authentication](#authentication)**
  - [Login](#login)
  - [Current User Info](#current-user-info)
  - [Update Photo](#update-photo)
  - [Update Information](#update-information)
  - [Update User Status To Online](#update-user-status-to-online)
  - [Update User Status To Offline](#update-user-status-to-offline)
- **[Users](#users)**
  - [Get All Users](#get-all-users)
  - [Get Online Users](#get-online-users)
  - [Get Offline Users](#get-offline-users)
- **[Rooms](#rooms)**
  - [Create New Room](#create-new-room)
  - [Get Available Rooms](#get-available-rooms)
  - [Get Current User Rooms](#get-current-user-rooms)
  - [Get Single Room](#get-single-rooms)
- **[Room Owner](#room-owner)**
  - [Update room information](#update-room-information)
  - [Update room photo](#update-room-photo)
  - [Add Moderator](#add-moderator)
  - [Remove Moderator](#remove-moderator)
  - [Add Member](#add-member)
  - [Remove Member](#remove-member)
- **[Members](#members)**
  - [Get Room Members](#get-room-members)
  - [Join Room](#join-room)
  - [Left Room](#left-room)
- **[Messages](#messages)**
  - [Get Room Messages](#get-room-messages)
  - [Add New Message](#add-new-message)
  - [Update Message](#update-message)
  - [Delete Message](#delete-message)
  - [Get Unread Messages](#get-unread-messages)
  - [Reset Unread Messages](#reset-unread-messages)
- **[Search](#search)**
  - [Search Users](#search-users)
  - [Search Public Rooms](#search-public-rooms)
  - [Search Current User Rooms](#search-current-user-rooms)

<br>

### All routes _except login_ must have an authorization token in the request header as show below:

```js
headers: {
  authorization: "Bearer {TOKEN}";
}
```

<br>

<h2 id="authentication" style="display: flex; justify-content: space-between">Authentication 
<a href="#table-of-content" style="font-size:1rem;">Table of content 🔼</a>
</h2>

### Login

<details>
<summary>
This endpoint allows for login or signup depending on if the email is associated with an account or not.</summary>

<br>

- URL: `/api/auth/login`
- Method: `POST`
- Access: `Public`

#### **Request**

The request should include a JSON object in the request body with the following field:

```json
{
  "email": "sami@gmail.com"
}
```

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": null,
  "message": "Email sent successfully"
}
```

#### **Failed Response**

**Status Code**: `400 | 429 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Current User info

<details>
<summary>This endpoint allows for retrieving user information.</summary>

<br>

- URL: `/api/auth/currentUser`
- Method: `GET`
- Access: `Private`

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": {
    "_id": "64803a6d5be8b153011116fd",
    "email": "mohamedweb85@gmail.com",
    "username": "Rose",
    "isOnline": false,
    "photo": "https://firebasestorage.googleapis.com/v0/b/chatsphere.appspot.com/o/photos%2Fusers%2F647e56a86cc8b583e3fbb2f8.jpg?alt=media&token=f0d82ec2-f0cb-4574-889d-84f77315fc07",
    "locale": "en",
    "createdAt": "2023-06-06T19:56:58.110Z",
    "updatedAt": "2023-06-21T03:13:28.380Z",
    "__v": 0
  }
}
```

#### **Failed Response**

**Status Code**: `401 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Update Photo

<details>
<summary>This endpoint allows updating user photo.</summary>

<br>

- URL: `/api/auth/photo`
- Method: `PUT`
- Access: `Private`

#### **Request**

The request should include a `formData` body with following field:

- photo - file.

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": null,
  "message": "Nothing was changed."
}
```

> Message if the photo not provided

#### **Failed Response**

**Status Code**: `400 | 401 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Update Information

<details>
<summary>This endpoint allows updating user information.</summary>

<br>

- URL: `/api/auth/info`
- Method: `PUT`
- Access: `Private`

#### **Request**

The request should include a JSON object in the request body with the following field:

```json
{
  "username": "New username"
}
```

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": null,
  "message": "Nothing was changed."
}
```

> Message if the photo not provided

#### **Failed Response**

**Status Code**: `400 | 401 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Update User Status To Online

<details>
<summary>This endpoint allows updating user status to online.</summary>

<br>

- URL: `/api/auth/online`
- Method: `PUT`
- Access: `Private`

#### **Request**

The request should include a JSON object in the request body with the following field:

```json
{
  "id": "user id"
}
```

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": null
}
```

#### **Failed Response**

**Status Code**: `401 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Update User Status To Offline

<details>
<summary>This endpoint allows updating user status to offline.</summary>

<br>

- URL: `/api/auth/offline`
- Method: `PUT`
- Access: `Private`

#### **Request**

The request should include a JSON object in the request body with the following field:

```json
{
  "id": "user id"
}
```

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": null
}
```

#### **Failed Response**

**Status Code**: `401 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>
<br>
<br>

<h2 id="authentication" style="display: flex; justify-content: space-between">Users 
<a href="#table-of-content" style="font-size:1rem;">Table of content 🔼</a>
</h2>

### Get All Users

<details>
<summary>This endpoint allows for retrieving all application users.</summary>

<br>

- URL: `/api/users`
- Method: `GET`
- Access: `Private`

#### **Success Response**

- **Status Code**: `200`

```json
{
    "success": true,
    "data": [
        {
        "_id": "64803a6d5be8b153011116fd",
        "email": "mohamedweb85@gmail.com",
        "username": "Rose",
        "isOnline": false,
        "photo": "https://firebasestorage.googleapis.com/v0/b/chatsphere.appspot.com/o/photos%2Fusers%2F647e56a86cc8b583e3fbb2f8.jpg?alt=media&token=f0d82ec2-f0cb-4574-889d-84f77315fc07",
        "locale": "en",
        "createdAt": "2023-06-06T19:56:58.110Z",
        "updatedAt": "2023-06-21T03:13:28.380Z",
        "__v": 0
    },
    ...
    ...
    ...
    ],
    "pagination": {
        "next": false,
        "prev": false,
        "limit": 25,
        "page": 1,
        "pageSize": 5,
        "totalPages": 1
    },
    "total": 5
}
```

#### **Failed Response**

**Status Code**: `401 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Get Online Users

<details>
<summary>This endpoint allows for retrieving all online users.</summary>

<br>

- URL: `/api/users/online`
- Method: `GET`
- Access: `Private`

#### **Success Response**

- **Status Code**: `200`

```json
{
    "success": true,
    "data": [
        {
            "_id": "64803a6d5be8b153011116fd",
        "email": "mohamedweb85@gmail.com",
        "username": "Rose",
        "isOnline": true,
        "photo": "https://firebasestorage.googleapis.com/v0/b/chatsphere.appspot.com/o/photos%2Fusers%2F647e56a86cc8b583e3fbb2f8.jpg?alt=media&token=f0d82ec2-f0cb-4574-889d-84f77315fc07",
        "locale": "en",
        "createdAt": "2023-06-06T19:56:58.110Z",
        "updatedAt": "2023-06-21T03:13:28.380Z",
        "__v": 0
    },
    ...
    ...
    ...
    ],
    "pagination": {
        "next": false,
        "prev": false,
        "limit": 25,
        "page": 1,
        "pageSize": 5,
        "totalPages": 1
    },
    "total": 5
}
```

#### **Failed Response**

**Status Code**: `401 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Get Offline Users

<details>
<summary>This endpoint allows for retrieving all offline users.</summary>

<br>

- URL: `/api/users/offline`
- Method: `GET`
- Access: `Private`

#### **Success Response**

- **Status Code**: `200`

```json
{
    "success": true,
    "data": [
        {
        "_id": "64803a6d5be8b153011116fd",
        "email": "mohamedweb85@gmail.com",
        "username": "Rose",
        "isOnline": false,
        "photo": "https://firebasestorage.googleapis.com/v0/b/chatsphere.appspot.com/o/photos%2Fusers%2F647e56a86cc8b583e3fbb2f8.jpg?alt=media&token=f0d82ec2-f0cb-4574-889d-84f77315fc07",
        "locale": "en",
        "createdAt": "2023-06-06T19:56:58.110Z",
        "updatedAt": "2023-06-21T03:13:28.380Z",
        "__v": 0
    },
    ...
    ...
    ...
    ],
    "pagination": {
        "next": false,
        "prev": false,
        "limit": 25,
        "page": 1,
        "pageSize": 5,
        "totalPages": 1
    },
    "total": 5
}
```

#### **Failed Response**

**Status Code**: `401 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>
<br>
<br>

<h2 id="authentication" style="display: flex; justify-content: space-between">Rooms 
<a href="#table-of-content" style="font-size:1rem;">Table of content 🔼</a>
</h2>

### Create New Room

<details>
<summary>This endpoint allows for creating a new room.</summary>

<br>

- URL: `/api/rooms`
- Method: `POST`
- Access: `Private`

#### **Request**

The request should include a `formData` body with following fields:

- name (text, required): Room's name.
- members (text, required): Fields contain a room members.
- photo (file, optional): Optional file to add a custom room photo.

If the photo file does not included you can use a json object with following fields:

```json
{
  "name": "Room name",
  "members": ["647e56a86cc8b583e3fbb221", "647e56a86cc8b583e3fbb221"]
}
```

#### **Success Response**

- **Status Code**: `201`

```json
{
  "success": true,
  "data": {
    "_id": "6486ca3c97142e38f8530027",
    "private": false,
    "name": "New Room",
    "photo": "default-photo-room.png",
    "roomOwner": "647e56a86cc8b783e3fbb2f8",
    "lastMessage": "648492028cf2174ef39d13d3",
    "moderators": [],
    "createdAt": "2023-06-12T07:33:16.833Z",
    "updatedAt": "2023-06-21T02:38:02.043Z",
    "__v": 0
  },
  "message": "'Room name' room created"
}
```

#### **Failed Response**

**Status Code**: `401 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Get Available Rooms

<details>
<summary>This endpoint allows for retrieving public rooms available to join.</summary>

<br>

- URL: `/api/rooms`
- Method: `GET`
- Access: `Private`

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": [
    {
    "_id": "6486ca3c97142e38f8530027",
    "private": false,
    "name": "Room 1",
    "photo": "default-photo-room.png",
    "roomOwner": "647e56a86cc8b783e3fbb2f8",
    "lastMessage": "648492028cf2174ef39d13d3",
    "moderators": [],
    "createdAt": "2023-06-12T07:33:16.833Z",
    "updatedAt": "2023-06-21T02:38:02.043Z",
    "__v": 0
  },
  ...,
  ...,
  ...
  ],
  "pagination": {
        "next": false,
        "prev": false,
        "limit": 25,
        "page": 1,
        "pageSize": 5,
        "totalPages": 1
    },
    "total": 5
}
```

#### **Failed Response**

**Status Code**: `401 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Get Current User Rooms

<details>
<summary>This endpoint allows for retrieving current user rooms.</summary>

<br>

- URL: `/api/rooms/joined`
- Method: `GET`
- Access: `Private`

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": [
    {
    "_id": "6486ca3c97142e38f8530027",
    "private": false,
    "name": "Room 1",
    "photo": "default-photo-room.png",
    "roomOwner": "647e56a86cc8b783e3fbb2f8",
    "lastMessage": "648492028cf2174ef39d13d3",
    "moderators": [],
    "createdAt": "2023-06-12T07:33:16.833Z",
    "updatedAt": "2023-06-21T02:38:02.043Z",
    "__v": 0
  },
  ...,
  ...,
  ...
  ],
  "pagination": {
        "next": false,
        "prev": false,
        "limit": 25,
        "page": 1,
        "pageSize": 5,
        "totalPages": 1
    },
    "total": 5
}
```

#### **Failed Response**

**Status Code**: `401 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Get Single Room

<details>
<summary>This endpoint allows for retrieving a specific room.</summary>

<br>

- URL: `/api/rooms/6486ca3c97142e38f8530027`
- Method: `GET`
- Access: `Private`

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": {
    "_id": "6486ca3c97142e38f8530027",
    "private": false,
    "name": "Room 1",
    "photo": "default-photo-room.png",
    "roomOwner": "647e56a86cc8b783e3fbb2f8",
    "lastMessage": "648492028cf2174ef39d13d3",
    "moderators": [],
    "createdAt": "2023-06-12T07:33:16.833Z",
    "updatedAt": "2023-06-21T02:38:02.043Z",
    "__v": 0
  }
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 404 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>
<br>
<br>

<h2 id="authentication" style="display: flex; justify-content: space-between">Room Owner 
<a href="#table-of-content" style="font-size:1rem;">Table of content 🔼</a>
</h2>

### Update room information

<details>
<summary>This endpoint allows room owners to update room info.</summary>

<br>

- URL: `/api/rooms/:roomId/owner`
- Method: `PUT`
- Access: `Private - only room owners`

#### **Request**

The request should include a JSON object in the request body with one of the following fields:

```json
{
  "name": "New Room name",
  "private": true /* Change room access to private */
}
```

#### **Success Response**

- **Status Code**: `200`

```json
{
    "success": true,
  "data": {
      "_id": "6486ca3c97142e38f8530027",
    "private": false,
    "name": "New Room",
    "photo": "default-photo-room.png",
    "roomOwner": "647e56a86cc8b783e3fbb2f8",
    "lastMessage": "648492028cf2174ef39d13d3",
    "moderators": [],
    "createdAt": "2023-06-12T07:33:16.833Z",
    "updatedAt": "2023-06-21T02:38:02.043Z",
    "__v": 0
  },
  "message": "Nothing was changed." || "'Room Name' info updated"
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 403 | 404 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Update room photo

<details>
<summary>This endpoint allows room owners to update room photo.</summary>

<br>

- URL: `/api/rooms/:roomId/owner/photo`
- Method: `PUT`
- Access: `Private - only room owners`

#### **Request**

The request should include a `formData` body with following field:

- photo (file, required): File to update room photo.

#### **Success Response**

- **Status Code**: `200`

```json
{
    "success": true,
  "data": {
      "_id": "6486ca3c97142e38f8530027",
    "private": false,
    "name": "New Room",
    "photo": "new-photo.png",
    "roomOwner": "647e56a86cc8b783e3fbb2f8",
    "lastMessage": "648492028cf2174ef39d13d3",
    "moderators": [],
    "createdAt": "2023-06-12T07:33:16.833Z",
    "updatedAt": "2023-06-21T02:38:02.043Z",
    "__v": 0
  },
  "message": "Nothing was changed." || "'Room Name' info updated"
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 403 | 404 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Add Moderator

<details>
<summary>This endpoint allows room owners to add a moderator.</summary>

<br>

- URL: `/api/rooms/:roomId/owner/moderators/add`
- Method: `POST`
- Access: `Private - only room owners`

#### **Request**

The request should include a JSON object in the request body with the following field:

```json
{
    "moderators": ["648492028cf2174ef39d23d3","648492028cf2174ef39d13d45", . . . ]
}
```

#### **Success Response**

- **Status Code**: `200`

```json
{
    "success": true,
  "data": {
      "_id": "6486ca3c97142e38f8530027",
    "private": false,
    "name": "New Room",
    "photo": "default-photo-room.png",
    "roomOwner": "647e56a86cc8b783e3fbb2f8",
    "lastMessage": "648492028cf2174ef39d13d3",
    "moderators": [],
    "createdAt": "2023-06-12T07:33:16.833Z",
    "updatedAt": "2023-06-21T02:38:02.043Z",
    "__v": 0
  },
  "message": "Moderators added" || "Nothing was changed. no valid moderators to add"
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 403 | 404 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Remove Moderator

<details>
<summary>This endpoint allows room owners to remove a moderator.</summary>

<br>

- URL: `/api/rooms/:roomId/owner/moderators/remove`
- Method: `POST`
- Access: `Private - only room owners`

#### **Request**

The request should include a JSON object in the request body with the following field:

```json
{
  "moderators": ["648492028cf2174ef39d23d3","648492028cf2174ef39d13d45", . . . ]
}
```

#### **Success Response**

- **Status Code**: `200`

```json
{
    "success": true,
  "data": {
      "_id": "6486ca3c97142e38f8530027",
    "private": false,
    "name": "New Room",
    "photo": "default-photo-room.png",
    "roomOwner": "647e56a86cc8b783e3fbb2f8",
    "lastMessage": "648492028cf2174ef39d13d3",
    "moderators": [],
    "createdAt": "2023-06-12T07:33:16.833Z",
    "updatedAt": "2023-06-21T02:38:02.043Z",
    "__v": 0
  },
  "message": "Moderators removed" || "Nothing was changed."
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 403 | 404 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Add Member

<details>
<summary>This endpoint allows room owners to add a member.</summary>

<br>

- URL: `/api/rooms/:roomId/owner/members/add`
- Method: `POST`
- Access: `Private - only room owners`

#### **Request**

The request should include a JSON object in the request body with the following field:

```json
{
  "members": ["648492028cf2174ef39d23d3","648492028cf2174ef39d13d45", . . . ]
}
```

#### **Success Response**

- **Status Code**: `201`

```json
{
  "success": true,
  "data": null,
  "message": "Members added successfully"
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 403 | 404 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Remove Member

<details>
<summary>This endpoint allows room owners to remove a member.</summary>

<br>

- URL: `/api/rooms/:roomId/owner/members/remove`
- Method: `POST`
- Access: `Private - only room owners`

#### **Request**

The request should include a JSON object in the request body with the following field:

```json
{
    "members": ["648492028cf2174ef39d23d3","648492028cf2174ef39d13d45", . . . ]
}
```

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": null,
  "message": "Members removed successfully"
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 403 | 404 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>
<br>
<br>

<h2 id="authentication" style="display: flex; justify-content: space-between">Members 
<a href="#table-of-content" style="font-size:1rem;">Table of content 🔼</a>
</h2>

### Get Room Members

<details>
<summary>This endpoint allows for retrieving room members.</summary>

<br>

- URL: `/api/rooms/:roomId/members`
- Method: `GET`
- Access: `Private`

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": [
    {
      "_id": "649262890d8e0db2cab2683c",
      "memberId": {
        "_id": "647e56a86cc8b683e3fbb2f8",
        "username": "Mohammed",
        "isOnline": false,
        "photo": "https://firebasestorage.googleapis.com/v0/b/chatsphere.appspot.com/o/photos%2Fusers%2F64803a6d5be8b153011116fd.jpg?alt=media&token=6852b7ea-f75d-4114-aa13-209e08f1233b",
        "locale": "en",
        "createdAt": "2023-06-05T21:42:00.530Z",
        "updatedAt": "2023-06-21T12:12:26.458Z",
        "__v": 0
      },
      "unreadMessages": 0,
      "roomId": "6486ca3c97142e38f8528027",
      "createdAt": "2023-06-21T02:38:01.842Z",
      "updatedAt": "2023-06-21T03:07:47.399Z",
      "__v": 0
    }
  ],
  "pagination": {
    "next": false,
    "prev": false,
    "limit": 25,
    "page": 1,
    "pageSize": 1,
    "totalPages": 1
  },
  "total": 1
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 404 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Join Room

<details>
<summary>This endpoint allows to join a public room.</summary>

<br>

- URL: `/api/rooms/:roomId/members/join`
- Method: `POST`
- Access: `Private`

#### **Success Response**

- **Status Code**: `201`

```json
{
  "success": true,
  "data": null,
  "message": "Joined to Tester 🧪"
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 403 | 404 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Left Room

<details>
<summary>This endpoint allows for leaving from any room.</summary>

<br>

- URL: `/api/rooms/:roomId/members/left`
- Method: `DELETE`
- Access: `Private`

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": null,
  "message": "The user has successfully left the room"
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 404 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>
<br>
<br>

<h2 id="authentication" style="display: flex; justify-content: space-between">Messages 
<a href="#table-of-content" style="font-size:1rem;">Table of content 🔼</a>
</h2>

### Get Room Messages

<details>
<summary>This endpoint allows for retrieving room messages.</summary>

<br>

- URL: `/api/rooms/:roomId/messages`
- Method: `GET`
- Access: `Private`

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": [
    {
      "_id": "649262890d7e0db2cab2683f",
      "type": "announcement",
      "content": "GoodFellas room created",
      "roomId": "648e304a174a87285f3407f4",
      "createdAt": "2023-06-21T02:38:01.842Z",
      "updatedAt": "2023-06-21T02:38:01.842Z",
      "__v": 0
    },
    {
      "_id": "648498e2818f225b92d3210b",
      "type": "text",
      "senderId": {
        "_id": "64803a6d5be8b153011116fd",
        "email": "mohamedweb85@gmail.com",
        "username": "Rose",
        "isOnline": false,
        "photo": "https://firebasestorage.googleapis.com/v0/b/chatsphere.appspot.com/o/photos%2Fusers%2F647e56a86cc8b583e3fbb2f8.jpg?alt=media&token=f0d82ec2-f0cb-4574-889d-84f77315fc07",
        "locale": "en",
        "createdAt": "2023-06-06T19:56:58.110Z",
        "updatedAt": "2023-06-21T03:13:28.380Z",
        "__v": 0
      },
      "content": "Hi everyone.",
      "roomId": "648e304a174a87285f3407f4",
      "createdAt": "2023-06-17T22:14:34.267Z",
      "updatedAt": "2023-06-17T22:14:34.267Z",
      "__v": 0
    }
  ],
  "pagination": {
    "next": false,
    "prev": false,
    "limit": 25,
    "page": 1,
    "pageSize": 2,
    "totalPages": 1
  },
  "total": 2
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 404 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>
  
### Add New Message

<details>
<summary>This endpoint allows for adding a new message.</summary>

<br>

- URL: `/api/rooms/:roomId/messages`
- Method: `POST`
- Access: `Private`

#### **Request**

The request should include a `formData` body with following field if message type is file:

- content (text, required): message content.
- file (file, optional): File to send with the message.

If the message type is text you can provide a JSON object with the following field:

```json
{
  "content": "A New Message here"
}
```

#### **Success Response**

- **Status Code**: `201`

```json
{
    "success": true,
  "data": {
      "_id": "649262890d7e0db2cab2683f",
    "type": "text" | "file",
    "senderId": "649273890d7e0db2cab2683f",
    "content": "Good morning",
    "roomId": "648e304a174a87285f3407f4",
    "createdAt": "2023-06-21T02:38:01.842Z",
    "updatedAt": "2023-06-21T02:38:01.842Z",
    "__v": 0
  },
  "message": "Message has been sent successfully"
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 403 | 404 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Update Message

<details>
<summary>This endpoint allows updating a specific message.</summary>

<br>

- URL: `/api/rooms/:roomId/messages/:messageId`
- Method: `PUT`
- Access: `Private - only message sender`

#### **Request**

The request should include a JSON object with the following field:

```json
{
  "content": "A new verion of the message"
}
```

#### **Success Response**

- **Status Code**: `200`

```json
{
    "success": true,
  "data": {
      "_id": "649262890d7e0db2cab2683f",
    "type": "text" | "file",
    "senderId": "649273890d7e0db2cab2683f",
    "content": "Good evening",
    "roomId": "648e304a174a87285f3407f4",
    "createdAt": "2023-06-21T02:38:01.842Z",
    "updatedAt": "2023-06-21T02:38:01.842Z",
    "__v": 0
  },
  "message": "Message has been updated successfully",
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 403 | 404 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Delete Message

<details>
<summary>This endpoint allows deleting a specific message.</summary>

<br>

- URL: `/api/rooms/:roomId/messages/:messageId`
- Method: `DELETE`
- Access: `Private - only message sender, room owner, or moderators`

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": null,
  "message": "Message has been deleted successfully"
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 403 | 404 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Get Unread Messages

<details>
<summary>This endpoint allows for getting unread messages number for a specific room of the current user rooms.</summary>

<br>

- URL: `/api/rooms/:roomId/messages/unread`
- Method: `GET`
- Access: `Private`

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": {
    "unreadMessages": 4
  }
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 404 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Reset Unread Messages

<details>
<summary>This endpoint allows for resetting the unread messages number for a specific room of the current user rooms.</summary>

<br>

- URL: `/api/rooms/:roomId/messages/unread`
- Method: `POST`
- Access: `Private`

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": {
    "unreadMessages": 0
  }
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 404 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>
<br>
<br>

<h2 id="authentication" style="display: flex; justify-content: space-between">Search 
<a href="#table-of-content" style="font-size:1rem;">Table of content 🔼</a>
</h2>

### Search Users

<details>
<summary>This endpoint allows searching in users by username.</summary>

<br>

- URL: `/api/search/users?q=rose'`
- Method: `GET`
- Access: `Private`

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": [
    {
      "_id": "64803a6d5be8b153011116fd",
      "username": "Rose",
      "isOnline": false,
      "photo": "https://firebasestorage.googleapis.com/v0/b/chatsphere.appspot.com/o/photos%2Fusers%2F647e56a86cc8b583e3fbb2f8.jpg?alt=media&token=f0d82ec2-f0cb-4574-889d-84f77315fc07",
      "locale": "en",
      "createdAt": "2023-06-06T19:56:58.110Z",
      "updatedAt": "2023-06-21T03:13:28.380Z",
      "__v": 0
    }
  ],
  "pagination": {
    "next": false,
    "prev": false,
    "limit": 25,
    "page": 1,
    "pageSize": 0,
    "totalPages": 0
  },
  "total": 0
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Search Public Rooms

<details>
<summary>This endpoint allows searching in public rooms by room name.</summary>

<br>

- URL: `/api/search/rooms?q=test'`
- Method: `GET`
- Access: `Private`

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": [
    {
      "_id": "6486ca3c97142e38f8528027",
      "private": false,
      "name": "Testers 🧪",
      "photo": "default-photo-room.png",
      "roomOwner": "647e56a86cc8b583e3fbb2f8",
      "lastMessage": "648492028cf1174ef39d13d3",
      "moderators": [],
      "createdAt": "2023-06-12T07:33:16.833Z",
      "updatedAt": "2023-06-21T02:38:02.043Z",
      "__v": 0
    }
  ],
  "pagination": {
    "next": false,
    "prev": false,
    "limit": 25,
    "page": 1,
    "pageSize": 0,
    "totalPages": 0
  },
  "total": 0
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>

<br>

### Search Current User Rooms

<details>
<summary>This endpoint allows searching in current user rooms by room name.</summary>

<br>

- URL: `/api/search/rooms/joined?q=fell'`
- Method: `GET`
- Access: `Private`

#### **Success Response**

- **Status Code**: `200`

```json
{
  "success": true,
  "data": [
    {
      "_id": "648e304a174a87285f3407f4",
      "private": false,
      "name": "GoodFellas",
      "photo": "default-photo-room.png",
      "roomOwner": "64803a6d5be8b153011116fd",
      "lastMessage": {
        "_id": "648498e2818f225b92d3210b",
        "type": "announcement",
        "content": "GoodFellas room created",
        "roomId": "648e304a174a87285f3407f4",
        "createdAt": "2023-06-17T22:14:34.267Z",
        "updatedAt": "2023-06-17T22:14:34.267Z",
        "__v": 0
      },
      "moderators": [],
      "createdAt": "2023-06-17T22:14:34.267Z",
      "updatedAt": "2023-06-21T02:38:02.044Z",
      "__v": 0
    }
  ],
  "pagination": {
    "next": false,
    "prev": false,
    "limit": 25,
    "page": 1,
    "pageSize": 0,
    "totalPages": 0
  },
  "total": 0
}
```

#### **Failed Response**

**Status Code**: `400 | 401 | 500`

```json
{
  "success": false,
  "data": null,
  "error": "error message"
}
```

</details>
