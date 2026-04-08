import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";

const BasicSelect = ({ state, setState, list }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "inline-block",
        border: "1px solid",
        borderColor: open ? "var(--primary)" : "var(--primary)",
        borderRadius: 1,
      }}
    >
      <FormControl size="small">
        <Select
          value={state}
          onChange={(e) => setState(e.target.value)}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          sx={{
            fontSize: "0.8rem",
            fontFamily: "tr_r",
            color: "var(--primary)",
            height: 40,
            minWidth: 100,
            "& .MuiSelect-select": {
              padding: "4px 10px",
            },
            // 기본 테두리 제거 (중요)
            "& fieldset": {
              border: "none",
            },
          }}
          MenuProps={{
            disableScrollLock: true,
          }}
        >
          {list.map((item) => (
            <MenuItem
              key={item[0]}
              value={item[0]}
              sx={{
                fontFamily: "궁서체",
                color: "var(--primary)",
                fontSize: "0.8rem",
              }}
            >
              {item[1]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default BasicSelect;
