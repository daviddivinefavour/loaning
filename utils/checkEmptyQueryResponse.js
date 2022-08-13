module.exports = (response)=>{
     if(response.length < 1 ){
          return res.status(500).json({
               status: 500,
               message: 'unexpected error'
          });
     }
}