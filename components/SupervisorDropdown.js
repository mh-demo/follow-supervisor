import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const API_URL =
  process?.env?.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function fetchSupervisorList(setSupervisorList) {
  try {
    const response = await fetch(`${API_URL}/supervisors`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status !== 200) {
      throw new Error(
        `There was a problem retrieving the supervisor list (http: ${response.status})`
      );
    }
    const data = await response.json();
    setSupervisorList(data);
  } catch (error) {
    console.error(error);
  }
}

export default function SupervisorDropdown({ value = '', setter }) {
  const [supervisorList, setSupervisorList] = useState([]);
  const supervisorListIsLoaded = supervisorList.length > 0;

  useEffect(() => {
    fetchSupervisorList(setSupervisorList);
  }, []);

  return (
    <FormControl sx={{ m: 1, minWidth: 240 }}>
      <InputLabel id="supervisor-label">Supervisor</InputLabel>
      <Select
        labelId="supervisor-label"
        value={value}
        label="Supervisor"
        onChange={(e) => setter(e.target.value)}
      >
        <MenuItem value="">
          <em>{supervisorListIsLoaded ? '(None)' : '(Loading...)'}</em>
        </MenuItem>
        {supervisorListIsLoaded &&
          supervisorList.map((sup) => (
            <MenuItem
              key={sup.identificationNumber}
              value={sup.identificationNumber}
            >
              {`${sup.jurisdiction} - ${sup.lastName}, ${sup.firstName}`}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
SupervisorDropdown.propTypes = {
  value: PropTypes.string,
  setter: PropTypes.func.isRequired,
};
SupervisorDropdown.defaultProps = {
  value: '',
};
