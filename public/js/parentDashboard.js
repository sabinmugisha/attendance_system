document.addEventListener('DOMContentLoaded', () => {
    console.log('Parent Dashboard loaded.');

    // Example: Fetch notifications via API
    const fetchNotifications = async () => {
        try {
            const response = await fetch('/notifications');
            if (response.ok) {
                const notifications = await response.json();
                console.log('Notifications:', notifications);

                // Example: Render notifications dynamically
                const notificationsList = document.querySelector('.notifications-list');
                if (notificationsList) {
                    notifications.forEach((notification) => {
                        const listItem = document.createElement('li');
                        listItem.textContent = notification.message;
                        notificationsList.appendChild(listItem);
                    });
                }
            } else {
                console.error('Failed to fetch notifications.');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // parentDashboard.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Parent dashboard loaded.');
});


    // Call fetchNotifications on load
    fetchNotifications();
});
