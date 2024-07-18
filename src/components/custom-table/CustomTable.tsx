import { DataGrid } from "@mui/x-data-grid";
import "./customTable.css";
import DeleteModal from "../delete-confirmation/DeleteModal";
import { useAppDispatch, useAppSelector } from "../../redux";
import { selectAppointmentDeleteModal } from "../../redux/appointment/selector";
import {
  deleteAppointment,
  setShowAppointmentDeleteModal,
} from "../../redux/appointment/slice";
import { constantString } from "../../utils/constantString";
import { useTranslation } from "react-i18next";

export default function CustomTable({ columns, rows = [], columnHeaderHeight = 34, rowHeight = 34, checkBoxSelection=false}: any) {
  const showDeletePopup = useAppSelector(selectAppointmentDeleteModal);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <>
      <DataGrid
        getRowClassName={() => `super-app-theme--custom-table`}
        columnHeaderHeight={columnHeaderHeight}
        rowHeight={rowHeight}
        localeText={{ noRowsLabel: "" }}
        disableColumnMenu
        rows={rows}
        columns={columns}
        getRowId={(row: any) => row.id}
        hideFooter
        checkboxSelection = {checkBoxSelection}
      />

      {showDeletePopup && (
        <DeleteModal
          open={showDeletePopup}
          onClose={() => dispatch(setShowAppointmentDeleteModal(null))}
          confirmDelete={() => {
            dispatch(deleteAppointment(showDeletePopup));
            dispatch(setShowAppointmentDeleteModal(null));
          }}
          heading={t(constantString.CONFIRM_DELETE)}
          title={t(constantString.DELETE)}
        />
      )}
    </>
  );
}
