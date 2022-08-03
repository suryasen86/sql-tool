import React ,{useState}from "react";
import SingleColumnRow from "./SingleColumnRow";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const ColumnWise = ({ result,validation }) => {
  let newresult=result

  const [filters, setfilters] = useState(0);
  const applyFilters=(key)=>{
    return new Promise((reject ,resolve)=>{
        if(key==1){
          console.log(newresult)
          newresult=  newresult.filter(e => e.source.COLUMN_TYPE !== e.destination.COLUMN_TYPE )
          console.log("key 1 ")
          console.log(newresult)
          resolve(newresult)
        }
        else if (key==2){
          console.log("key 2 ")
          resolve(newresult)
        }
        else {
          console.log("last")
          resolve(newresult)
        }
    })
  }
  React.useEffect(() => {
    async function fetchData() {
      await  applyFilters(filters)
    }
    fetchData();
    console.log("EHlkl",filters)
  }, [filters]);


  const findTablesForAlter=(arr)=>{
    let tempArray=arr
    let faltyTables=[]
    tempArray.forEach(element => {
            faltyTables.push()
      });
      console.log(arr)
  }
  return (

    <div>
    {!validation ?"Please Reconnect Server to Fetch":   <>
    <button className="btn btn-danger"
      onClick={()=>{
        findTablesForAlter(result)
      }}
    > get script</button>
   <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn btn-success"
                    table="table-to-xls"
                    filename="tablexls"
                    sheet="tablexls"
                    buttonText="Download as XLS"/>
         
         <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => {
                  setfilters(e.target.value);
                }}
              >
                {/* <option selected>filters</option> */}
                <option selected value="0">all</option>
                <option value="1">diff by COLUMN_TYPE</option>
                <option value="2">diff by IS_NULLABLE</option>
                <option value="3">diff by COLUMN_DEFAULT</option>
              </select>
      <table id="table-to-xls" class="table" >
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
        {newresult.length &&
        newresult.map((e,index) => {
          return <SingleColumnRow row={e} index={index}/>;
        })}
       
      
        </tbody>
      </table>

   </> 
      
    }

    </div>
  );
};

export default ColumnWise;
