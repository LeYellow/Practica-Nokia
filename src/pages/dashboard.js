import './dashboard.css';
import StatusChart from '../components/statusChart.js';
import PriorityChart from '../components/priorityChart.js';
import logo from './logo.jpg'; 
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, DialogContent, DialogActions, Button, TextField, DialogTitle, DialogContentText, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const Dashboard = () => {
  const[openMenu, setOpenMenu] = useState(false);
  const[openDelete, setOpenDelete] = useState(false);
  const[priorityMap, setPriorityMap] = useState({});
  const[selectedIncident, setSelectedIncident] = useState(null);
  const[isEditMode, setIsEditMode] = useState(false);
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
  const fetchTickets = async () => {
    try {
      const response = await axios.get("http://localhost/Tickets2/tickets/src/backend/getTickets.php")
      //console.log(response);    //debug
      if(Array.isArray(response.data)){
        if(response.data.length>0 && typeof response.data[0] === 'object'){
          setData(response.data);
        } else {
          console.error('Ticket List: Received data is not an array of objects:', response.data);
        }
      } else {
        console.error('Ticket List: expected array but received: ', response.data);
      }
    } catch (error) {
      console.error('Error fetching Ticket data:', error);
    }
  }
  
  const mapPriorities = async () => {
    const response = await axios.get("http://localhost/Tickets2/tickets/src/backend/getPriorities.php")
    const priorityData = response.data;
    const priorityMap = {};
    priorityData.forEach(element => {
      priorityMap[element.ID] = element.Priority;
    });
    setPriorityMap(priorityMap);
    //console.log(priorityMap);   //debug
  }

  useEffect(() => {
    fetchTickets();
    mapPriorities();
  }, []);
  
//-----------Add Entry
  const handleAddEntry = async (event) => {
    event.preventDefault();
    await axios.post('http://localhost/Tickets2/tickets/src/backend/addTicket.php', formData)
      .then(response => {
        //console.log(response.data);   //debug
        handleClose();
        fetchTickets();
      })
      .catch(error => {
        console.error('There was an error adding the ticket!', error);
      });
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setOpenMenu(true);
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleClose = () => {
    setOpenMenu(false);
    setOpenDelete(false);
  };
  
//-----------Delete Entry             ~nush dc da refresh la toata pagina
  const handleDeleteEntry = async () => {
    await axios.delete(`http://localhost/Tickets2/tickets/src/backend/deleteTicket.php?incident=${selectedIncident}`)
    .then(response => {
      //console.log(response.data);     //debug
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
  const handleEditEntry = async (event) => {
    event.preventDefault();
    await axios.put(`http://localhost/Tickets2/tickets/src/backend/editTicket.php`, editData)
    .then(response => {
        //console.log(response.data);     //debug
        handleClose();
        fetchTickets();
    })
    .catch(error => {
      console.error('There was an error editing the ticket!', error);
    });
  }

  const handleEditClick = (row) => {
    setIsEditMode(true);
    setEditData(row);
    setOpenMenu(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  return (
    <div className='Body'>
      <div className='Header'>
        <img src={logo} alt="Nokia"/>
        <p>Ticket Dashboard</p>
        <button className='AddButton' onClick={handleAddClick}>Add Ticket</button>
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

      <div className='Charts'>
        <StatusChart/>
        <PriorityChart/>
      </div>

      <Dialog open={openMenu} onClose={handleClose} >
        <form>
          <DialogTitle>{isEditMode ? 'Edit Ticket' : 'Add New Ticket'}</DialogTitle>
          <DialogContent>
            <TextField label="Incident" name="Incident" fullWidth margin="normal" required onChange={isEditMode ? handleEditChange : handleChange} value={isEditMode ? editData.Incident : formData.Incident} disabled={isEditMode}/>
            <TextField label="Start Date" name="StartDate" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required onChange={isEditMode ? handleEditChange : handleChange}  value={isEditMode ? editData.StartDate : formData.StartDate}/>
            <FormControl fullWidth required sx={{marginTop: '15px', marginBottom: '10px'}}>
              <InputLabel id="priorityLabel">Priority</InputLabel>
              <Select labelId="priorityLabel" id="priority" label="Priority" name="Priority" onChange={isEditMode ? handleEditChange : handleChange} value={isEditMode ? editData.Priority : formData.Priority}>
                {Object.entries(priorityMap).map(([value, label]) => (
                  <MenuItem key={value} value={Number(value)}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required sx={{marginTop: '15px', marginBottom: '10px'}}>
              <InputLabel id="statusLabel">Status</InputLabel>
              <Select labelId="statusLabel" id="status" value={isEditMode ? editData.Status : formData.Status} label="Status" name="Status" onChange={isEditMode ? handleEditChange : handleChange}>
                <MenuItem value={"Open"}>Open</MenuItem>
                <MenuItem value={"In Progress"}>In Progress</MenuItem>
                <MenuItem value={"Closed"}>Closed</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Last Modified Date" name="LastModifiedDate" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required onChange={isEditMode ? handleEditChange : handleChange} value={isEditMode ? editData.LastModifiedDate : formData.LastModifiedDate}/>
            <TextField label="Assigned Date" name="AssignedDate" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required onChange={isEditMode ? handleEditChange : handleChange} value={isEditMode ? editData.AssignedDate : formData.AssignedDate}/>
            <TextField label="Assigned Person" name="AssignedPerson" fullWidth margin="normal" required onChange={isEditMode ? handleEditChange : handleChange} value={isEditMode ? editData.AssignedPerson : formData.AssignedPerson}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{backgroundColor: 'red', color: 'white', '&:hover': {backgroundColor: 'darkred'}}}>Close</Button>
            <Button onClick={isEditMode ? handleEditEntry : handleAddEntry} type="submit" sx={{ backgroundColor: 'green', color: "white", '&:hover': {backgroundColor: 'darkgreen'}}}>{isEditMode ? 'Edit' : 'Submit'}</Button>
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
    </div>
  );
}


export default Dashboard;