import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import { Checkbox, Button, Box } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function InputMultiSelect({
  labelId,
  id,
  value = [],
  onChange,
  label,
  selectedInput,
  fullWidth = true,
  handleClear,
  handleApplyFilter,
}) {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    handleApplyFilter();
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <div>
      <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
      <Select
        labelId={labelId}
        id={id}
        multiple
        value={selectedInput}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) =>
          value
            .filter((name) => selected.includes(name.id))
            .map((record) => record.name)
            .join(", ")
        }
        MenuProps={MenuProps}
        fullWidth={fullWidth}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
      >
        {value?.map((name) => (
          <MenuItem key={name.id} value={name.id}>
            <Checkbox
              checked={selectedInput && selectedInput.indexOf(name.id) > -1}
            />
            <ListItemText primary={name.name} />
          </MenuItem>
        ))}

        <Box
          sx={{
            textAlign: "end",
            position: "sticky",
            width: "100%",
            bottom: "-1px",
            marginTop: "10px",
            backdropFilter: "blur(100px)",
            WebkitBackdropFilter: "blur(100px)",

            background: "#383f4e",
          }}
        >
          <Button
            variant="text"
            onClick={handleClear}
            sx={{ m: 0, color: "#B6AEF6", fontSize: "13px" }}
          >
            Clear
          </Button>
          <Button
            variant="text"
            onClick={handleClose}
            sx={{ m: 0, fontSize: "13px" }}
          >
            Apply
          </Button>
        </Box>
      </Select>
    </div>
  );
}
