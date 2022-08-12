const express = require('express')
const app = express()
const util = require("util");
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const port = 3000
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
app.use(bodyParser.json())

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
  let inFoschema = `use information_schema`
  let tablequery = `select * from TABLES where table_schema like 'db_ura%' order by TABLE_NAME`
  let columnquery = `select * from columns where table_schema like 'db_ura%' order by TABLE_NAME`
  try {
    let { source, destination, type=1 } = req.body
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
    if (type == 1) {
      var con2 = mysql.createConnection(destination);
      await check(con2)
      await test(con2, inFoschema)
      destinationResult = await test(con2, `select * from TABLES where table_schema like '${destination.database}%' order by TABLE_NAME`)
      destinantionColumnWise = await test(con2, `select * from columns where table_schema like '${destination.database}%' order by TABLE_NAME`)
    } else {
      destinationResult = await CSVToJSON().fromFile('./files/table.csv')
      destinantionColumnWise = await CSVToJSON().fromFile('./files/column.csv')
    }
    let data = { sourceResult, destinationResult, sourecColumnWise, destinantionColumnWise }
    res.send({ status: 200, message: "success", data })
  } catch (error) {
    console.log(error.message)
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


