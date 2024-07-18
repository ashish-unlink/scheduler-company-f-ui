import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import React, { useState } from "react";

export const PaginationDatagrid = ({
  row,
  columns,
  setPagination,
  pagination,
  rowCounts,
}: {
  row: any;
  columns: any;
  rowCounts: number;
  setPagination: (model: GridPaginationModel) => void;
  pagination: { page: number; pageSize: number };
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={row}
        columns={columns}
        disableRowSelectionOnClick
        rowCount={rowCounts}
        pagination
        paginationModel={pagination}
        paginationMode="server"
        onPaginationModelChange={setPagination}
        loading={loading}
      />
    </div>
  );
};
