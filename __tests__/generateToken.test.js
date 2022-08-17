const { generateToken } = require('../services/authService');

test("should return an encrpted token", async () => {
     const result = await generateToken({email:"Adamu Adamu"})
     expect(result.length).toEqual(60)
})