import React, { Component } from "react";
import _ from "lodash";

class TableBody extends Component {
    renderCell = (item, column) => {
        if (column.content) return column.content(item);

        return _.get(item, column.path);
    };

    createKey = (item, column) => {
        return item._id + (column.path || column.key);
    };

    render() {
        const { data, columns, rowOnClick } = this.props;

        const displayedColumns = columns.filter(
            (x) => x.visible === undefined || x.visible === true,
        );

        return (
            <tbody>
                {data.map((item) => (
                    <tr
                        style={rowOnClick !== undefined ? { cursor: "pointer" } : {}}
                        key={item.stepId}
                        onClick={() => {
                            console.log("clicked");
                            if (rowOnClick !== undefined) {
                                console.log("e");
                                rowOnClick(item._id);
                            }
                        }}
                    >
                        {displayedColumns.map((column) => (
                            <td className="p-1" key={this.createKey(item, column)}>
                                {this.renderCell(item, column)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        );
    }
}

export default TableBody;
