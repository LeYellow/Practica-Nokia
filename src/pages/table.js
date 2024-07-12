import './table.css';
import deleteTicket from './deleteTicket.js';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const Table = () => {
  const[open, setOpen] = useState(false);
  const[data, setData] = useState([]);
  const [formData, setFormData] = useState({
    Incident: '',
    StartDate: '',
    Priority: '',
    Status: '',
    LastModifiedDate: '',
    AssignedDate: '',
    AssignedPerson: '',
  });
  const columns = [
    { field: 'ID', headerName: 'ID', width: 20, headerAlign: 'center', headerClassName: 'TableHeader' },
    { field: 'Incident', headerName: 'Incident', width: 80, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'Priority', headerName: 'Priority', width: 80, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'SLA', headerName: 'SLA', width: 30, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'Status', headerName: 'Status', width: 100, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'LastModifiedDate', headerName: 'Last Modified Date', width: 140, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'AssignedDate', headerName: 'Assigned Date', width: 110, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'AssignedPerson', headerName: 'Assigned Person', width: 130, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'Functions', headerName: 'Functions', width: 160, headerAlign: 'center', headerClassName: 'TableHeader',
      renderCell: (params) => (
        <div>
          <Button 
            //onClick={() => handleEdit(params.row)}
            sx={{ marginRight: 1, backgroundColor: '#006A4E', color: 'white', '&:hover': { backgroundColor: '#1B4D3E' } }}
          >Edit</Button>
          <Button onClick={() => deleteTicket(params.row.Incident, fetch_data)}
            sx={{ backgroundColor: '#CF352E', color: 'white', '&:hover': { backgroundColor: 'darkred' } }}
          >Delete</Button>
        </div>
      ),
    },
  ]

  const fetch_data =()=> {
    axios.get("http://localhost/Tickets2/tickets/src/backend/connection.php").then(
      (response) => {
        console.log(response);
        if(Array.isArray(response.data)){
          if(response.data.length>0 && typeof response.data[0] === 'object'){
            setData(response.data);
          } else {
            console.error('Received data is not an array of objects:', response.data);
          }
        }
        else
        {
          console.error('expected array but received: ', response.data);
        }
      }
    ).catch(error => {
      console.error('err fetching data:', error);
    });
  }
  
  useEffect(() => {
    fetch_data();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost/Tickets2/tickets/src/backend/connection.php', formData)
      .then(response => {
        console.log(response.data);
        handleClose();
        fetch_data();
      })
      .catch(error => {
        console.error('There was an error adding the ticket!', error);
      });
  };

  return (
    <div className='Body'>
      <div className="Table">
        <p className='Title'> Tickets List </p>
          <div style={{ height: 370 }}>
            <DataGrid
              rows={data}
              columns={columns}
              getRowId={(row) => row.ID}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              sx={{
                '& .MuiDataGrid-cell': {
                borderRight: '1px solid black',
                borderLeft: '1px solid black',
                },
                border: 0,
              }}
            />
          </div>
      </div>

      <button className='AddButton' onClick={handleClickOpen}>Add Entry</button>
      <Dialog open={open} onClose={handleClose} >
        <form>
          <DialogContent>
            <TextField label="Incident" name="Incident" fullWidth margin="normal" required onChange={handleChange}/>
            <TextField label="Start Date" name="StartDate" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required onChange={handleChange}/>
            <TextField label="Priority" name="Priority" fullWidth margin="normal" required onChange={handleChange}/>
            <TextField label="Status" name="Status" fullWidth margin="normal" required onChange={handleChange}/>
            <TextField label="Last Modified Date" name="LastModifiedDate" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required onChange={handleChange}/>
            <TextField label="Assigned Date" name="AssignedDate" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required onChange={handleChange}/>
            <TextField label="Assigned Person" name="AssignedPerson" fullWidth margin="normal" required onChange={handleChange}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{backgroundColor: 'red', color: 'white', '&:hover': {backgroundColor: 'darkred'}}}>Close</Button>
            <Button onClick={handleSubmit} type="submit" sx={{ backgroundColor: 'green', color: "white", '&:hover': {backgroundColor: 'darkgreen'}}}>Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}


export default Table;