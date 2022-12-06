const io= require("socket.io")(8900,{
  cors:{
    origin:"https://chatreactmaesgo.netlify.app/"
  }
});

 let users=[]
 const adduser=(userId,socketId)=>{
  !users.some((user)=> user.userId === userId)&&
  users.push({userId,socketId})
 }

 const removeuser=(socketId)=>{
  users = users.filter(user=>user.socketId !==socketId)
 }

 const getuser=(userId)=>{
  return users.find(user=>user.userId === userId)
 }


io.on("connection",(socket)=>{
  console.log("user connected.")
  //connect
  socket.on("adduser",(userId)=>{
    adduser(userId,socket.id);
    io.emit("getusers",users)
  })

//send and get
socket.on("sendmessage",({senderId,receiverId,text})=>{
   const user=getuser(receiverId);
   io.to(user.socketId).emit("getmessage",{
    senderId,
    text,
   })
})

  //disconnect
  socket.on("disconnect",()=>{
    console.log("lll");
    removeuser(socket.id);
    io.emit("getusers",users)
  })            
})       