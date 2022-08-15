module.exports = (control)=>(status)=>(message)=>(title)=>(data)=>{
     return {
          control,
          response: {
               status,
               message,
               title
          },
          data
     }
}