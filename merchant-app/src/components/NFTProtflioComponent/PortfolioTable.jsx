import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Avatar, Grid, Button } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import DownloadIcon from "@mui/icons-material/Download";
import { ExportToCsv } from "export-to-csv";
import { getTempCredentialsForAsset } from "../../services/assetsService";
import { downloadS3SignedURLThumbnail } from "../../utils/s3Upload";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "../../actions";
import { DatetoHumanReadableUTC, statusCustomValue } from "../../utils/helper";
import CircularProgress from "@mui/material/CircularProgress";

export default function CustomizedTables({
  nftTrasaction,
  value,
  walletUids,
  smartContractUids,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [progress, setProgress] = React.useState(0);
  const [tempCred, setTempCredentials] = useState({});
  const [tempData, setTempData] = useState([]);

  const dispatch = useDispatch();
  const { nftTransactionLoading } = useSelector(
    (state) => (state && state.nftPortfolioAnalysisReducer) || {}
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    const params = {
      startDate: moment(value[0]).toISOString(),
      endDate: moment(value[1]).toISOString(),
      walletUids: walletUids,
      smartContractUids: smartContractUids,
      limit: rowsPerPage,
      offset: newPage * rowsPerPage,
    };
    dispatch(actions.nftPortfolioAnalysisActions.getNFTTrasaction(params));
  };
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
    name,
    edition,
    contract,
    eventtypes,
    from,
    to,
    bucketName,
    thumbnailPath,
    tempCred,
    id,
    price,
    eventTime,
    etherscanLink,
    eventName
  ) {
    let icon = (
      <img
        color="active"
        alt="thumbnail"
        src={
          thumbnailPath?.includes("ipfs:/")
            ? thumbnailPath?.replace("ipfs:/", "https://ipfs.io/ipfs")
            : downloadS3SignedURLThumbnail(tempCred, thumbnailPath, bucketName)
        }
        style={{ width: "35px", height: "35px", borderRadius: "5px" }}
      />
    );
    let eventtype = etherscanLink ? (
      <a
        href={etherscanLink}
        target="_blank"
        rel="noreferrer"
        style={{
          color: "#24D182",
          fontSize: "14px",
          cursor: "pointer",
          // textDecoration: "none",
        }}
      >
        {statusCustomValue(eventtypes)}
      </a>
    ) : (
      statusCustomValue(eventtypes)
    );

    let dateandTime = DatetoHumanReadableUTC(eventTime);
    price = price + " ETH";
    return {
      icon,
      name,
      edition,
      contract,
      eventtype,
      from,
      to,
      id,
      price,
      dateandTime,
      etherscanLink,
    };
  }

  const columns = [
    { id: "icon", label: "", width: 50 },
    {
      id: "name",
      label: "Name",
      minWidth: 200,
      style: { color: "#FFFFFF", fontSize: "14px" },
    },
    {
      id: "edition",
      label: "# of editions",
      minWidth: 120,
      style: { color: "#FFFFFF", fontSize: "14px" },
    },
    {
      id: "contract",
      label: "Smart Contract Platform",
      minWidth: 200,
      style: { color: "#FFFFFF", fontSize: "14px" },
    },
    {
      id: "eventtype",
      label: "Event type",
      minWidth: 170,
      style: { color: "#ffffff", fontSize: "14px", cursor: "pointer" },
    },
    {
      id: "from",
      label: "From",
      minWidth: 150,
      style: { color: " rgba(255, 255, 255, 0.5)", fontSize: "14px" },
    },
    {
      id: "to",
      label: "To",
      minWidth: 150,
      style: { color: " rgba(255, 255, 255, 0.5)", fontSize: "14px" },
    },
    {
      id: "price",
      label: "Price",
      minWidth: 100,
      style: { color: "#ffffff", fontSize: "14px" },
    },
    {
      id: "dateandTime",
      label: "Date/Time",
      minWidth: 200,
      style: { color: "#ffffff", fontSize: "14px" },
    },
    // {
    //   id: "etherscanLink",
    //   label: "Etherscan",
    //   minWidth: 200,
    //   style: { color: "#ffffff", fontSize: "14px" },
    // },
  ];
  var temp = [];
  const customizedData = (rows, tempCred) => {
    rows.forEach((row) => {
      let res = createData(
        row.attributes.name || row.attributes.nftTitle,
        row.attributes.editions,
        row.attributes.platformName,
        row.attributes.eventName,
        row.attributes.fromAddress,
        row.attributes.toAddress,
        row.attributes.bucketName,
        row.attributes.thumbnailPath,
        tempCred,
        row.attributes.id,
        row.attributes.price,
        row.attributes.eventTime,
        row.attributes.etherscanLink,
        row.attributes.eventName
      );
      temp.push(res);
    });
    return temp;
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    const params = {
      startDate: moment(value[0]).toISOString(),
      endDate: moment(value[1]).toISOString(),
      walletUids: walletUids,
      smartContractUids: smartContractUids,
      limit: +event.target.value,
      offset: 0,
    };
    setPage(0);
    dispatch(actions.nftPortfolioAnalysisActions.getNFTTrasaction(params));
  };
  const options = {
    fieldSeparator: ",",
    filename: "blocommerce",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    showTitle: true,
    title: "NFT Portfolio Analysis",
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
  };

  const csvExporter = new ExportToCsv(options);
  useEffect(() => {
    getTempCredentialsForAsset().then((res) => {
      setTempCredentials(res);
    });
  }, []);
  const exportCSV = () => {
    csvExporter.generateCsv(temp);
    setProgress((oldProgress) => {
      if (oldProgress === 100) {
        return 0;
      }
    }, 100);
  };
  useEffect(() => {
    setTempData(customizedData(nftTrasaction?.data, tempCred));
  }, [nftTrasaction]);
  return (
    <>
      <TableContainer
        // component={Paper}
        sx={{
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
          minHeight: "150px",
        }}
        style={{ scrollbarWidth: "thin" }}
      >
        <Table
          style={{ background: "rgb(56, 63, 78)" }}
          sx={{ minWidth: 700 }}
          aria-label="customized table"
        >
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
          {nftTransactionLoading ? (
            <caption
              style={{
                textAlign: "center",
                height: "138px",
              }}
            >
              {" "}
              <CircularProgress
                color="inherit"
                style={{
                  width: " 20px",
                  marginTop: "5px",
                  height: " 20px",
                  color: " rgba(255, 255, 255, 0.56)",
                }}
              />{" "}
            </caption>
          ) : nftTrasaction?.data?.length ? (
            <TableBody>
              {tempData
                ?.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
                .map((row) => {
                  return (
                    <StyledTableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <StyledTableCell
                            key={column.id}
                            align={column.align}
                            style={column.style}
                          >
                            {value ? value : value === 0 ? 0 : "-"}
                          </StyledTableCell>
                        );
                      })}
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          ) : (
            <caption
              style={{
                textAlign: "center",
                height: "138px",
              }}
            >
              No Trasaction history
            </caption>
          )}
        </Table>
      </TableContainer>

      <Grid container style={{ background: "rgb(56, 63, 78)" }}>
        <Grid item md={4} sm={3} xs={12}>
          <Button
            // variant="outlined"
            color="primary"
            onClick={exportCSV}
            style={{ float: "left" }}
            startIcon={<DownloadIcon />}
          >
            Download
          </Button>
        </Grid>
        <Grid item md={8} sm={9} xs={12}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={nftTrasaction?.totalCount || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </>
  );
}
