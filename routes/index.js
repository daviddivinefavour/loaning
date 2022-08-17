const userRoutes = require('./userRoutes');
const transactionRoutes = require('./transactionRoutes');

module.exports = (app)=>{
     app.get('/',(req,res)=>{
          res.send('Welcome to lendsqr')
     })
     app.use('/api/v1', userRoutes);
     app.use('/api/v1', transactionRoutes);
}