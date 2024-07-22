import './table.css';
import StatusChart from '../components/statusChart.js';
//import DeleteMenu from '../components/deleteMenu.js';
import logo from './logo.jpg'; 
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, DialogContent, DialogActions, Button, TextField, DialogTitle, DialogContentText, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const Table = () => {
  const[openAdd, setOpenAdd] = useState(false);
  const[openDelete, setOpenDelete] = useState(false);
  const[selectedIncident, setSelectedIncident] = useState(null);
  const[openEdit, setOpenEdit] = useState(false);
  const[editData, setEditData] = useState({
    ID: '',
    Incident: '',
    StartDate: '',
    Priority: '',
    Status: '',
    LastModifiedDate: '',
    AssignedDate: '',
    AssignedPerson: '',
  });
  const[data, setData] = useState([]);
  const[formData, setFormData] = useState({
    Incident: '',
    StartDate: '',
    Priority: '',
    Status: '',
    LastModifiedDate: '',
    AssignedDate: '',
    AssignedPerson: '',
  });
  const columnsTicket = [
    { field: 'ID', headerName: 'ID', width: 20, headerAlign: 'center', headerClassName: 'TableHeader' },
    { field: 'Incident', headerName: 'Incident', width: 80, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'StartDate', headerName: 'Start Date', width: 100, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'Priority', headerName: 'Priority', width: 80, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'SLA', headerName: 'SLA', width: 30, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'Status', headerName: 'Status', width: 100, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'LastModifiedDate', headerName: 'Last Modified Date', width: 140, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'AssignedDate', headerName: 'Assigned Date', width: 110, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'AssignedPerson', headerName: 'Assigned Person', width: 130, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'Functions', headerName: 'Functions', width: 160, headerAlign: 'center', headerClassName: 'TableHeader',
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleEditClick(params.row)}
            sx={{ marginRight: 1, backgroundColor: '#006A4E', color: 'white', '&:hover': { backgroundColor: '#1B4D3E' } }}
          >Edit</Button>
          <Button onClick={() => handleDeleteClick(params.row.Incident)}
            sx={{ backgroundColor: '#CF352E', color: 'white', '&:hover': { backgroundColor: 'darkred' } }}
          >Delete</Button>
        </div>
      ),
    },
  ]

//-----------Fetch Data
  const fetchTickets = async ()=> {
    await axios.get("http://localhost/Tickets2/tickets/src/backend/getTickets.php").then(
      (response) => {
        console.log(response);
        if(Array.isArray(response.data)){
          if(response.data.length>0 && typeof response.data[0] === 'object'){
            setData(response.data);
          } else {
            console.error('Ticket List: Received data is not an array of objects:', response.data);
          }
        }
        else
        {
          console.error('Ticket List: expected array but received: ', response.data);
        }
      }
    ).catch(error => {
      console.error('Error fetching Ticket data:', error);
    });
  }
  
  useEffect(() => {
    fetchTickets();
  }, []);
  
