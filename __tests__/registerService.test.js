const { registerService } = require('../services/authService');

const reqBody = {
     "firstname": "Sarah",
     "lastname":"Shaw",
     "email": "Sar5a881h@email.com",
     "password":"123456",
 }

describe('given email,firstname,lastname, and password',()=>{
     test('returns control success', async() => {
          const getReturn = await registerService(reqBody)
          expect(getReturn.control).toEqual('success');
          expect(getReturn.status).toEqual(200);
          expect(typeof respond.details).toEqual('object');      
     });
})