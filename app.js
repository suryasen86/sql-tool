const express = require('express')
const app = express()
const util = require("util");
ROOT_DIR = __dirname + '/';
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const port = 3000
const fileUpload = require("express-fileupload");
const path = require('path')
// setting up congig file  ;
dotenv.config({ path: './config.env' })
const CSVToJSON = require('csvtojson');
const db_credentials = {
  source_global: '',
  destination_global: ''
}
var cors = require('cors');

app.use(cors());
app.use(fileUpload());


 
app.use(bodyParser.json()); // support json encoded bodies

app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

async function test(db_con, query) {
  // console.log(query)
  return new Promise((resolve, reject) => {
    db_con.query(query, (err, result) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(result)
      }
    })
  })
}
async function check(db_con) {
  return new Promise((resolve, reject) => {
    db_con.connect(function (err) {
      if (err) reject(err)
      resolve("Hello")
    });
  })


}

app.post('/connection', async (req, res) => {
  let sourceErr, destinationErr, sourceResult, destinationResult
  let destination_column_csv_path
  let destination_table_csv_path
  let source_column_csv_path
  let source_table_csv_path
  let inFoschema = `use information_schema`
  let tablequery = `select * from TABLES where table_schema like 'db_ura%' order by TABLE_NAME`
  let columnquery = `select * from columns where table_schema like 'db_ura%' order by TABLE_NAME`
  try {
    let { source, destination, type} = req.body
    if(type==1){

    if (!source || !destination) {
      return res.send({ status: 422, message: "Invalid request" })
    }


    if (!source.port == '3306') {
      source.host = source.ip + ":" + source.port
    } else {
      source.host = source.ip
    }

    if (!destination.port == '3306') {
      destination.host = destination.ip + ":" + destination.port
    } else {
      destination.host = destination.ip
    }
    delete source.ip
    delete destination.ip
    db_credentials.source_global = source
    db_credentials.destination_global = destination


    var con = mysql.createConnection(source);
    await check(con)
    await test(con, inFoschema)
    sourceResult = await test(con, `select * from TABLES where table_schema like '${source.database}%' order by TABLE_NAME`)
    let sourecColumnWise = await test(con, `select * from columns where table_schema like '${source.database}%' order by TABLE_NAME`)
    var con2 = mysql.createConnection(destination);
    await check(con2)
    await test(con2, inFoschema)
    destinationResult = await test(con2, `select * from TABLES where table_schema like '${destination.database}%' order by TABLE_NAME`)
    destinantionColumnWise = await test(con2, `select * from columns where table_schema like '${destination.database}%' order by TABLE_NAME`)
    let data = { sourceResult, destinationResult, sourecColumnWise, destinantionColumnWise }
    return res.send({ status: 200, message: "success", data })
    }else if (type==2){
      let source={}
      let {ip,user,database,password,port}=req.body
      if (!port == '3306') {
        source.host = ip + ":" + port
      } else {
        source.host = ip
      }
      source.user=user
      source.database=database
      source.password=password
      var con = mysql.createConnection(source);
      await check(con)
      await test(con, inFoschema)
      sourceResult = await test(con, `select * from TABLES where table_schema like '${source.database}%' order by TABLE_NAME`)
      let sourecColumnWise = await test(con, `select * from columns where table_schema like '${source.database}%' order by TABLE_NAME`)
      
      
      const destination_column = req.files?.destination_column;
      if(!destination_column)  throw Error("Destination column file not found")
      await destination_column.mv(`${ROOT_DIR}files/${req.files.destination_column.name}`);
      destination_column_csv_path=req.files.destination_column.name;
      

      const destination_table = req.files?.destination_table;
      if(!destination_table)  throw Error("Destination table file not found")
      await destination_table.mv(`${ROOT_DIR}files/${req.files.destination_table.name}`);
      destination_table_csv_path=req.files.destination_table.name;
      

      destinationResult = await CSVToJSON().fromFile(`./files/${destination_table_csv_path}`)
      destinantionColumnWise = await CSVToJSON().fromFile(`./files/${destination_column_csv_path}`)
      let data = { sourceResult, destinationResult, sourecColumnWise, destinantionColumnWise }
     return  res.send({ status: 200, message: "success", data })
    
    }else if(type==3){
      let destination={}
      let {ip,user,database,password,port}=req.body
      if (!port == '3306') {
        destination.host = ip + ":" + port
      } else {
        destination.host = ip
      }
      destination.user=user
      destination.database=database
      destination.password=password

      var con2 = mysql.createConnection(destination);
      await check(con2)
      await test(con2, inFoschema)
      destinationResult = await test(con2, `select * from TABLES where table_schema like '${destination.database}%' order by TABLE_NAME`)
      destinantionColumnWise = await test(con2, `select * from columns where table_schema like '${destination.database}%' order by TABLE_NAME`)



      const source_column=req.files?.source_column
      if(!source_column)  throw Error("source column file not found")
      await source_column.mv(`${ROOT_DIR}files/${req.files.source_column.name}`);
      source_column_csv_path=req.files.source_column.name;



      const source_table=req.files?.source_table
      if(!source_table)  throw Error("source table file not found")
      await source_table.mv(`${ROOT_DIR}files/${req.files.source_table.name}`);
      source_table_csv_path=req.files.source_table.name;

      let sourecColumnWise = await CSVToJSON().fromFile(`./files/${source_column_csv_path}`)
      sourceResult=await CSVToJSON().fromFile(`./files/${source_table_csv_path}`)




      let data = { sourceResult, destinationResult, sourecColumnWise, destinantionColumnWise }
     return  res.send({ status: 200, message: "success", data })
    }else if (type==4){
      // validation 
      const destination_column = req.files?.destination_column;
      if(!destination_column)  throw Error("Destination column file not found")
      await destination_column.mv(`${ROOT_DIR}files/${req.files?.destination_column.name}`);
      destination_column_csv_path=req.files?.destination_column.name;
      

      const destination_table = req.files?.destination_table;
      if(!destination_table)  throw Error("Destination table file not found")
      await destination_table.mv(`${ROOT_DIR}files/${req.files?.destination_table.name}`);
      destination_table_csv_path=req.files?.destination_table.name;
      
      const source_column=req.files?.source_column
      if(!source_column)  throw Error("source column file not found")
      await source_column.mv(`${ROOT_DIR}files/${req.files?.source_column.name}`);
      source_column_csv_path=req.files.source_column.name;



      const source_table=req.files?.source_table
      if(!source_table)  throw Error("source table file not found")
      await source_table.mv(`${ROOT_DIR}files/${req.files?.source_table.name}`);
      source_table_csv_path=req.files?.source_table.name;

      let sourecColumnWise = await CSVToJSON().fromFile(`./files/${source_column_csv_path}`)
      sourceResult=await CSVToJSON().fromFile(`./files/${source_table_csv_path}`)

      destinationResult = await CSVToJSON().fromFile(`./files/${destination_table_csv_path}`)
      destinantionColumnWise = await CSVToJSON().fromFile(`./files/${destination_column_csv_path}`)






      let data = { sourceResult, destinationResult, sourecColumnWise, destinantionColumnWise }
     return  res.send({ status: 200, message: "success", data })
       
    }else {
      return res.send("error")
    }
 
 
  } catch (error) {
    console.log(error)
    res.send({ status: 500, message: error.message || "technical Error" })
  }

})
app.post('/copy', async (req, res) => {
  // let {}=
  try {

    let { tableName, obj } = req.body
    if (!obj.port == '3306') {
      obj.host = obj.ip + ":" + obj.port
    } else {
      obj.host = obj.ip
    }
    delete obj.ip
    var con = mysql.createConnection(obj);
    await check(con)


    let query = `SHOW CREATE TABLE ${obj.database}.${tableName}`
    let result = await test(con, query)
    // console.log()
    res.send({ status: 200, message: "success", data: result[0]['Create Table'] })

  } catch (error) {
    console.log(error.message)
    res.send({ status: 500, message: error.message || "technical Error" })
  }
})

app.get('/hello', async (req, res) => {


  res.send({ tables, columns })
})
app.use(express.static('client/build'))

app.get('*', (req, res) => {

  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))

})



const server = app.listen(process.env.PORT, () => {
  console.log(`server started on port : ${process.env.PORT} in  ${process.env.NODE_ENV}`)
})


