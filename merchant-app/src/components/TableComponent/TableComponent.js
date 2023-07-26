import React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Settings, Description} from "@mui/icons-material";
import {Avatar} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: "24px",
        letterSpacing: "0.17px",
        color: "#FFFFFF",
        background: "rgba(0, 0, 0, 0.002)",
        border:0,
        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.12)",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: "24px",
        letterSpacing: "0.17px",
        color: "#FFFFFF",
        background: "rgba(0, 0, 0, 0.002)",
        border:0,
        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.12)",
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        border:0
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    background: "#383F4E",
    boxShadow: "0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px rgba(0, 0, 0, 0.14), 0px 1px 14px rgba(0, 0, 0, 0.12)",
    borderRadius: "50px",
    height:"35px",
    width:"35px",
    color: "#FFFFFF"

}))
function createData(handleMenuClick,name, protocol, address, network, isCustom) {
    const icon  = isCustom? <StyledAvatar><Description color="active"/></StyledAvatar>:
        name==="Blocommerce" ? <StyledAvatar color="active" alt={name} src="/images/blocommerce.png"/>:
            name==="Opensea" ? <StyledAvatar color="active" alt={name} src="/images/opensea.png" />:
                name==="Rarible" ? <StyledAvatar color="active" alt={name} src="/images/Rarible.png"/>:
                    name==="CryptoPunks" ? <StyledAvatar color="active" alt={name} src="/images/crypto-punk.png"/>:
                        <StyledAvatar>{name[0]}</StyledAvatar>
    const settings = isCustom?
        <Settings
            color="active"
            sx={{ cursor: "pointer" }}
            onClick={(e) => handleMenuClick(e, name)}
        />
        : "";

    return { icon, name, protocol, address, network, settings};
}

const customizedData = (handleMenuClick, rows) =>{
    var temp = []
    rows.forEach((row)=>{
        temp.push(createData(handleMenuClick, row.name, row.protocol, row.address, row.network, row.isCustom))
    })
    return temp
}

const rows = [
    {name:'Custom Smart Contract 2', protocol:"ERC-721", address:"0x123412512451245134123", network:"Ethereum", isCustom:true},
    {name:'Custom Smart Contract 1', protocol:"ERC-721", address:"0x123412512451245134123", network:"Ethereum", isCustom:true},
    {name:'Blocommerce', protocol:"ERC-721", address:"0x123412512451245134123", network:"Ethereum", isCustom:false},
    {name:'Blocommerce', protocol:"ERC-1155", address:"0x123412512451245134123", network:"Ethereum", isCustom:false},
    {name:'Opensea', protocol:"ERC-721", address:"0x123412512451245134123", network:"Ethereum", isCustom:false},
    {name:'Opensea', protocol:"ERC-1155", address:"0x123412512451245134123", network:"Ethereum", isCustom:false},
    {name:'Rarible', protocol:"ERC-721", address:"0x123412512451245134123", network:"Ethereum", isCustom:false},
    {name:'Rarible', protocol:"ERC-1155", address:"0x123412512451245134123", network:"Ethereum", isCustom:false},
    {name:'CryptoPunks', protocol:"ERC-721", address:"0x123412512451245134123", network:"Ethereum", isCustom:false},
    {name:'CryptoPunks', protocol:"ERC-1155", address:"0x123412512451245134123", network:"Ethereum", isCustom:false},


];

const columns = [
    { id: 'icon', label: '', width: 50 },
    { id: 'name', label: 'Name', minWidth: 100, },
    { id: 'protocol', label: 'Protocol', minWidth: 100, },
    { id: 'address', label: 'Smart Contract Address', minWidth: 170, },
    { id: 'network', label: 'Network', minWidth: 100,},
    {
        id: 'settings',
        label: '',
        minWidth: 100,
        align: 'center',
    },
];


export default function CustomizedTables({handleMenuClick}) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <TableContainer component={Paper}>
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
                    {customizedData(handleMenuClick,rows)
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                            return (
                                <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <StyledTableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number'
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
    );
}
