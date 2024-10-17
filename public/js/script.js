document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const editButton = document.querySelector('.editTaskButton');
    const deleteButton = document.querySelector('.deleteTaskButton');
    const updateStatusButton = document.getElementById('updateStatusButton');
    const statusInput = document.getElementById('status');

    const taskId = document.getElementById('taskId') ? document.getElementById('taskId').value : window.location.pathname.split('/').pop();



    // Handle task creation
    const createTaskForm = document.getElementById('createTaskForm');
    if (createTaskForm) {
        createTaskForm.addEventListener('submit', async function (event) {
            event.preventDefault(); 

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/tasks/create-task', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('accessToken')}`
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Task created successfully!');
                    window.location.href = '/manager';
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message}`);
                }
            } catch (err) {
                console.error('Error:', err);
                alert('An error occurred. Please try again.');
            }
        });
    }
    // Handle task editing
    if (editButton && taskForm) {
        editButton.addEventListener('click', async () => {
            const formData = new FormData(taskForm);
            const data = Object.fromEntries(formData.entries());

            data.assignTo = data.assignTo ? data.assignTo.toString() : '';

            try {
                const response = await fetch(`/tasks/updateTask/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('accessToken')}`
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Task updated successfully!');
                    window.location.href = '/manager';
                } else {
                    const error = await response.text();
                    alert(`Error: ${error}`);
                }
            } catch (err) {
                console.error('Error:', err);
                alert('An error occurred. Please try again.');
            }
        });
    }

    // Handle task deletion
    if (deleteButton) {
        deleteButton.addEventListener('click', async () => {
            // Confirm deletion
            if (confirm('Are you sure you want to delete this task?')) {
                if (!taskId) {
                    alert('Task ID is missing. Unable to delete the task.');
                    return; // Exit if taskId is not defined
                }
    
                try {
                    const response = await fetch(`/tasks/deleteTask/${taskId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${getCookie('accessToken')}`,
                            'Content-Type': 'application/json' // Ensure proper content type
                        }
                    });
    
                    if (response.ok) {
                        alert('Task deleted successfully!');
                        window.location.href = '/manager'; // Redirect to the manager page
                    } else {
                        // Handle the response error
                        const errorData = await response.json();
                        alert(`Error: ${errorData.message || 'Failed to delete task'}`);
                    }
                } catch (err) {
                    console.error('Error:', err); // Log error details
                    alert('An error occurred while trying to delete the task. Please try again.'); // User-friendly message
                }
            }
        });
    }
    

    // const userId = updateStatusButton.dataset.userId;

    // Handle status update
    if (updateStatusButton && statusInput) {

        console.log('Update Status button and status input found');

        updateStatusButton.addEventListener('click', async () => {
            const status = statusInput.value;
            const userId = updateStatusButton.dataset.userId;

            try {
                const response = await fetch(`/tasks/updateStatus/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('accessToken')}`
                    },
                    body: JSON.stringify({ status })
                });

                if (response.ok) {
                    alert('Status updated successfully!');

                    window.location.href = `/employee/${userId}`; 
                } else {
                    const error = await response.text();
                    alert(`Error: ${error}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating the task status');
            }
        });
    }

    // Utility function to get cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
});

document.getElementById('online-users').addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const selectedReceiver = event.target.getAttribute('data-username');
        updateReceiverInfo(selectedReceiver);
    }
});
