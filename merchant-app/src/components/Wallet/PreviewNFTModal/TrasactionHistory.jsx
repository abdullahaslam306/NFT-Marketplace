import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Typography, Pagination } from "@mui/material";
import { actions } from "../../../actions";
import { useTheme } from "@mui/system";
import { useMediaQuery } from "@mui/material";
import {
  DatetoHumanReadableUTC,
  statusCustomValue,
} from "../../../utils/helper";

const columns = [
  { id: "eventName", label: "Event", minWidth: 170, align: "left" },
  { id: "price", label: "Price", minWidth: 100, align: "left" },
  {
    id: "fromWalletAddress",
    label: "From",
    minWidth: 200,
    align: "left",
  },
  {
    id: "toWalletAddress",
    label: "To",
    minWidth: 200,
    align: "left",
  },
  {
    id: "eventTime",
    label: "Date",
    minWidth: 200,
    align: "left",
    format: (value) => {
      return DatetoHumanReadableUTC(value);
    },
  },
];

export function TrasactionHistory({ trasactionHistory }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = React.useState(0);
  const [currentPage, setcurrentPage] = React.useState(1);
  const nftReducer = useSelector((state) => (state && state.nftReducer) || {});
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const { id } = useSelector((state) => state.nftReducer?.nftInfoById || {});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    dispatch(
      actions.nftActions.getTransactionHistoryByIDAction(
        true,
        id,
        newPage * 10,
        10
      )
    );
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    dispatch(
      actions.nftActions.getTransactionHistoryByIDAction(
        true,
        id,
        0,
        +event.target.value
      )
    );
  };

  React.useEffect(() => {
    if (trasactionHistory?.data?.length) {
      setData(trasactionHistory?.data);
    }
    setTotalCount(trasactionHistory?.meta?.totalRecords || 0);
  }, [trasactionHistory]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <>
        <TableContainer
          sx={{
            "&::-webkit-scrollbar": {
              width: "5px",
              height: "8px",
              scrollbarWidth: "thin",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#353841",
              marginTop: "10px",
              marginBottom: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#24D182",
              borderRadius: 2,
            },
            maxHeight: 440,
          }}
        >
          <Table
            sx={{
              [`& .${tableCellClasses.root}`]: {
                borderBottom: "none",
                fontWeight: "500",
                fontSize: "14px",
              },
            }}
          >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      padding: "20px",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {data.length ? (
              <TableBody>
                {data.map((row, i) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row?.attributes[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{
                              color:
                                column.label === "Event"
                                  ? "rgb(36, 209, 130)"
                                  : "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            {column.format && typeof value === "string"
                              ? column.format(value)
                              : column.label === "Event"
                              ? statusCustomValue(value)
                              : value}{" "}
                            {column.label === "Price" ? "ETH" : null}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            ) : (
              <caption
                style={{
                  textAlign: nftReducer.isMobileView ? "left" : "center",
                  // height: "138px",
                }}
              >
                No Trasaction history
              </caption>
            )}
          </Table>
        </TableContainer>
        {isMobile ? (
          <Pagination
            shape="rounded"
            color="primary"
            size="large"
            boundaryCount={2}
            page={currentPage}
            count={Math.ceil(totalCount / 10)}
            style={{
              padding: "5px 10px 5px 10px",
              display: " flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              background: "rgba(255, 255, 255, 0.09)",
            }}
            onChange={(event, newPage) => {
              setcurrentPage(newPage);
              dispatch(
                actions.nftActions.getTransactionHistoryByIDAction(
                  true,
                  id,
                  (newPage - 1) * 10,
                  10
                )
              );
            }}
          />
        ) : (
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </>

      {/* {!trasactionHistory?.data?.length === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "60px ,0",
          }}
        >
          <Typography style={{ padding: "60px ,0" }}>Not available</Typography>
        </div>
      )} */}
    </Paper>
  );
}
