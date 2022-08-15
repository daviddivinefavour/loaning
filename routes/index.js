const userRoutes = require('./userRoutes');
const transactionRoutes = require('./transactionRoutes');

module.exports = (app)=>{
     app.use('/api/v1', userRoutes);
     app.use('/api/v1', transactionRoutes);
}