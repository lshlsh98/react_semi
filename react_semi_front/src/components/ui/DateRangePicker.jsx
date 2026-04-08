import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DateRangePicker = ({ startDate, setStartDate, endDate, setEndDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="시작일"
        value={startDate}
        onChange={(newValue) => setStartDate(newValue)}
      />
      <span> </span>
      <DatePicker
        label="종료일"
        value={endDate}
        onChange={(newValue) => setEndDate(newValue)}
      />
    </LocalizationProvider>
  );
};

export default DateRangePicker;
