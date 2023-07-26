import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { NoImageIcon } from "../../../BloIcons/index";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    textAlign: "left",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    textAlign: "left",
    wordBreak: "break-all",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const columns = [
  { id: "", label: "", maxWidth: 100, align: "left" },
  { id: "Title", label: "Title", maxWidth: 150, align: "left" },
  {
    id: "BLOCommerce Wallet Available Editions",
    label: "BLOCommerce Wallet Available Editions",
    maxWidth: 300,
    align: "left",
  },
  {
    id: "External Wallets Available Editions",
    label: "External Wallets Available Editions",
    maxWidth: 300,
    align: "left",
  },
  {
    id: " Total Editions",
    label: " Total Editions",
    maxWidth: 100,
    align: "left",
  },
];

export default function CustomizedTables({
  title,
  totalEditions,
  thumbnaliPath,
  editions,
  availableEdition,
}) {
  return (
    <TableContainer style={{ overflow: "hidden" }}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{
                  maxWidth: column.maxWidth,
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">
              {!thumbnaliPath ? (
                <NoImageIcon style={{ width: "50px", height: "50px" }} />
              ) : (
                <img
                  src={thumbnaliPath}
                  style={{ width: "50px", height: "50px", marginRight: "10px" }}
                />
              )}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row">
              {title}
            </StyledTableCell>
            <StyledTableCell align="right">
              {editions.blocommerce}
            </StyledTableCell>
            <StyledTableCell align="right">{editions.external}</StyledTableCell>
            <StyledTableCell align="right">{totalEditions}</StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
