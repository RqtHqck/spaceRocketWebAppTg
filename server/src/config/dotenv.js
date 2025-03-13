const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
console.log('Environment variables loaded from:', path.resolve(__dirname, '../../.env'));