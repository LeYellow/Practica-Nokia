import './table.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'ID', headerName: 'ID', width: 20, headerAlign: 'center', headerClassName: 'TableHeader' },
  { field: 'Incident', headerName: 'Incident', width: 80, headerAlign: 'center', headerClassName: 'TableHeader'  },
  { field: 'Priority', headerName: 'Priority', width: 80, headerAlign: 'center', headerClassName: 'TableHeader'  },
  { field: 'SLA', headerName: 'SLA', width: 30, headerAlign: 'center', headerClassName: 'TableHeader'  },
  { field: 'Status', headerName: 'Status', width: 100, headerAlign: 'center', headerClassName: 'TableHeader'  },
  { field: 'LastModifiedDate', headerName: 'Last Modified Date', width: 140, headerAlign: 'center', headerClassName: 'TableHeader'  },
  { field: 'AssignedDate', headerName: 'Assigned Date', width: 110, headerAlign: 'center', headerClassName: 'TableHeader'  },
  { field: 'AssignedPerson', headerName: 'Assigned Person', width: 130, headerAlign: 'center', headerClassName: 'TableHeader'  },
]

const Table = () => {
  const[data, setData] = useState([]);

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

  return (
    <div className='Body'>
      <div className="Table">
        <p className='Title'> Tickets List Priority </p>
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

      <button>Add Entry</button>

    </div>
  );
}


export default Table;