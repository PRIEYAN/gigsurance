import http from 'http';
import app from './app.js';

const port: number = Number(process.env.PORT);

// Create HTTP server using Express app
const server = http.createServer(app);

// Start listening
server.listen(port, () => {
  console.log(`-> Server is running on port ${port}`);
});

// Handle server errors
server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use.`);
    console.error(`💡 Try one of the following:`);
    console.error(`   1. Kill the process using port ${port}: lsof -ti:${port} | xargs kill -9`);
    console.error(`   2. Use a different port by setting PORT environment variable`);
    console.error(`   3. Find and stop the other instance of this server`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});
