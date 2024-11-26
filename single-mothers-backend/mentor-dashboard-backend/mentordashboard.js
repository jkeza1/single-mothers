// Fetching mentor data from the API
fetch('/api/mentor')
    .then(response => response.json())
    .then(data => {
        console.log('Mentor Data:', data);

        // Populate mentor data in the HTML elements
        document.querySelector('.info h2').innerText = data.name;
        document.querySelector('.info p:nth-child(2) span').innerText = data.role;
        document.querySelector('.info p:nth-child(3) span').innerText = data.expertise.join(', ');
        document.querySelector('.info p:nth-child(4) span a').innerText = data.email;
    })
    .catch(error => {
        console.error('Error fetching mentor data:', error);
    });

// Listen for the edit profile button click to send updated data
document.querySelector('.edit-profile-btn').addEventListener('click', () => {
    // Get the updated data from form inputs or edit fields
    const updatedData = {
        name: document.querySelector('#mentor-name').value, // Example of getting data from an input field
        role: document.querySelector('#mentor-role').value,  // Example of getting data from an input field
    };

    // Send updated data to the backend API
    fetch('/api/mentor/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);  // Log the success message or show it to the user
            alert('Profile updated successfully!'); // Show a success alert
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again later.'); // Show error message
        });
});
