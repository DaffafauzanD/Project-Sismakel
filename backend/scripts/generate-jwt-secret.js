const crypto = require('crypto');

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('🔐 Generated JWT Secret:');
console.log('='.repeat(50));
console.log(jwtSecret);
console.log('='.repeat(50));
console.log('\n📝 Add this to your .env file:');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('\n⚠️  Keep this secret secure and never commit it to version control!'); 