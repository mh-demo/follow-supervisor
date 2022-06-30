import React, { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { AppContext } from './AppContext';

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

export default function SupervisorDropdown() {
  const [app, dispatch] = React.useContext(AppContext);
  const set = (key, value) =>
    dispatch({ type: 'set', component: 'FollowSupervisorForm', key, value });
  const { supervisor } = app.FollowSupervisorForm;
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
        value={supervisor}
        label="Supervisor"
        onChange={(e) => set('supervisor', e.target.value)}
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
