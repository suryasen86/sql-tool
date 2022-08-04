import React, { useState } from "react";
import SingleColumnRow from "./SingleColumnRow";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const ColumnWise = ({ result, validation, setresult, rowData,setloader }) => {
  
  const [genScript, setgenScript] = useState(false);
  const [filters, setfilters] = useState(0);
  const applyFilters = (key) => {
    let newresult = rowData;
    return new Promise((reject, resolve) => {
      if (key == 1) {
        newresult = newresult.filter(
          (e) => e.source.COLUMN_TYPE !== e.destination.COLUMN_TYPE  && e.destination.COLUMN_TYPE!=='' && e.source.COLUMN_TYPE!==''
        );

        setresult(newresult);
        resolve(newresult);
      } else if (key == 2) {
        newresult = newresult.filter(
          (e) => e.source.IS_NULLABLE !== e.destination.IS_NULLABLE
        );

        setresult(newresult);
        resolve(newresult);
      } else if (key == 3) {
        newresult = newresult.filter(
          (e) => e.source.COLUMN_DEFAULT != e.destination.COLUMN_DEFAULT
        );

        setresult(newresult);
        resolve(newresult);
      } else if (key == 4) {
        newresult = newresult.filter(
          (e) => e.source.COLUMN_KEY !== e.destination.COLUMN_KEY
        );

        setresult(newresult);
        resolve(newresult);
      } else if (key == 5) {
        // missing
        newresult = newresult.filter((e) => e.destination.COLUMN_NAME == "" || e.source.COLUMN_NAME =="");

        setresult(newresult);
        resolve(newresult);
      } 
      else if (key==6){
        newresult = newresult.filter((e) => e.color=='table-warning' || e.color=='table-danger' && e.destination.COLUMN_NAME =='');

        setresult(newresult);
        resolve(newresult);
      }
      else {
        console.log("last", newresult);
        setresult(newresult);
        resolve(newresult);
      }
      setloader(false)
    });
    
  };
  React.useEffect(() => {
    setloader(true)
    async function fetchData() {
      await applyFilters(filters);
    }
    fetchData();
    // console.log("EHlkl", filters);
  }, [filters]);
 const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([genScript], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "myFile.sql";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }
  const findTablesForAlter = (arr) => {
    console.log(arr)
    let tempArray = arr;
    let finalresponse = [];
    let finalScript=""; 

    tempArray.forEach((element) => {
      // TABLE_NAME: element.TABLE_NAME,
      //       COLUMN_NAME: element.COLUMN_NAME,
      //       COLUMN_DEFAULT: element.COLUMN_DEFAULT,
      //       IS_NULLABLE: element.IS_NULLABLE,
      //       COLUMN_TYPE: element.COLUMN_TYPE,
      //       COLUMN_KEY: element.COLUMN_KEY,
      //       EXTRA: element.EXTRA,
      //ALTER TABLE `test`.`mst_cat` 
      // ADD COLUMN `wef` VARCHAR(45) NULL ,
      // CHANGE COLUMN `cat_img` `cat_img` VARCHAR(100) NULL DEFAULT NULL ;


      //  ADD UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE;
      //ADD PRIMARY KEY (`id`);

      let checkExsit=finalresponse.find(e=>e.table_name==element.source.TABLE_NAME)
       let keys=`${element.source.COLUMN_TYPE} ${element.source.IS_NULLABLE=='YES'?"NULL":"NOT NULL"}   ${element.source.IS_NULLABLE=='NO'  && !element.source.COLUMN_DEFAULT    ? "":   "DEFAULT " +element.source.COLUMN_DEFAULT}  ${element.source.EXTRA =='DEFAULT_GENERATED'?"":element.source.EXTRA}`

      // console.log(element.source.COLUMN_DEFAULT)
       if(element.source.COLUMN_KEY !='' &&  element.source.COLUMN_KEY !=  element.destination.COLUMN_KEY){
           if(element.source.COLUMN_KEY =='UNI')  keys += `, ADD UNIQUE INDEX ${element.source.COLUMN_NAME}_UNIQUE (${element.source.COLUMN_NAME} ASC) VISIBLE`
           else if (element.source.COLUMN_KEY =='PRI') keys +=`, ADD PRIMARY KEY (${element.source.COLUMN_NAME}) `
           else if (element.source.COLUMN_KEY=='MUL') keys += `, ADD INDEX ${element.source.TABLE_NAME}_${element.source.COLUMN_NAME}_index  (${element.source.COLUMN_NAME} ASC) VISIBLE `
           console.log(keys) }
      //  }ADD INDEX `oauth_auth_codes_user_id_index` (`user_id` ASC) VISIBLE;
        if(element.color=='table-warning'){
          // edit
          if(!checkExsit){
            finalresponse.push({
              table_name:element.source.TABLE_NAME,
              script:`ALTER TABLE  ${element.source.TABLE_NAME}  CHANGE COLUMN  ${element.source.COLUMN_NAME}  ${element.source.COLUMN_NAME} `+keys,
              
            })
          }
          else {
            checkExsit.script += `, CHANGE COLUMN  ${element.source.COLUMN_NAME}  ${element.source.COLUMN_NAME} `+keys
          }
          
        }
        if(element.color=='table-danger' && element.destination.TABLE_NAME ==''){
          // add
          if(!checkExsit){
            finalresponse.push({
              table_name:element.source.TABLE_NAME,
              script:`ALTER TABLE  ${element.source.TABLE_NAME}  ADD COLUMN  ${element.source.COLUMN_NAME}   `+keys,
              
              
            })
          } 
          else{
            checkExsit.script += `, ADD COLUMN  ${element.source.COLUMN_NAME}  `+keys
          }
          
        }
      
    
       
    });
    finalresponse.forEach((element,index) => {
      // if(index==0){
        finalScript += `${element.script} ;`
      // }
       
      
    });
    console.log(finalScript);
    setgenScript(finalScript)

  };
  return (
    <div>
      {!validation ? (
        "Please Reconnect Server to Fetch"
      ) : (
        <>
          <button
            className="btn btn-danger"
            onClick={() => {
              findTablesForAlter(result);
            }}
          >
            {" "}
            get script
          </button>
          {genScript&&
          <button onClick={downloadTxtFile}>Download txt</button> }
          
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="btn btn-success"
            table="table-to-xls"
            filename="tablexls"
            sheet="tablexls"
            buttonText="Download as XLS"
          />

          <select
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => {
              setfilters(e.target.value);
            }}
          >
            {/* <option selected>filters</option> */}
            <option defaultValue value="0">
              all
            </option>
            <option value="1">diff by COLUMN_TYPE</option>
            <option value="2">diff by IS_NULLABLE</option>
            <option value="3">diff by COLUMN_DEFAULT</option>
            <option value="4">diff by COLUMN_KEY</option>
            <option value="5">missing columns</option>
            <option value="6">Any diff</option>
            
          </select>
          <table id="table-to-xls" class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Source TABLE_NAME</th>
                <th scope="col">Source COLUMN_NAME</th>
                <th scope="col">Source COLUMN_DEFAULT</th>
                <th scope="col">Source IS_NULLABLE</th>
                <th scope="col">Source COLUMN_TYPE</th>
                <th scope="col">Source COLUMN_KEY</th>
                <th scope="col">Source EXTRA</th>

                {/*  */}
                <th scope="col">Destination TABLE_NAME</th>
                <th scope="col">Destination COLUMN_NAME</th>
                <th scope="col">Destination COLUMN_DEFAULT</th>
                <th scope="col">Destination IS_NULLABLE</th>
                <th scope="col">Destination COLUMN_TYPE</th>
                <th scope="col">Destination COLUMN_KEY</th>
                <th scope="col">Destination EXTRA</th>
              </tr>
            </thead>
            <tbody>
              {result.length &&
                result.map((e, index) => {
                  return <SingleColumnRow row={e} index={index} />;
                })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ColumnWise;
