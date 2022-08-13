module.exports = (user,amount,res)=>{
     let {wallet} = user[0];
     wallet-= amount;
     if(wallet<0){
          return res.status(405).json({
               status: 405,
               message: "Insufficient balance"
          })
     }
}