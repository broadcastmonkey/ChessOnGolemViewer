import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
import { Table } from "react-bootstrap";

const GenericTable = ({ columns, sortColumn, onSort, data, rowOnClick }) => {
    let i = 0;
    data.forEach((x) => {
        if (x._id === undefined) x._id = i++;
    });

    return (
        <Table striped hover bordered>
            <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
            <TableBody rowOnClick={rowOnClick} columns={columns} data={data} />
        </Table>
    );
};

export default GenericTable;
