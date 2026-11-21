const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')
app.use(cors())
app.use(express.json())

function logger(req,res,next){
const start = Date.now()
res.on('finish',()=>{
  const ms = Date.now()-start;
  console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);

})
next()
}
app.use(logger)
function requireKey(req,res,next){
  if(req.header['x-key'] !== 'secret'){
    return res.status(401).send('Unauthorized')
  }
  next()
}

app.get('/hello',(req,res)=>{
  res.send('Hi')
  console.log('Hello')
})
app.get('api/private',requireKey,(res,req)=>[
  res.json({message:'This is a private message'})
])

//Database test
app.get('/db-test',async (req,res)=>{
  try{
    const result = await pool.query('SELECT NOW()')
    res.json({connected:true,time:result.rows[0]})
  }
  catch(error){
    res.json({connected:false, error:error.message})
  }
})
async function createTable() {
  await pool.query(`
    INSERT INTO files (filename,original_name,size,type)
VALUES['icon.img','pic.img','10000','appliaction/img']
    `);
    res.send('Saved to DB!')
  
}
app.listen(5000,()=>{
  console.log('Running on port 5000')
})