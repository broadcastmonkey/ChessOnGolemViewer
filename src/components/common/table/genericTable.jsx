import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
import { Table } from "react-bootstrap";

const GenericTable = ({ columns, sortColumn, onSort, data, rowOnClick }) => {
    return (
        <Table striped hover bordered table-info>
            <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
            <TableBody rowOnClick={rowOnClick} columns={columns} data={data} />
        </Table>
    );
};

export default GenericTable;
