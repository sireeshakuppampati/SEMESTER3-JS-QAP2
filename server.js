const http = require('http');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const axios = require('axios');

// Define and initialize an EventEmitter class
class MyEmitter extends EventEmitter {};
const myEmitter = new MyEmitter();

// Log event handler
myEmitter.on('log', (message) => {
    const logFilePath = path.join(__dirname, 'logs', `${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFile(logFilePath, message + '\n', (err) => {
        if (err) console.error('Error writing to log file:', err);
    });
});

// Helper function to serve files
function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Server Error');
            myEmitter.emit('log', `Error reading file: ${filePath}`);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
            myEmitter.emit('log', `File served: ${filePath}`);
        }
    });
}

// Create the HTTP server
const server = http.createServer((req, res) => {
    switch (req.url) {
        case '/':
            serveFile(res, 'views/index.html', 'text/html');
            myEmitter.emit('log', 'Home page accessed');
            break;
        case '/about':
            serveFile(res, 'views/about.html', 'text/html');
            myEmitter.emit('log', 'About page accessed');
            break;
        case '/contact':
            serveFile(res, 'views/contact.html', 'text/html');
            myEmitter.emit('log', 'Contact page accessed');
            break;
        case '/products':
            serveFile(res, 'views/products.html', 'text/html');
            myEmitter.emit('log', 'Products page accessed');
            break;
        case '/subscribe':
            serveFile(res, 'views/subscribe.html', 'text/html');
            myEmitter.emit('log', 'Subscribe page accessed');
            break;
        case '/daily-info':
            axios.get('https://api.example.com/daily')
                .then(response => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(response.data));
                    myEmitter.emit('log', 'Daily info accessed');
                })
                .catch(error => {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error fetching daily information');
                    myEmitter.emit('log', 'Error fetching daily information');
                });
            break;
        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            myEmitter.emit('log', '404 - Page not found');
    }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    myEmitter.emit('log', `Server started on port ${PORT}`);
});
