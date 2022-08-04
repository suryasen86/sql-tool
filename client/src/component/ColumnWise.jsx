import React, { useState } from "react";
import SingleColumnRow from "./SingleColumnRow";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const ColumnWise = ({ result, validation, setresult, rowData,setloader }) => {
  // let backup=result

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
      } else {
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

  const findTablesForAlter = (arr) => {
    let tempArray = arr;
    let faltyTables = [];
    tempArray.forEach((element) => {
      faltyTables.push();
    });
    console.log(arr);
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
