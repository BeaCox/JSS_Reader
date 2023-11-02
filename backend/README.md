## API reference

## Basic routes

+ `/api/v1/sendMailCode`
    `POST` request
    `service` should be one of the following：
    
    + `register`
    + `forgetPassword`
    + `changeEmail`
    + `changePassword`
    + `cancel`
    
    example: 


    ```json
    {
        "service": "register",
        "email": "root@beacox.space"
    }
    ```

+ `/api/v1/register`
    `POST` request
    
    ```json
    {
        "username": "BeaCox",
        "email": "root@beacox.space",
        "password": "p4ssw0rd",
        "code": "114514"
    }
    ```
    should call `/api/v1/sendMailCode` first
    return：
    
    ```json
    {
        "id": "1",
        "username": "BeaCox",
        "email": "root@beacox.space"
    }
    ```
    if wrong, return is like：
    ```json
    {
        "message": "The verification code is wrong or has expired."
    }
    ```
    Below, unless otherwise noted, errors are of this form and are accompanied by a non-200 status code.。
    
+ `/api/v1/login`
    `POST` request
    
    example:
    
    ```json
    {
        "email": "root@beacox.space",
        "password": "p4ssw0rd"
    }
    ```
    client will get json web token(jwt)
    most of the pages will be authenticated by jwt
    
    if not authenticated, reurn:
    
    ```json
    {
        "message": "unauthenticated"
    }
    ```
    
+ `/api/v1/user`
    `GET` request
    
+ `/api/v1/logout`
    `POST` request
    expire cookie
    
+ `/api/v1/cancel`
    `POST` request
    
    ```json
    {
        "code": "114514"
    }
    ```
    call `/api/v1/sendMailCode` before:
    ```json
    {
        "service": "cancel"
    }
    ```
    
+ `/api/v1/forgetPassword`
    `POST` request
    
    ```json
    {
        "email": "root@beacox.space",
        "newPassword": "1919810",
        "code": "114514"
    }
    ```
    call `/api/v1/sendMailCode` before:
    ```json
    {
        "email": "root@beacox.space"
        "service": "forgetPassword"
    }
    ```
    
+ `/api/v1/changePassword`
    `POST` request
    
    ```json
    {
        "code": "114514",
        "newPassword": "666"
    }
    ```
    call `/api/v1/sendMailCode` before:
    ```json
    {
        "service": "changePassword"
    }
    ```
    
+ `/api/v1/changeEmail`
    `POST`方法
    email is new email, should be authenticated
    
    ```json
    {
        "code": "114514",
        "email": "boyce_young@sjtu.edu.cn"
    }
    ```
    call `/api/v1/sendMailCode` before:
    email is new email
    
    ```json
    {
        "service": "changeEmail",
        "email": "boyce_young@sjtu.edu.cn"
    }
    ```
    
    return: 
    ```json
    {
      "id": 1,
      "username": "BeaCox",
      "email": "boyce_young@sjtu.edu.cn"
    }
    ```
    
+ `/api/v1/changeUsername`
    `POST` request
    
    ```json
    {
        "newUsername": "B34C0x"
    }
    ```
    return: 
    ```json
    {
      "id": 1,
      "username": "B34C0x",
      "email": "boyce_young@sjtu.edu.cn"
    }
    ```
    
### category
+ `/api/v1/category`
    - `POST` request
    ```json
    {
        "name": "tech"
    }
    ```
    return: 
    ```json
    {
        "cid": "1",
        "uid": "1",
        "name": "tech"
    }
    ```
    - `GET` request
    return
    ```json
    [
      {
        "cid": "1",
        "name": "tech"
      },
      {
        "cid": "2",
        "name": "politics"
      },
      {
        "cid": "3",
        "name": "blog"
      }
    ]
    ```
    - `PUT` request
    ```json
    {
        "name": "tech"
        "newname": "coolTech"
    }
    ```
    return: 
    ```json
    {
      "cid": "5",
      "name": "coolTech"
    }
    ```
    - `DELETE` request
    ```json
    {
        "name": "coolTech"
    }
    ```
    return: 
    ```json
    {
        "message": "category deleted"
    }
    ```
    
