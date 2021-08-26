# 1. NO_SQL

### Implement this task using MongoDB

### Clarification
- Convert your week-7-task database into a NOSQL DB using `MONGODB`. 
- Return the same information as specified from previous task.
- Implement pagination for both transaction and balance table, `with limit of 5 values for each page`
- Create Authentication and Authorization for users using a middleware function
- Implement Validation for incoming request using  **Joi**
- Only registered users can access all `endpoints`
- Use mongoDB-compass for local development

- Balance data format:
```js
{
    previous:1,
    next:3,
    data:[
         { 
            "accountNumber": "2059333979",
            "amount": "250,000"
            "createdAt": "2021-08-26T09:12:53.752Z",
            "updatedAt": "2021-08-26T09:12:53.752Z",
         } 
        ]
}

```

- Transaction data format:
```js
{
    previous:0,
    next:2,
    data:[
         { 
            "reference": "0c9e6ba7-242c-4ade-aec4-e1185c7e8633",
            "senderAccount": "2059333979",
            "receiverAccount": "8965431500",
            "amount": 850,
            "transferDescription": "just because it's saturday"
            "createdAt": "2021-08-26T09:16:44.209Z",
         } 
        ]
}

```

### Test Coverage (Test is mandatory):
- Test your database using mongodb-memory-server
- Test all endpoints `(GET, POST, PUT, DELETE)`


# 2. Mongo Aggregation Exercise.
- Go through the readme file in the Folder `MongoAggregation`
