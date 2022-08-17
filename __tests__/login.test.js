const request = require('supertest');
const app = require('../app')

const reqBody ={
     "email": "Sarah@email.com",
     "password":"123456",
}

describe(`POST "/api/v1/login"`, ()=> {
     test('', async () => {
          const response = await request(app)
          .post("/api/v1/login")
          .send(reqBody)
          .set('Accept', 'application/json')
          expect(response.status).toEqual(200)  ;
          expect(response.body.status).toEqual(200) ;
          expect(response.body.message).toEqual('User logged in successfully');
          expect(typeof response.body.data).toEqual('object');
     });
});