### feed
+ `/api/v1/feed/category/:name`
	name is name of category
  
    - `POST` request
      
        ```json
        {
            "name": "Beaox's blog",
            "url": "https://blog.beacox.space/atom.xml"
        }
        ```
        return:
        ```
        ```json
        {
            "fid": "1",
            "cid": "1",
            "url": "https://blog.beacox.space/atom.xml",
            "name": "BeaCox's blog"
        }
        ```
    - `GET` request
        return:
        
        ```json
        [
          {
            "fid": "1",
            "cid": "1",
            "url": "https://blog.beacox.space",
            "name": "BeaCox's blog"
          },
          {
            "fid": "1",
            "cid": "2",
            "url": "https://blog.0x7d0.dev/feed.xml",
            "name": "0x7D0"
          },
          {
            "fid": "3",
            "cid": "2",
            "url": "https://rsshub.rssforever.com/sjtu/jwc",
            "name": "sjtu jwc"
          }
        ]
        ```
    - `PUT` request
      
        ```json
        {
            "fid": "1",
            "newName": "B34C0x's blog",
            "newUrl": "https://blog.beacox.space/rss.xml"
        }
        
        ```
    - `DELETE` request
      
        ```json
        {
            "fid": "1"
        }
        ```


### feedItem
#### for one
+ `/api/v1/item/one/get/:fid`
    `GET` request
    params:
    
    ```
    ?updatedDuring=today
    ?updatedDuring=week
    ?updatedDuring=month
    ?tag=starred
    ?tag=unnread
    ?order=latest			<- default
    ?order=oldest
    ```
    params here also work for all the following apis (including update) in `feedItem` header
    
    return: 
    ```json
    [
      {
        "iid": 22,
        "fid": 6,
        "unread": true,
        "starred": false,
        "url": "https://blog.0x7d0.dev/writeups/hackfest-ctf-2023/phone-to-the-future/",
        "title": "Hackfest 2023: Phone to the Future",
        "description": "Writeup for the “Phone to the Future” challenge created by muemmemlmoehre for the Hackfest CTF 2023. For this challenge, the file mobile.apk is provided. 01 - Dig in The first step is to decompile the Android application using a software such as JADX: % jadx mobile1.apk With a simple search, we can easily find the first flag located in the AndroidManifest.xml: % grep \"HF-\" -r mobile1/ mo...",
        "content": "",
        "updated": "2023-10-24T23:30:00Z",
        "published": "2023-10-24T23:30:00Z"
      },
      {
        "iid": 21,
        "fid": 6,
        "unread": true,
        "starred": false,
        "url": "https://blog.0x7d0.dev/writeups/hackfest-ctf-2023/vaults-of-time/",
        "title": "Hackfest 2023: Vaults of Time",
        "description": "Writeup for the “Vaults of Time” challenge created by muemmemlmoehre for the Hackfest CTF 2023. For this challenge, the file mobile2.apk is provided. And as always, the first step is to decompile the Android application using a software such as JADX: % jadx mobile1.apk From the decompiled code, we can see two activities, SecureArea and SecretActivity which are not easily accessible to users...",
        "content": "",
        "updated": "2023-10-24T23:30:00Z",
        "published": "2023-10-24T23:30:00Z"
      },
      {
        "iid": 23,
        "fid": 6,
        "unread": true,
        "starred": false,
        "url": "https://blog.0x7d0.dev/writeups/hackfest-ctf-2023/lost-in-history/",
        "title": "Hackfest 2023: Lost in History",
        "description": "Writeup for the “Lost in History” challenge created by TheRage for the Hackfest CTF 2023. The flag has been lost in the timeline. Can you recover it? 01 - Tiny changes For this challenge, a Git project is provided. Inside, there is a single file named flat.txt containing the letter e. By reviewing the Git commit history, we can see 2612 similar commits that change the single character pr...",
        "content": "",
        "updated": "2023-10-20T00:39:00Z",
        "published": "2023-10-20T00:39:00Z"
      }
    ]
    ```
    
+ `/api/v1/item/one/update/:fid`
    `GET` request
    parse RSS and update feedItems in database
#### for category
+ `/api/v1/item/category/get/:cid`
    `GET` request
    get all feedItems of this category
    
+ `/api/v1/item/category/update/:cid`
    `GET` request
    update all feedItems of this category
#### for all
+ `/api/v1/item/all/get`
    `GET` request
    get all feedItems 

+ `/api/v1/item/all/update`
    `GET` request
    update all feedItems 
#### star / unstar
return is message
+ `/api/v1/star/:iid`
    `GET` request
    
+ `/api/v1/unstar:iid`
    `GET` request

#### read / unread
return is message
+ `/api/v1/read/one/:iid`
    `GET` request
    
+ `/api/v1/read/feed/:fid`
    `GET` request
    
+ `/api/v1/read/all`
    `GET` request
    
    
    
    unread equals to read, just replace read to unread    

### explore
`/api/v1/explore/:category`
`GET` request
return: 

```json
[
  {
    "eid": 7,
    "category": "Journal",
    "name": "IEEE Symposium on Security and Privacy",
    "url": "https://rsshub.app/ieee-security/security-privacy",
    "description": "",
    "image": ""
  },
  {
    "eid": 9,
    "category": "Journal",
    "name": "Nature (Nature Genetics) | Latest Research",
    "url": "https://rsshub.app/nature/research/ng",
    "description": "",
    "image": ""
  },
  {
    "eid": 8,
    "category": "Journal",
    "name": "Network and Distributed System Security (NDSS) Symposium",
    "url": "https://rsshub.app/ndss-symposium/ndss",
    "description": "",
    "image": ""
  }
]
```

## setting
+ `/api/v1/setting`
get settings of one user
`Get`request
return: 
```json
{
  "uid": 1,
  "default_sort": 1,
  "default_presentation": 1,
  "mark_as_read_on_scroll": 1,
  "font_size": 2,
  "font_family": 1,
  "theme": 1,
  "display_density": 1
}
```

+ `/api/v1/setting`
`PUT`方法
can only change one at a time
```json
{
  "font_size": 3
}
```
return:
```json
{
  "uid": 1,
  "default_sort": 1,
  "default_presentation": 1,
  "mark_as_read_on_scroll": 1,
  "font_size": 3,
  "font_family": 1,
  "theme": 1,
  "display_density": 1
}
```