//-----------Add Entry
  const handleAddEntry = (event) => {
    event.preventDefault();
    axios.post('http://localhost/Tickets2/tickets/src/backend/addTicket.php', formData)
      .then(response => {
        console.log(response.data);
        handleClose();
        fetchTickets();
      })
      .catch(error => {
        console.error('There was an error adding the ticket!', error);
      });
  };

  const handleClickOpen = () => {
    setOpenAdd(true);
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleClose = () => {
    setOpenAdd(false);
    setOpenDelete(false);
    setOpenEdit(false);
  };
  
//-----------Delete Entry             ~nush dc da refresh la toata pagina
  const handleDeleteEntry = () => {
    axios.delete(`http://localhost/Tickets2/tickets/src/backend/deleteTicket.php?incident=${selectedIncident}`)
    .then(response => {
      console.log(response.data);
      handleClose();
      fetchTickets();
    })
    .catch(error => {
      console.error('There was an error deleting the ticket!', error);
    });
  }

  const handleDeleteClick = (incident) => {
    setSelectedIncident(incident);
    setOpenDelete(true);
  };

//-----------Edit Entry
  const handleEditEntry = (event) => {
    event.preventDefault();
    axios.put(`http://localhost/Tickets2/tickets/src/backend/editTicket.php`, editData)
    .then(response => {
        console.log(response.data);
        handleClose();
        fetchTickets();
    })
    .catch(error => {
      console.error('There was an error editing the ticket!', error);
    });
  }

  const handleEditClick = (row) => {
    setEditData(row);
    setOpenEdit(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  return (
    <div className='Body'>
      <div className='Header'>
        <img src={logo} alt="Nokia"/>
        <p>Ticket Dashboard</p>
        <button className='AddButton' onClick={handleClickOpen}>Add Ticket</button>
      </div>

      <div className="TableTickets">
        <p className='TableTitle'> Tickets List </p>
          <div style={{ height: 370 }}>
            <DataGrid
              rows={data}
              columns={columnsTicket}
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

      <StatusChart/>

      <Dialog open={openAdd} onClose={handleClose} >
        <form>
          <DialogTitle> Add ticket </DialogTitle>
          <DialogContent>
            <TextField label="Incident" name="Incident" fullWidth margin="normal" required onChange={handleChange}/>
            <TextField label="Start Date" name="StartDate" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required onChange={handleChange}/>
            <FormControl fullWidth required sx={{marginTop: '15px', marginBottom: '10px'}}>
              <InputLabel id="priorityLabel">Priority</InputLabel>
              <Select labelId="priorityLabel" id="priority" value={formData.Priority} label="Priority" name="Priority" onChange={handleChange}>
                <MenuItem value={1}>Critical</MenuItem>
                <MenuItem value={2}>High</MenuItem>
                <MenuItem value={3}>Medium</MenuItem>
                <MenuItem value={4}>Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required sx={{marginTop: '15px', marginBottom: '10px'}}>
              <InputLabel id="statusLabel">Status</InputLabel>
              <Select labelId="statusLabel" id="status" value={formData.Status} label="Status" name="Status" onChange={handleChange}>
                <MenuItem value={"Open"}>Open</MenuItem>
                <MenuItem value={"In Progress"}>In Progress</MenuItem>
                <MenuItem value={"Closed"}>Closed</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Last Modified Date" name="LastModifiedDate" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required onChange={handleChange}/>
            <TextField label="Assigned Date" name="AssignedDate" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required onChange={handleChange}/>
            <TextField label="Assigned Person" name="AssignedPerson" fullWidth margin="normal" required onChange={handleChange}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{backgroundColor: 'red', color: 'white', '&:hover': {backgroundColor: 'darkred'}}}>Close</Button>
            <Button onClick={handleAddEntry} type="submit" sx={{ backgroundColor: 'green', color: "white", '&:hover': {backgroundColor: 'darkgreen'}}}>Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
      
      <Dialog open={openDelete} onClose={handleClose} >
        <form>
          <DialogTitle> Delete ticket </DialogTitle>
          <DialogContent>
           <DialogContentText sx={{color:'black'}}> Are you sure you want to delete this entry? </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{backgroundColor: 'red', color: 'white', '&:hover': {backgroundColor: 'darkred'}}}>No</Button>
            <Button onClick={handleDeleteEntry} type="submit" sx={{ backgroundColor: 'green', color: "white", '&:hover': {backgroundColor: 'darkgreen'}}}>Yes</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openEdit} onClose={handleClose} >
        <form>
          <DialogTitle> Edit ticket </DialogTitle>
          <DialogContent>
            <TextField label="Incident" name="Incident" fullWidth margin="normal" value={editData.Incident} disabled/>
            <TextField label="Start Date" name="StartDate" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required value={editData.StartDate} onChange={handleEditChange}/>
            <TextField label="Priority" name="Priority" fullWidth margin="normal" required value={editData.Priority} onChange={handleEditChange}/>
            <DialogContentText sx={{fontSize: 12}}>1-critical, 2-high, 3-medium, 4-low</DialogContentText>
            <FormControl fullWidth required sx={{marginTop: '15px', marginBottom: '10px'}}>
              <InputLabel id="statusLabel">Status</InputLabel>
              <Select labelId="statusLabel" id="status" value={editData.Status} label="Status" name="Status" onChange={handleEditChange}>
                <MenuItem value={"Open"}>Open</MenuItem>
                <MenuItem value={"In Progress"}>In Progress</MenuItem>
                <MenuItem value={"Closed"}>Closed</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Last Modified Date" name="LastModifiedDate" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required value={editData.LastModifiedDate} onChange={handleEditChange}/>
            <TextField label="Assigned Date" name="AssignedDate" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required value={editData.AssignedDate} onChange={handleEditChange}/>
            <TextField label="Assigned Person" name="AssignedPerson" fullWidth margin="normal" required value={editData.AssignedPerson} onChange={handleEditChange}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{backgroundColor: 'red', color: 'white', '&:hover': {backgroundColor: 'darkred'}}}>Close</Button>
            <Button onClick={handleEditEntry} type="submit" sx={{ backgroundColor: 'green', color: "white", '&:hover': {backgroundColor: 'darkgreen'}}}>Edit</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}


export default Table;

/*
<FormControl fullWidth required sx={{marginTop: '15px', marginBottom: '10px'}}>
              <InputLabel id="priorityLabel">Priority</InputLabel>
              <Select labelId="priorityLabel" id="priority" value={editData.Priority} label="Priority" name="Priority" onChange={handleChange}>
                <MenuItem value={1}>Critical</MenuItem>
                <MenuItem value={2}>High</MenuItem>
                <MenuItem value={3}>Medium</MenuItem>
                <MenuItem value={4}>Low</MenuItem>
              </Select>
            </FormControl>
*/