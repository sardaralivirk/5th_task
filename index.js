const express=require('express')
const db=require('./database/db')
const app = express();
const userRouter=require('./route/api')
app.use(express.json())
app.use('/',userRouter)





const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});