import React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grow from '@mui/material/Grow';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SupervisorDropdown from './SupervisorDropdown';
import { AppContext } from './AppContext';

const API_URL =
  process?.env?.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function FollowSupervisorForm() {
  const [app, dispatch] = React.useContext(AppContext);
  const set = (key, value) =>
    dispatch({ type: 'set', component: 'FollowSupervisorForm', key, value });
  const {
    helperText,
    supervisor,
    email,
    firstName,
    lastName,
    phoneNumber,
    contactPref,
    isSubmitting,
    success,
  } = app.FollowSupervisorForm;

  async function submitForm(event) {
    event.preventDefault();
    try {
      set('helperText', {});
      set('isSubmitting', true);

      const reqBody = {
        supervisor,
        firstName,
        lastName,
      };
      if (contactPref === 'email') reqBody.email = email;
      if (contactPref === 'text') reqBody.phoneNumber = phoneNumber;

      const response = await fetch(`${API_URL}/submit`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      });
      if (response.status === 200) {
        dispatch({ type: 'reset', component: 'FollowSupervisorForm' });
        set('success', true);
        setTimeout(() => set('success', false), 5000);
      } else {
        const data = await response.json();
        set('helperText', data.helperText);
      }
    } catch (error) {
      set('helperText', {
        genericError:
          'There was a problem handling the request.  Please try again later.',
      });
      console.error(error);
    } finally {
      set('isSubmitting', false);
    }
  }

  return (
    <form method="POST" onSubmit={submitForm}>
      <Stack spacing={2} p={2} m="auto" maxWidth={300} minWidth={300}>
        <Typography variant="h6" color="textSecondary" align="center">
          Subscribe to notifications from your supervisor:
        </Typography>
        <SupervisorDropdown />
        {success && !supervisor && (
          <Grow in={success && !supervisor} timeout={500}>
            <Typography
              style={{ color: 'green' }}
              variant="subtitle1"
              align="center"
            >
              &#10003;&nbsp; You are now subscribed!
            </Typography>
          </Grow>
        )}
        {!!supervisor && (
          <>
            <Grow
              in={!!supervisor}
              style={{ transformOrigin: '0 0 0' }}
              timeout={750}
            >
              <Stack spacing={2}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  align="center"
                >
                  Select your contact preference:
                </Typography>
                <ToggleButtonGroup
                  fullWidth
                  color="primary"
                  value={contactPref}
                  exclusive
                  onChange={(_, newValue) => set('contactPref', newValue)}
                >
                  <ToggleButton value="email">Email</ToggleButton>
                  <ToggleButton value="text">Text</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Grow>
            {!!contactPref && (
              <Grow
                in={!!contactPref}
                style={{ transformOrigin: '0 0 0' }}
                timeout={750}
              >
                <Stack spacing={2}>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    align="center"
                  >
                    Enter your contact details:
                  </Typography>

                  {contactPref === 'email' && (
                    <TextField
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      label="Email Address"
                      value={email}
                      error={!!helperText?.email}
                      helperText={helperText?.email}
                      onChange={(e) => set('email', e.target.value)}
                      inputProps={{ minLength: 5, maxLength: 256 }}
                      required
                    />
                  )}
                  {contactPref === 'text' && (
                    <TextField
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="phone"
                      variant="outlined"
                      label="Phone Number"
                      value={phoneNumber}
                      error={!!helperText?.phoneNumber}
                      helperText={helperText?.phoneNumber}
                      onChange={(e) => set('phoneNumber', e.target.value)}
                      inputProps={{ minLength: 9, maxLength: 16 }}
                      required
                    />
                  )}
                  <TextField
                    id="firstName"
                    name="firstName"
                    autoComplete="firstName"
                    label="First Name"
                    value={firstName}
                    error={!!helperText?.firstName}
                    helperText={helperText?.firstName}
                    onChange={(e) => set('firstName', e.target.value)}
                    inputProps={{ minLength: 1, maxLength: 64 }}
                    required
                  />
                  <TextField
                    id="lastName"
                    name="lastName"
                    autoComplete="lastName"
                    label="Last Name"
                    value={lastName}
                    error={!!helperText?.lastName}
                    helperText={helperText?.lastName}
                    onChange={(e) => set('lastName', e.target.value)}
                    inputProps={{ minLength: 1, maxLength: 64 }}
                    required
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    Subscribe
                  </Button>
                  {isSubmitting && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <CircularProgress />
                    </Box>
                  )}
                  {!!helperText?.genericError && (
                    <Grow in={!!helperText?.genericError} timeout={500}>
                      <Typography
                        style={{ color: 'red' }}
                        variant="subtitle1"
                        align="center"
                      >
                        {helperText.genericError}
                      </Typography>
                    </Grow>
                  )}
                </Stack>
              </Grow>
            )}
          </>
        )}
      </Stack>
    </form>
  );
}
