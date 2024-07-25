import './statusChart.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, DialogContent, DialogActions, Button, DialogTitle } from '@mui/material';

const StatusChart = () => {
  const[dataChart, setDataChart] = useState([]);
  const[dataFiltered, setDataFiltered] = useState([]);
  const[openDialog, setOpenDialog] = useState(false);
  const[selectedStatus, setSelectedStatus] = useState('');
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

  const fetchStatus = async ()=> {
    try {
      const response = await axios.get("http://localhost/Tickets2/tickets/src/backend/getStatusCounter.php")
      //console.log(response);    //debug
      if(Array.isArray(response.data)){
        if(response.data.length>0 && typeof response.data[0] === 'object'){
          setDataChart(response.data);
        } else {
          console.error('Status Chart: Received data is not an array of objects:', response.data);
        }
      } else {
        console.error('Status Chart: expected array but received: ', response.data);
      }
    } catch (error) {
      console.error('Status Chart: Error fetching Ticket data:', error);
    }
  }

  const fetchTicketsByStatus = async (status)=> {
    try {
      const response = await axios.get(`http://localhost/Tickets2/tickets/src/backend/getTicketsByStatus.php?status=${status}`)
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
    fetchStatus();
  }, []);

  const handleSegmentClick = (status) => {
    setSelectedStatus(status);
    fetchTicketsByStatus(status);
    setOpenDialog(true);
    console.log(status)
  };

  const handleClose = () => {
    setOpenDialog(false);
  }

  const chartData = {
    series: dataChart.map(stat => stat.TicketCount),
    options: {
      colors: ['#4CBB17', '#FFD700', '#EF0107'],
      chart: {
        type: 'pie',
        events: {
          dataPointSelection: (event, chartContext, opts) => {
            const status = chartData.options.labels[opts.dataPointIndex];
            handleSegmentClick(status);
            
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
      labels: dataChart.map(stat => stat.Status),
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  };

  return (
    <div className="StatusChart">
      <Chart 
        options={chartData.options} 
        series={chartData.series} 
        type="pie"
      />

      <Dialog open={openDialog} onClose={handleClose} maxWidth='lg'>
        <form>
          <DialogTitle> {selectedStatus} Tickets </DialogTitle>
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
                    pageSizeOptions={[]}
                  />
                </div>
              ) : (
                <p>No tickets found for this status.</p>
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


export default StatusChart;