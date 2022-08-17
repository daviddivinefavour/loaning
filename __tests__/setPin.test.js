const request = require('supertest');
const app = require('../app')

const reqBody ={
     "pin": "1134",
     "confirmPin":"1134",
}
const token = "$2b$10$Y9ZWscVV4LfkWY0xDzY73eqT9G1Aez8ia4GbPT00PFXbMEdACPtI2";

describe('Set Transaction Pin', ()=> {
     test('should return status 400 if pin and confirm pin do not match',  async () => {
          const response = await request(app)
          .post("/api/v1/home/pin/set")
          .send(reqBody)
          .set('Authorization', `Bearer ${token}`)
          expect(response.status).toBe(400);
     });

     test('should set Transaction pin',  async () => {
          const response = await request(app)
          .post("/api/v1/home/pin/set")
          .send(reqBody)
          .set('Authorization', `Bearer ${token}`)
          console.log(response.body.message);
          expect(response.status).toBe(200);
          expect(response.body.message).toMatch('Pin set Successfully');
     });
});