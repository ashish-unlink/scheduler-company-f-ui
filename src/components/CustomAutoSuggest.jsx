import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import { users } from "./Users";
import { FormControl, InputAdornment, TextField } from "@mui/material";
import ContactCard from "./contact-card/ContactCard";
import { EmailOutlined, Person2Outlined, Phone } from "@mui/icons-material";
import { useAppSelector } from "../redux";
import { selectCustomerData } from "../redux/auth/selector";
import { userName } from "../utils/general";

const CustomAutoSuggest = ({
  placeholder,
  label,
  startAdornment,
  selected,
  setSelected,
  handleCustomer,
}) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const customerUserData = useAppSelector(selectCustomerData);

  const getSuggestions = (inputValue) =>
    customerUserData.filter((user) => {
      const searchLower = inputValue.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phoneNumber.includes(inputValue)
      );
    });

  const renderSuggestion = (suggestion) => (
    <ContactCard
      name={userName(suggestion?.firstName, suggestion?.lastName)}
      email={suggestion.email}
      phoneNumber={suggestion.phoneNumber}
    />
  );

  const getSuggestionValue = (suggestion) => {
    setSelected({
      name: userName(suggestion?.firstName, suggestion?.lastName),
      email: suggestion.email,
      selected: true,
      ...suggestion,
    });
    handleCustomer("customerInfo", suggestion);
    return suggestion.firstName;
  };
  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder,
    value,
    onChange,
  };
  const renderInputComponent = (inputProps) => (
    <div>
      {selected.selected ? (
        <div className="">
          <button
            onClick={() => {
              setSelected({
                name: "",
                email: "",
                phoneNumber: "",
                selected: false,
              });
              setValue("");
            }}
          >
            x
          </button>
          <div>
            <Person2Outlined /> {selected.name}
            <br />
            <EmailOutlined />
            {selected.email}
            <br />
            <Phone />
            {selected.phoneNumber}
          </div>
        </div>
      ) : (
        <div className="appointment-text-field">
          <FormControl fullWidth size="small">
            <label className="input-label">{label}</label>
            <TextField
              {...inputProps}
              id="outlined-start-adornment"
              // name={name}
              size="small"
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gray",
                  },
                  "&:hover fieldset": {
                    borderColor: "#7469B6",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#7469B6",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {startAdornment && (
                      <img
                        className="appointment-text-field-start-adornment"
                        src={startAdornment}
                        alt="start-icon"
                      />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </div>
      )}
    </div>
  );

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      renderInputComponent={renderInputComponent}
    />
  );
};

export default CustomAutoSuggest;
