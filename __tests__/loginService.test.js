const { loginService } = require("../services/authService");

const reqBody  = {
     email: 'Sarah@email.com',
     password: '123456'
}

test('returns control success if user exists', async ()=> {
     const getReturn = await loginService(reqBody)
     expect(getReturn.control).toEqual('success');
     expect(getReturn.response.status).toEqual(200);
     expect(typeof getReturn.data).toEqual('object'); 
});
