import axios from 'axios';

const deleteTicket = (incident, fetchData) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
        axios.delete(`http://localhost/Tickets2/tickets/src/backend/deleteUser.php?incident=${incident}`)
        .then(response => {
          console.log(response.data);
          if (fetchData) fetchData();
        })
        .catch(error => {
            console.error('There was an error deleting the ticket!', error);
        });
    }
    fetchData();
}

export default deleteTicket;