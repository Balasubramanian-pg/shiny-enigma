const fs = require('fs');
if (fs.existsSync('out')) {
  try {
    fs.rmSync('out', { recursive: true, force: true });
  } catch (e) {
    // ignore lock if any
  }
}
