import './priorityChart.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, DialogContent, DialogActions, Button, DialogTitle } from '@mui/material';

const PriorityChart = () => {
  const[dataChart, setDataChart] = useState([]);
  const[dataFiltered, setDataFiltered] = useState([]);
  const[openDialog, setOpenDialog] = useState(false);
  const[selectedPriority, setSelectedPriority] = useState('');
  const filterColumns = [
    { field: 'ID', headerName: 'ID', width: 20, headerAlign: 'center', headerClassName: 'TableHeader' },
    { field: 'Incident', headerName: 'Incident', width: 80, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'StartDate', headerName: 'Start Date', width: 100, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'Priority', headerName: 'Priority', width: 80, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'SLA', headerName: 'SLA', width: 30, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'Status', headerName: 'Status', width: 100, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'LastModifiedDate', headerName: 'Last Modified Date', width: 140, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'AssignedDate', headerName: 'Assigned Date', width: 110, headerAlign: 'center', headerClassName: 'TableHeader'  },
    { field: 'AssignedPerson', headerName: 'Assigned Person', width: 130, headerAlign: 'center', headerClassName: 'TableHeader'  },
  ]

  const fetchPriority = async ()=> {
    try {
      const response = await axios.get("http://localhost/Tickets2/tickets/src/backend/getPriorityCounter.php")
      //console.log(response);    //debug
      if(Array.isArray(response.data)){
        if(response.data.length>0 && typeof response.data[0] === 'object'){
          setDataChart(response.data);
        } else {
          console.error('Priority Chart: Received data is not an array of objects:', response.data);
        }
      } else {
        console.error('Priority Chart: expected array but received: ', response.data);
      }
    } catch (error) {
      console.error('Priority Chart: Error fetching Ticket data:', error);
    }
  }

  const fetchTicketsByPriority = async (priority)=> {
    try {
      const response = await axios.get(`http://localhost/Tickets2/tickets/src/backend/getTicketsByPriority.php?priority=${priority}`)
      console.log(priority);
      //console.log(response);    //debug
      if(Array.isArray(response.data)){
        if(response.data.length>0 && typeof response.data[0] === 'object'){
          setDataFiltered(response.data);
        } else {
          console.error('Pie Selection: Received data is not an array of objects:', response.data);
        }
      } else {
        console.error('Pie Selection: expected array but received: ', response.data);
      }
    } catch (error) {
      console.error('Pie Selection: Error fetching Ticket data:', error);
    }
  }

  useEffect(() => {
    fetchPriority();
  }, []);

  const handleSegmentClick = (priority) => {
    setSelectedPriority(priority);
    fetchTicketsByPriority(priority);
    setOpenDialog(true);
    console.log(priority)
  };

  const handleClose = () => {
    setOpenDialog(false);
  }

  const chartData = {
    series: dataChart.map(item => item.TicketCount),
    options: {
      colors: ['#EF0107', '#FFD700', '#4CBB17', '#007FFF'],
      chart: {
        type: 'polarArea',
        events: {
          dataPointSelection: (event, chartContext, opts) => {
            const priority = chartData.options.labels[opts.dataPointIndex];
            handleSegmentClick(priority);
          }
        }
      },
      states: {
        active: {
          filter: {
            type: 'none'
          }
        }
      },
      labels: dataChart.map(item => item.Priority),
      fill: {
        opacity: 0.8
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  };

  return (
    <div className="PriorityChart">
      <Chart 
        options={chartData.options} 
        series={chartData.series} 
        type="polarArea"
        />

      <Dialog open={openDialog} onClose={handleClose} maxWidth='lg'>
        <form>
          <DialogTitle> {selectedPriority} Tickets </DialogTitle>
            <DialogContent>
              {dataFiltered.length > 0 ? (
                <div className="Table">
                  <DataGrid
                    rows={dataFiltered}
                    columns={filterColumns}
                    getRowId={(row) => row.Incident}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                      },
                    }}
                    localeText={{
                      noRowsLabel: "Loading data..." 
                    }}
                    pageSizeOptions={[]}
                  />
                </div>
              ) : (
                <p>No tickets found for this priority.</p>
              )}
            </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{backgroundColor: 'red', color: 'white', '&:hover': {backgroundColor: 'darkred'}}}>Close</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}


export default PriorityChart;