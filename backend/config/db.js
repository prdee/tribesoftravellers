const mongoose = require('mongoose');
const dns = require('dns');

let cachedConnection = null;
let dbStatus = {
  lastAttemptAt: null,
  lastConnectedAt: null,
  lastError: ''
};

mongoose.set('bufferCommands', false);
mongoose.set('strictQuery', false);

// Force IPv4 DNS resolution
dns.setDefaultResultOrder('ipv4first');

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  dbStatus.lastAttemptAt = Date.now();

  try {
    console.log('[mongodb] attempting connection...');
    console.log('[mongodb] uri host:', process.env.MONGODB_URI?.split('@')[1]?.split('/')[0]);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxPoolSize: 5,
      minPoolSize: 1,
      heartbeatFrequencyMS: 10000,
      autoIndex: false,
      family: 4,
      retryWrites: true,
      w: 'majority',
      directConnection: false,
      appName: 'ttt-backend',
      tls: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true
    });

    cachedConnection = conn;
    dbStatus.lastConnectedAt = Date.now();
    dbStatus.lastError = '';
    console.log('[mongodb] connected successfully');
    return conn;
  } catch (err) {
    cachedConnection = null;
    dbStatus.lastError = err?.message || String(err);
    console.error('[mongodb] connection_failed:', err.message);
    console.error('[mongodb] error code:', err.code);
    console.error('[mongodb] error name:', err.name);
    throw err;
  }
}

function isDBConnected() {
  return mongoose.connection.readyState === 1;
}

function getDBStatus() {
  return {
    ...dbStatus,
    readyState: mongoose.connection.readyState
  };
}

module.exports = { connectDB, isDBConnected, getDBStatus };
