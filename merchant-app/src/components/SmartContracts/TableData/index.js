import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Settings, Description } from "@mui/icons-material";
import { Avatar, TablePagination, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import Image from "next/image";
import { actions } from "../../../actions";
import { useDispatch, useSelector } from "react-redux";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "24px",
    letterSpacing: "0.17px",
    color: "#FFFFFF",
    background: "rgba(0, 0, 0, 0.002)",
    border: 0,
    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.12)",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontWeight: 390,
    lineHeight: "24px",
    letterSpacing: "0.17px",
    color: "#FFFFFF",
    background: "rgba(0, 0, 0, 0.002)",
    border: 0,
    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.12)",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    border: 0,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  background: "#383F4E",
  boxShadow:
    "0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px rgba(0, 0, 0, 0.14), 0px 1px 14px rgba(0, 0, 0, 0.12)",
  borderRadius: "50px",
  height: "35px",
  width: "35px",
  color: "#FFFFFF",
}));
function createData(
  handleMenuClick,
  id,
  name,
  tokenProtocol,
  address,
  network,
  isCustom
) {
  const icon = isCustom ? (
    <StyledAvatar>
      <Description color="active" />
    </StyledAvatar>
  ) : name == "Blocommerce" ? (
    <Image
      src="/images/blocommerce.png"
      alt={name}
      width="36px"
      height="36px"
    />
  ) : name == "OpenSea" ? (
    <Image src="/images/opensea.png" alt={name} width="36px" height="36px" />
  ) : name == "Superrare" ? (
    <Image src="/images/super-rare.png" alt={name} width="36px" height="36px" />
  ) : name == "Bored Ape Yacht" ? (
    <Image
      src="/images/bored-ape-yacht.png"
      alt={name}
      width="36px"
      height="36px"
    />
  ) : name == "Rarible" ? (
    <Image src="/images/Rarible.png" alt={name} width="36px" height="36px" />
  ) : name == "Mintable" ? (
    <Image src="/images/mintable.png" alt={name} width="36px" height="36px" />
  ) : name == "CryptoPunks" ? (
    <Image
      src="/images/crypto-punk.png"
      alt={name}
      width="36px"
      height="36px"
    />
  ) : (
    <StyledAvatar>{name[0]}</StyledAvatar>
  );
  const settings = isCustom ? (
    <Settings
      color="active"
      sx={{ cursor: "pointer" }}
      onClick={(e) => handleMenuClick(e, id)}
    />
  ) : (
    ""
  );

  return {
    icon,
    name,
    tokenProtocol: tokenProtocol.toUpperCase(),
    address,
    network,
    settings,
  };
}

const customizedData = (handleMenuClick, rows) => {
  var temp = [];
  rows?.forEach((row) => {
    temp.push(
      createData(
        handleMenuClick,
        row.id,
        row.attributes.name || row.attributes.platformName,
        row.attributes.tokenProtocol,
        row.attributes.address,
        row.attributes.network || "Ethereum",
        row.attributes.type === "custom" ? true : false
      )
    );
  });
  return temp;
};

const columns = [
  { id: "icon", label: "", width: 50 },
  { id: "name", label: "Name", minWidth: 100 },
  { id: "tokenProtocol", label: "Protocol", minWidth: 100 },
  { id: "address", label: "Smart Contract Address", minWidth: 170 },
  { id: "network", label: "Network", minWidth: 100 },
  {
    id: "settings",
    label: "",
    minWidth: 100,
    align: "right",
  },
];

export default function TableData({ data, handleMenuClick }) {
  const { smartContractReducer } = useSelector((state) => state);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // const [currentPage, setcurrentPage] = React.useState(1);
  // const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    dispatch(
      actions.smartContractActions.getSmartContractsList(true, {
        offset: +newPage * rowsPerPage,
        limit: rowsPerPage,
      })
    );
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      actions.smartContractActions.getSmartContractsList(true, {
        offset: 0,
        limit: +event.target.value,
      })
    );
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <>
      <TableContainer
        sx={{
          backgroundColor: "#383F4E",
          "&::-webkit-scrollbar": {
            width: "5px",
            height: "8px",
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
        }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <StyledTableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {customizedData(handleMenuClick, data).map((row) => {
              return (
                <StyledTableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.id}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <StyledTableCell key={column.id} align={column.align}>
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        data-testid="Rows per page"
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={smartContractReducer?.smartContractTotalRecords || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        style={{
          color: "#fff",
        }}
        sx={{
          "& .MuiInputBase-root-MuiTablePagination-select": {
            marginRight: "5px",
          },
        }}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
