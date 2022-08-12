// import React, { useState } from "react";
import React, { useState, useEffect } from "react";
import "./styels/index.css";
import axios from "axios";
import { useAlert } from "react-alert";
import ColumnWise from "./component/ColumnWise";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Spinner from "./component/Spinner";
const New = () => {
  const url = "http://localhost:4000";
  const [missingTables, setmissingTables] = useState(false);
  const [tablescriptgen, settablescriptgen] = useState(false);
  const copyScript = async (tableName, conType) => {
    let obj = cred[conType];

    let body = {
      obj,
      tableName,
    };
    let { data } = await axios.post(`${url}/copy`, body);

    if (data.status !== 200) {
      return alert.error(data.message);
    }
    return data.data
    // navigator.clipboard.writeText();

    // alert.success("Sript Copied");
  };

  const [cred, setcred] = useState(false);
  useEffect(() => {
    let cred = localStorage.getItem("cred");
    if (cred) {
      cred = JSON.parse(cred);
      setcred(cred);
      setIp(cred.source.ip);
      setSchema(cred.source.database);
      setPass(cred.source.password);
      setport(cred.source.port);
      setUser(cred.source.user);
      set_d_Ip(cred.destination.ip);
      set_d_User(cred.destination.user);
      set_d_Schema(cred.destination.database);
      set_d_Pass(cred.destination.password);
      set_d_port(cred.destination.port);
    }
  }, []);

  const mappingForTableWise = (soruce, destination) => {
    return new Promise((resolve, reject) => {
      let innderSource = soruce;
      let innerDestination = destination;
      let result = [];

      innderSource.forEach((element) => {
        let obj = innerDestination.find(
          (e) => e.TABLE_NAME == element.TABLE_NAME
        );
        if (obj) {
          if (obj.TABLE_COLLATION == element.TABLE_COLLATION) {
            result.push({
              source: {
                name: element.TABLE_NAME,
                colletion: element.TABLE_COLLATION,
              },
              destinantion: {
                name: obj.TABLE_NAME,
                colletion: obj.TABLE_COLLATION,
              },
              color: "no",
            });
          } else {
            result.push({
              source: {
                name: element.TABLE_NAME,
                colletion: element.TABLE_COLLATION,
              },
              destinantion: {
                name: obj.TABLE_NAME,
                colletion: obj.TABLE_COLLATION,
              },
              color: "table-warning",
            });
          }

          innerDestination = innerDestination.filter(
            (word) => word.TABLE_NAME != obj.TABLE_NAME
          );
        } else {
          result.push({
            source: {
              name: element.TABLE_NAME,
              colletion: element.TABLE_COLLATION,
            },
            destinantion: {
              name: "",
              colletion: "",
            },
            color: "table-danger",
          });
        }
      });
      if (innerDestination.length) {
        innerDestination.forEach((element) => {
          result.push({
            source: {
              name: "",
              colletion: "",
            },
            destinantion: {
              name: element.TABLE_NAME,
              colletion: element.TABLE_COLLATION,
            },
            color: "table-danger",
          });
        });
      }
      // console.log(result);

      setAllRows(result);
      if (result.length) {
        resolve(true);
      } else {
        reject("Error Mapping Source And Destination");
      }
    });
  };
  const mappingForColumnWise = (source, destination) => {
    return new Promise((resolve, reject) => {
      let innerSource = source;
      let innerDestination = destination;
      let result = [];

      innerSource.forEach((element) => {
        let obj = innerDestination.find(
          (e) =>
            e.TABLE_NAME == element.TABLE_NAME &&
            e.COLUMN_NAME == element.COLUMN_NAME
        );
        if (obj) {
          // checking for similarity
          if (
            element.IS_NULLABLE == obj.IS_NULLABLE &&
            element.COLUMN_DEFAULT == obj.COLUMN_DEFAULT &&
            element.COLUMN_TYPE == obj.COLUMN_TYPE &&
            element.COLUMN_KEY == obj.COLUMN_KEY &&
            element.EXTRA == obj.EXTRA
          ) {
            result.push({
              source: {
                TABLE_NAME: element.TABLE_NAME,
                COLUMN_NAME: element.COLUMN_NAME,
                COLUMN_DEFAULT: element.COLUMN_DEFAULT,
                IS_NULLABLE: element.IS_NULLABLE,
                COLUMN_TYPE: element.COLUMN_TYPE,
                COLUMN_KEY: element.COLUMN_KEY,
                EXTRA: element.EXTRA,
              },
              destination: {
                TABLE_NAME: obj.TABLE_NAME,
                COLUMN_NAME: obj.COLUMN_NAME,
                COLUMN_DEFAULT: obj.COLUMN_DEFAULT,
                IS_NULLABLE: obj.IS_NULLABLE,
                COLUMN_TYPE: obj.COLUMN_TYPE,
                COLUMN_KEY: obj.COLUMN_KEY,
                EXTRA: obj.EXTRA,
              },
              color: "no",
            });
          } else if (
            element.COLUMN_TYPE.includes("int") &&
            obj.COLUMN_TYPE.includes("int") &&
            element.IS_NULLABLE == obj.IS_NULLABLE &&
            element.COLUMN_DEFAULT == obj.COLUMN_DEFAULT &&
            element.COLUMN_KEY == obj.COLUMN_KEY &&
            element.EXTRA == obj.EXTRA
          ) {
            result.push({
              source: {
                TABLE_NAME: element.TABLE_NAME,
                COLUMN_NAME: element.COLUMN_NAME,
                COLUMN_DEFAULT: element.COLUMN_DEFAULT,
                IS_NULLABLE: element.IS_NULLABLE,
                COLUMN_TYPE: element.COLUMN_TYPE,
                COLUMN_KEY: element.COLUMN_KEY,
                EXTRA: element.EXTRA,
              },
              destination: {
                TABLE_NAME: obj.TABLE_NAME,
                COLUMN_NAME: obj.COLUMN_NAME,
                COLUMN_DEFAULT: obj.COLUMN_DEFAULT,
                IS_NULLABLE: obj.IS_NULLABLE,
                COLUMN_TYPE: obj.COLUMN_TYPE,
                COLUMN_KEY: obj.COLUMN_KEY,
                EXTRA: obj.EXTRA,
              },
              color: "no",
            });
          } else {
            result.push({
              source: {
                TABLE_NAME: element.TABLE_NAME,
                COLUMN_NAME: element.COLUMN_NAME,
                COLUMN_DEFAULT: element.COLUMN_DEFAULT,
                IS_NULLABLE: element.IS_NULLABLE,
                COLUMN_TYPE: element.COLUMN_TYPE,
                COLUMN_KEY: element.COLUMN_KEY,
                EXTRA: element.EXTRA,
              },
              destination: {
                TABLE_NAME: obj.TABLE_NAME,
                COLUMN_NAME: obj.COLUMN_NAME,
                COLUMN_DEFAULT: obj.COLUMN_DEFAULT,
                IS_NULLABLE: obj.IS_NULLABLE,
                COLUMN_TYPE: obj.COLUMN_TYPE,
                COLUMN_KEY: obj.COLUMN_KEY,
                EXTRA: obj.EXTRA,
              },
              color: "table-warning",
            });
          }
          // innerDestination
          innerDestination = innerDestination.filter((word) => word != obj);
        } else {
          result.push({
            source: {
              TABLE_NAME: element.TABLE_NAME,
              COLUMN_NAME: element.COLUMN_NAME,
              COLUMN_DEFAULT: element.COLUMN_DEFAULT,
              IS_NULLABLE: element.IS_NULLABLE,
              COLUMN_TYPE: element.COLUMN_TYPE,
              COLUMN_KEY: element.COLUMN_KEY,
              EXTRA: element.EXTRA,
            },
            destination: {
              TABLE_NAME: "",
              COLUMN_NAME: "",
              COLUMN_DEFAULT: "",
              IS_NULLABLE: "",
              COLUMN_TYPE: "",
              COLUMN_KEY: "",
              EXTRA: "",
            },
            color: "table-danger",
          });
        }
      });
      if (innerDestination.length) {
        innerDestination.forEach((obj) => {
          result.push({
            source: {
              TABLE_NAME: "",
              COLUMN_NAME: "",
              COLUMN_DEFAULT: "",
              IS_NULLABLE: "",
              COLUMN_TYPE: "",
              COLUMN_KEY: "",
              EXTRA: "",
            },
            destination: {
              TABLE_NAME: obj.TABLE_NAME,
              COLUMN_NAME: obj.COLUMN_NAME,
              COLUMN_DEFAULT: obj.COLUMN_DEFAULT,
              IS_NULLABLE: obj.IS_NULLABLE,
              COLUMN_TYPE: obj.COLUMN_TYPE,
              COLUMN_KEY: obj.COLUMN_KEY,
              EXTRA: obj.EXTRA,
            },
            color: "table-danger",
          });
        });
      }
      // console.log(Array.isArray(missingTables))
      // console.log(missingTables)
      let temp = [];
      if (!Array.isArray(missingTables)) {
        return reject("Error in Finding Missing values");
      }
      // result.filter(e=> !missingTables.includes(e.source.TABLE_NAME))
      //
      //  console.log(missingTables)
      result.forEach((element) => {
        // console.log(element.source.TABLE_NAME)
        // console.log(!missingTables.includes(element.source.TABLE_NAME))
        if (!missingTables.includes(element.source.TABLE_NAME)) {
          temp.push(element);
        }
      });
      // console.log(temp.length)
      setAllColumnWiseData(temp);
      setAllColumnWiseData2(temp);
      resolve(temp.length);
      // console.log(result.length)
    });
  };
  const runValidation = () => {
    if (s_ip === "") {
      alert.error("Please Fill Source Ip address");
      return false;
    }
    if (s_user === "") {
      alert.error("Please Fill Source User Name");
      return false;
    }
    if (s_Schema === "") {
      alert.error("Please Fill Source Schema Name");
      return false;
    }
    if (s_pass === "") {
      alert.error("Please Fill Source Password");
      return false;
    }
    if (s_port === "") {
      alert.error("Please Fill Source  Port");
      return false;
    }

    // destination
    if (d_ip === "") {
      alert.error("Please Fill destinantion Ip address");
      return false;
    }
    if (d_user === "") {
      alert.error("Please Fill destinantion User Name");
      return false;
    }
    if (d_Schema === "") {
      alert.error("Please Fill destinantion Schema Name");
      return false;
    }
    // if (d_pass === "") {
    //   alert.error("Please Fill destinantion Password");
    //   return false;
    // }
    if (d_port === "") {
      alert.error("Please Fill destinantion  Port");
      return false;
    }
    return true;
  };
  const findMissingTables = (arr) => {
    // console.log(arr)
    return new Promise((resolve, reject) => {
      let array = arr;
      let missingValues = [];
      if (!array.length) {
        return reject("Error In Finding Mising Valuse");
      }
      array.forEach((e) => {
        if (e.destinantion.colletion == "" && e.destinantion.name == "") {
          if (!missingValues.includes(e.source.name)) {
            missingValues.push(e.source.name);
          }
        }
      });
      setmissingTables(missingValues);
      // console.log(missingValues)
      resolve(missingValues);
    });
  };
  const handleOnclikc = (id) => {
    if (id === tab) return;
    settab(id);
    setloader(true);
  };
  const [tab, settab] = useState(1);
  const alert = useAlert();
  const [loader, setloader] = useState(false);
  const [filters, setfilters] = useState(0);
  const [destinationTables, setDestinationTables] = useState([]);
  const [soruceTables, setSoruceTables] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [sourceColumnWise, setsourceColumnWise] = useState([]);
  const [destinationColumnWise, setdestinationColumnWise] = useState([]);
  const [allColumnWiseData, setAllColumnWiseData] = useState([]);
  const [allColumnWiseData2, setAllColumnWiseData2] = useState([]);
  const [s_ip, setIp] = useState("");
  const [s_user, setUser] = useState("");
  const [s_Schema, setSchema] = useState(cred?.source?.database);
  const [s_pass, setPass] = useState("");
  const [s_port, setport] = useState("");
  const [d_ip, set_d_Ip] = useState("");
  const [d_user, set_d_User] = useState("");
  const [d_Schema, set_d_Schema] = useState("");
  const [d_pass, set_d_Pass] = useState("");
  const [d_port, set_d_port] = useState("");

  const HandleOnClick = async () => {
    try {
      if (!runValidation()) return;
      let body = {
        source: {
          ip: s_ip,
          user: s_user,
          database: s_Schema,
          password: s_pass,
          port: s_port,
        },
        destination: {
          ip: d_ip,
          user: d_user,
          database: d_Schema,
          password: d_pass,
          port: d_port,
        },
      };
      localStorage.setItem("cred", JSON.stringify(body));
      let { data } = await axios.post(`${url}/connection`, body);

      if (data.status !== 200) {
        return alert.error(data.message);
      }
      // alert.success(data.message);
      setSoruceTables([]);
      setDestinationTables([]);
      setsourceColumnWise([]);
      setdestinationColumnWise([]);
      let {
        sourceResult,
        destinationResult,
        destinantionColumnWise,
        sourecColumnWise,
      } = data.data;
      console.log(     sourceResult,
        destinationResult,
        destinantionColumnWise,
        sourecColumnWise)
      setSoruceTables(sourceResult);
      setDestinationTables(destinationResult);
      setsourceColumnWise(sourecColumnWise);
      setdestinationColumnWise(destinantionColumnWise);
      await mappingForTableWise(soruceTables, destinationTables);

      await mappingForColumnWise(sourceColumnWise, destinationColumnWise);
    } catch (error) {
      alert.error(error.message || "Reconnect With data Base");
    }
  };
  useEffect(() => {
    setloader(false);
    if (tab === 1) {
      mappingForTableWise(soruceTables, destinationTables);
    } else {
      mappingForColumnWise(sourceColumnWise, destinationColumnWise);
    }
  }, [tab]);
  useEffect(() => {
    async function fetchData() {
      await findMissingTables(allRows);
    }
    fetchData();
  }, [allRows]);

  useEffect(()=>{
    settablescriptgen(false)
  },[filters])
  const HandleGanrateScirpt=async ()=>{
    let singleScript=""
    let allinputChecked=document.querySelectorAll('input[type="checkbox"]:checked');
    // console.log(allinputChecked)
    for (let index = 0; index < allinputChecked.length; index++) {
      const element = allinputChecked[index];
       
      let data= await copyScript(element.value,'source')
      singleScript +=`${data} ;`

    }
    settablescriptgen(singleScript);

  }
  const downloadTxtFile=()=>{
    const element = document.createElement("a");
    const file = new Blob([tablescriptgen], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "myFile.sql";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  return (
    <>
      <div className="container">
        <div class="dropdown">
          <img style={{cursor:'pointer'}}
            src="https://img.icons8.com/ios-glyphs/30/000000/exit.png"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          />

          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item" href="#">
               logout
              </a>
            </li>
       
          </ul>
        </div>
        <div className="solid">
          <div className="row">
            <div className="col-6">
              <h3>Source</h3>
              <div className="">
                <label className="label">IP</label>
                <input
                  type="text"
                  className="inputButton"
                  placeholder="First name"
                  onChange={(e) => setIp(e.target.value)}
                  value={s_ip}
                />
              </div>
              <div className="">
                <label className="label">User Name</label>
                <input
                  type="text"
                  className="inputButton"
                  placeholder="Last name"
                  onChange={(e) => setUser(e.target.value)}
                  value={s_user}
                />
              </div>
              <div className="">
                <label className="label">Schema</label>
                <input
                  type="text"
                  className="inputButton"
                  placeholder="Enter text"
                  onChange={(e) => setSchema(e.target.value)}
                  value={s_Schema}
                />
              </div>
              <div className="">
                <label className="label">Password</label>
                <input
                  type="password"
                  className="inputButton"
                  placeholder="Enter password"
                  onChange={(e) => setPass(e.target.value)}
                  value={s_pass}
                />
              </div>
              <div className="">
                <label className="label">Port</label>
                <input
                  type="port"
                  className="inputButton"
                  placeholder="Enter port"
                  onChange={(e) => setport(e.target.value)}
                  value={s_port}
                />
              </div>
            </div>

            <div className="col-6">
              <h4>Destination</h4>
              <div className="">
                <label className="label">IP</label>
                <input
                  type="text"
                  className="inputButton"
                  placeholder="First name"
                  onChange={(e) => set_d_Ip(e.target.value)}
                  value={d_ip}
                />
              </div>
              <div className="">
                <label className="label">User Name</label>
                <input
                  type="text"
                  className="inputButton"
                  placeholder="Last name"
                  onChange={(e) => set_d_User(e.target.value)}
                  value={d_user}
                />
              </div>
              <div className="">
                <label className="label">Schema</label>
                <input
                  type="text"
                  className="inputButton"
                  placeholder="Enter text"
                  onChange={(e) => set_d_Schema(e.target.value)}
                  value={d_Schema}
                />
              </div>
              <div className="">
                <label className="label">Password</label>
                <input
                  type="password"
                  className="inputButton"
                  placeholder="Enter password"
                  onChange={(e) => set_d_Pass(e.target.value)}
                  value={d_pass}
                />
              </div>
              <div className="">
                <label className="label">Port</label>
                <input
                  type="port"
                  className="inputButton"
                  placeholder="Enter port"
                  onChange={(e) => set_d_port(e.target.value)}
                  value={d_port}
                />
              </div>
            </div>
            <div className="container-fluid">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={HandleOnClick}
              >
                Connect
              </button>
            </div>
          </div>
        </div>
        {/* tab switch */}
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              onClick={() => {
                handleOnclikc(1);
              }}
              className={tab == 1 ? "nav-link active" : "nav-link"}
              aria-current="page"
            >
              Table wise
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={() => {
                handleOnclikc(2);
              }}
              className={tab == 2 ? "nav-link active" : "nav-link"}
            >
              Column wise
            </a>
          </li>
        </ul>
        {loader && <Spinner />}

        {/* tab switch */}
        {tab == 1 ? (
          <div className="row mt-5">
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="btn btn-success"
              table="table-to-xls2"
              filename="tablexls"
              sheet="tablexls"
              buttonText="Download as XLS"
            />
            <button className="btn btn-danger" onClick={HandleGanrateScirpt}> Genrate script</button>
            {/* butt */}
            {tablescriptgen&&
          <button className="btn btn-warning mx-1" onClick={downloadTxtFile}>Download Script</button> }

            <div className="d-flex justify-content-between ">
              <h4>Table compairison</h4>
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => {
                  setfilters(e.target.value);
                }}
              >
                <option selected>filters</option>
                <option value="1">all</option>
                <option value="2">missing left to right</option>
                <option value="3">missing right to left</option>
                <option value="4">collation issue</option>
              </select>
            </div>

            <div className="col-6">
              <h5>source</h5>
            </div>
            <div className="col-6">
              <h5>destinantion</h5>
            </div>
            <table className="table" id="table-to-xls2">
              <thead>
                <tr>
                  <th>Check</th>
                  <th scope="col">#</th>
                  <th scope="col">SOURCE TABLE_COLLATION</th>
                  <th scope="col">SOURCE TABLE_NAME</th>
                  <th scope="col">DESTINATION TABLE_COLLATION</th>
                  <th scope="col">DESTINATION TABLE_NAME</th>
                </tr>
              </thead>
              <tbody>
                {allRows.length &&
                  allRows.map((e, index) => {
                    if (filters == 0 || filters == 1) {
                      return (
                        
                        <tr key={index} className={e.color}>
                          <input type="checkbox" name="checkbox" value={e.source.name}/>
                          <th scope="row">{index + 1}</th>
                          <td>{e.source.colletion}</td>
                          <td
                            onClick={() => {
                              copyScript(e.source.name, "source");
                            }}
                          >
                            {e.source.name}
                          </td>
                          <td>{e.destinantion.colletion}</td>
                          <td
                            onClick={() => {
                              copyScript(e.destinantion.name, "destination");
                            }}
                          >
                            {e.destinantion.name}
                          </td>
                        </tr>
                      );
                    } else if (filters == 2) {
                      if (
                        e.destinantion.colletion == "" &&
                        e.destinantion.name == ""
                      ) {
                        return (
                          <tr key={index} className={e.color}>
                           <input type="checkbox" name="checkbox" value={e.source.name}/>
                            <th scope="row">{index + 1}</th>
                            <td>{e.source.colletion}</td>
                            <td
                              onClick={() => {
                                copyScript(e.source.name, "source");
                              }}
                            >
                              {e.source.name}
                            </td>
                            <td>{e.destinantion.colletion}</td>
                            <td>{e.destinantion.name}</td>
                          </tr>
                        );
                      }
                    } else if (filters == 3) {
                      if (e.source.colletion == "" && e.source.name == "") {
                        return (
                          <tr key={index} className={e.color}>
                            <input type="checkbox" name="checkbox" value={e.source.name}/>
                            <th scope="row">{index + 1}</th>
                            <td
                              onClick={() => {
                                copyScript(e.source.name, "source");
                              }}
                            >
                              {e.source.colletion}
                            </td>
                            <td>{e.source.name}</td>
                            <td>{e.destinantion.colletion}</td>
                            <td
                              onClick={() => {
                                copyScript(e.destinantion.name, "destination");
                              }}
                            >
                              {e.destinantion.name}
                            </td>
                          </tr>
                        );
                      }
                    } else if (filters == 4) {
                      if (e.color == "table-warning") {
                        return (
                          <tr key={index} className={e.color}>
                            <input type="checkbox" name="checkbox" value={e.source.name}/>
                            <th scope="row">{index + 1}</th>
                            <td
                              onClick={() => {
                                copyScript(e.source.name, "source");
                              }}
                            >
                              {e.source.colletion}
                            </td>
                            <td>{e.source.name}</td>
                            <td>{e.destinantion.colletion}</td>
                            <td
                              onClick={() => {
                                copyScript(e.destinantion.name, "destination");
                              }}
                            >
                              {e.destinantion.name}
                            </td>
                          </tr>
                        );
                      }
                    } else {
                      return (
                        <tr key={index} className={e.color}>
                          <input type="checkbox" name="checkbox" value={e.source.name}/>
                          <th scope="row">{index + 1}</th>
                          <td
                            onClick={() => {
                              copyScript(e.source.name, "source");
                            }}
                          >
                            {e.source.colletion}
                          </td>
                          <td>{e.source.name}</td>
                          <td>{e.destinantion.colletion}</td>
                          <td
                            onClick={() => {
                              copyScript(e.destinantion.name, "destination");
                            }}
                          >
                            {e.destinantion.name}
                          </td>
                        </tr>
                      );
                    }
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <ColumnWise
            result={allColumnWiseData}
            rowData={allColumnWiseData2}
            setloader={setloader}
            setresult={setAllColumnWiseData}
            validation={Array.isArray(missingTables)}
          />
        )}
      </div>
    </>
  );
};

export default New;
