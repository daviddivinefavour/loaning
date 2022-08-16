const request = require("supertest");
const app = require("../app");
const baseUrl = '/api/v1';
const registerUrl = baseUrl+'/register';
const loginUrl = baseUrl+'/login';

describe(`POST ${registerUrl}`, ()=> {
     it('responds with json', async ()=> {
          const response = await request(app)
               .post('/users')
               .send({
                "firstname": "Sarah",
                "lastname":"Shaw",
                "email": "Sarah@email.com",
                "password":"123456",
                "confirmPassword":"123456"
                })
               .set('Accept', 'application/json')
          expect(response.headers["Content-Type"]).toMatch(/json/);
          expect(response.status).toEqual(200);
          expect(response.body.email).toEqual('foo@bar.com');
     });
});
