const request = require('supertest');
const app = require('../setup');

const reqBody = {
     "firstname": "Sarah",
     "lastname":"Shaw",
     "email": "q1234@email.com",
     "password":"123456",
}

describe('POST "/api/v1/register"',()=>{
    test('should respond with status 201 after a successful post',async () => {
          const response = await request(app)
          .post("/api/v1/register")
          .send(reqBody)
          .set('Accept', 'application/json')
          expect(response.status).toEqual(201);  
          expect(response.body.status).toEqual(201);   
          expect(response.body.message).toEqual('New user created');   
          expect(typeof response.body.data).toEqual('object');    
     })   
})