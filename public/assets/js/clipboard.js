function saveToClipboard() {
    const content = document.getElementById('content').value;
    const password = document.getElementById('password').value;
    const expire = document.getElementById('expire').value;

    const data = {
        content: content,
        password: password,
        expires_at: expire
    };

    fetch('/clipboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => alert(`Item saved to clipboard. ID: ${data.id}`))
        .catch(error => console.error(error));
}

function loadFromClipboard() {
    const itemId = document.getElementById('itemId').value;
    const password = document.getElementById('itemPassword').value;

    fetch(`/clipboard/${itemId}?password=${password}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                const clipboardContent = document.getElementById('clipboardContent');
                clipboardContent.textContent = "Can't Find Your Content. / Your Password is wrong.";
            }
        })
        .then(data => {
            const clipboardContent = document.getElementById('clipboardContent');
            clipboardContent.textContent = data.content;
        })
        .catch(error => console.error(error));
}