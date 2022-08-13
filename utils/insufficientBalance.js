module.exports = (user,amount,res)=>{
     let {wallet} = user[0];
     wallet-= amount;
     if(wallet<0){
          return true;
     }
     return false;
}