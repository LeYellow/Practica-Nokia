import './dashboard.css';
import StatusChart from '../components/statusChart.js';
import PriorityChart from '../components/priorityChart.js';
import logo from '../resources/logo.svg'; 
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, DialogContent, DialogActions, Button, TextField, DialogTitle, DialogContentText, MenuItem, Select, InputLabel, FormControl, Tooltip } from '@mui/material';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { CSVLink } from "react-csv";

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
    Description: '',
    Requestor: '',
    Team: '',
    ProjectName: '',
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
    Description: '',
    Requestor: '',
    Team: '',
    ProjectName: '',
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
    { field: 'Functions', headerName: 'Functions', width: 100, headerAlign: 'center', headerClassName: 'TableHeader',
      renderCell: (params) => (
        <div>
          <Tooltip title="Edit" arrow placement="top" size="md" variant="soft">
            <BorderColorRoundedIcon onClick={() => handleEditClick(params.row)}
              sx={{ marginTop:'8px', padding:'5px', borderRadius:'5px', marginRight: 1, backgroundColor: '#006A4E', color: 'white', '&:hover': { backgroundColor: '#1B4D3E' , cursor: 'pointer' } }}
            >Edit</BorderColorRoundedIcon>
          </Tooltip>
          <Tooltip title="Delete" arrow placement="top" size="md" variant="soft">
            <DeleteForeverRoundedIcon onClick={() => handleDeleteClick(params.row.Incident)}
              sx={{ padding:'5px', borderRadius:'5px', backgroundColor: '#CF352E', color: 'white', '&:hover': { backgroundColor: 'darkred' , cursor: 'pointer' } }}
            >Delete</DeleteForeverRoundedIcon>
          </Tooltip>
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

  const getKeyByValue = (map, label) => {
    return Object.keys(map).find(key => map[key] === label);
  };

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
    setFormData('');
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

  const handleEditClick = async (row) => {    //changes only if row clicked
    setEditData({
      ID: row.ID,
      Incident: row.Incident,
      StartDate: row.StartDate,
      Priority: getKeyByValue(priorityMap, row.Priority),
      Status: row.Status,
      LastModifiedDate: row.LastModifiedDate,
      AssignedDate: row.AssignedDate,
      AssignedPerson: row.AssignedPerson,
      Description: notes.Description,
      Requestor: notes.Requestor,
      Team: notes.Team,
      ProjectName: notes.ProjectName,
    })
    setIsEditMode(true);
    setOpenMenu(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
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

//-----------Ticket Description
  const [selectedRow, setSelectedRow] = useState(null);
  const [notes, setNotes] = useState({
    Description: '',
    Requestor: '',
    Team: '',
    ProjectName: '',
  });

  const fetchTicketNotes = async (incident) => {
    try {
      const response = await axios.get(`http://localhost/Tickets2/tickets/src/backend/getDescription.php?incident=${incident}`);
      //console.log(response);    //debug
      if(Array.isArray(response.data)){
        if(response.data.length>0 && typeof response.data[0] === 'object'){
          setNotes(response.data[0]);
        } else {
          setNotes({
            Description: 'No description available.',
            Requestor: 'N/A',
            Team: 'N/A',
            ProjectName: 'N/A'
          });
        }
      } else {
        console.error('Ticket Description: expected array but received: ', response.data);
      }
    } catch (error) {
      console.error('Error fetching Ticket data:', error);
    }
  };

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    fetchTicketNotes(params.row.Incident);
  };

  return (
    <div className='Body'>
      <div className='Header'>
        <img src={logo} alt="Nokia"/>
        <p>Ticket Dashboard</p>
        <button className='AddButton' onClick={handleAddClick}>Add Ticket</button>
        <button className='DownloadButton'><CSVLink filename={"TicketList.csv"} data={data}>Download Tickets</CSVLink></button>
      </div>

      <div className='Tickets'>
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
                onRowClick={handleRowClick}
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

        <div className='TicketDescription'>
          {selectedRow ? (
            <div>
              <p><b>Incident: </b>{selectedRow.Incident}</p>
              <p><b>Requestor: </b>{notes.Requestor}</p>
              <p><b>Team: </b>{notes.Team}</p>
              <p><b>Project Name: </b>{notes.ProjectName}</p>
              <p><b>Description: </b>{notes.Description}</p>
            </div>
          ) : (
            <p>Select a ticket to see the details</p>
          )}  
        </div>
      </div>

      <div className='Charts'>
        <StatusChart/>
        <PriorityChart/>
      </div>

      <Dialog open={openMenu} onClose={handleClose}>
        <form>
          <DialogTitle>{isEditMode ? 'Edit Ticket' : 'Add New Ticket'}</DialogTitle>
          <DialogContent>
            <TextField label="Incident" name="Incident" margin="normal" required onChange={isEditMode ? handleEditChange : handleChange} value={isEditMode ? editData.Incident : formData.Incident} disabled={isEditMode} style={{width: 260}}/>
            <TextField label="Start Date" name="StartDate" type="date" InputLabelProps={{ shrink: true }} margin="normal" required onChange={isEditMode ? handleEditChange : handleChange}  value={isEditMode ? editData.StartDate : formData.StartDate} style={{width: 260, marginLeft: 30}}/>
            <FormControl required sx={{marginTop: '15px', marginBottom: '10px'}}>
              <InputLabel id="priorityLabel">Priority</InputLabel>
              <Select labelId="priorityLabel" id="priority" label="Priority" name="Priority" onChange={isEditMode ? handleEditChange : handleChange} value={isEditMode ? editData.Priority : formData.Priority} style={{width: 260, marginRight: 30}}>
                {Object.entries(priorityMap).map(([value, label]) => (
                  <MenuItem key={value} value={Number(value)}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl required sx={{marginTop: '15px', marginBottom: '10px'}}>
              <InputLabel id="statusLabel">Status</InputLabel>
              <Select labelId="statusLabel" id="status" value={isEditMode ? editData.Status : formData.Status} label="Status" name="Status" onChange={isEditMode ? handleEditChange : handleChange} style={{width: 260}}>
                <MenuItem value={"Open"}>Open</MenuItem>
                <MenuItem value={"In Progress"}>In Progress</MenuItem>
                <MenuItem value={"Closed"}>Closed</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Assigned Date" name="AssignedDate" type="date" InputLabelProps={{ shrink: true }} margin="normal" required onChange={isEditMode ? handleEditChange : handleChange} value={isEditMode ? editData.AssignedDate : formData.AssignedDate} style={{width: 260}}/>
            <TextField label="Last Modified Date" name="LastModifiedDate" type="date" InputLabelProps={{ shrink: true }} margin="normal" required onChange={isEditMode ? handleEditChange : handleChange} value={isEditMode ? editData.LastModifiedDate : formData.LastModifiedDate} style={{width: 260, marginLeft: 30}}/>
            <TextField label="Assigned Person" name="AssignedPerson" fullWidth margin="normal" required onChange={isEditMode ? handleEditChange : handleChange} value={isEditMode ? editData.AssignedPerson : formData.AssignedPerson}/>

            <TextField label="Requestor" name="Requestor" fullWidth margin="normal" required onChange={isEditMode ? handleEditChange : handleChange} value={isEditMode ? editData.Requestor : formData.Requestor}/>
            <TextField label="Team" name="Team" margin="normal" required onChange={isEditMode ? handleEditChange : handleChange} value={isEditMode ? editData.Team : formData.Team} style={{width: 260}}/>
            <TextField label="Project Name" name="ProjectName" margin="normal" required onChange={isEditMode ? handleEditChange : handleChange} value={isEditMode ? editData.ProjectName : formData.ProjectName} style={{width: 260, marginLeft: 30}}/>
            <TextField label="Description" name="Description" fullWidth multiline rows={3} required margin="normal" onChange={isEditMode ? handleEditChange : handleChange} value={isEditMode ? editData.Description : formData.Description}/>
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