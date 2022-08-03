import React from "react";

const SingleColumnRow = ({ row, index }) => {
//   console.log(row);
  let {color,destination,source}=row

  return (
    <tr className={color}>
      <th scope="row">{index + 1}</th>
       
      <td >{source.TABLE_NAME}</td>
      <td >{source.COLUMN_NAME}</td>
      <td className={source.COLUMN_DEFAULT==destination.COLUMN_DEFAULT?"":"table-danger"}>{source.COLUMN_DEFAULT}</td>
      <td className={source.IS_NULLABLE==destination.IS_NULLABLE?"":"table-danger"}>{source.IS_NULLABLE}</td>
      <td className={source.COLUMN_TYPE==destination.COLUMN_TYPE?"":"table-danger"}>{source.COLUMN_TYPE}</td>
      <td className={source.COLUMN_KEY==destination.COLUMN_KEY?"":"table-danger"}>{source.COLUMN_KEY}</td>
      <td className={source.EXTRA==destination.EXTRA?"":"table-danger"}>{source.EXTRA}</td>

       
      <td >{destination.TABLE_NAME}</td>
      <td>{destination.COLUMN_NAME}</td>
      <td className={source.COLUMN_DEFAULT==destination.COLUMN_DEFAULT?"":"table-danger"}>{destination.COLUMN_DEFAULT}</td>
      <td className={source.IS_NULLABLE==destination.IS_NULLABLE?"":"table-danger"}>{destination.IS_NULLABLE}</td>
      <td className={source.COLUMN_TYPE==destination.COLUMN_TYPE?"":"table-danger"}>{destination.COLUMN_TYPE}</td>
      <td className={source.COLUMN_KEY==destination.COLUMN_KEY?"":"table-danger"}>{destination.COLUMN_KEY}</td>
      <td className={source.EXTRA==destination.EXTRA?"":"table-danger"}>{destination.EXTRA}</td>
      
    </tr>
  );
};

export default SingleColumnRow;
