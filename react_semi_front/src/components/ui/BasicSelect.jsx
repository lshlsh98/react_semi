import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const BasicSelect = ({ state, setState, list }) => {
  const handleChange = (event) => {
    setState(event.target.value);
  };

  return (
    <Box sx={{ width: 100, maxHeight: 60 }}>
      <FormControl fullWidth>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={state}
          onChange={handleChange}
          MenuProps={{
            disableScrollLock: true,
            PaperProps: {
              style: { maxHeight: 200 },
            },
          }}
          sx={{ fontSize: "0.85rem", padding: "0px" }}
        >
          {list.map((item) => (
            <MenuItem key={item[0]} value={item[0]}>
              {item[1]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default BasicSelect;
