// Test script to verify lucide-react icons are working
const { exec } = require('child_process');

// Test if lucide-react can be imported
exec('node -e "const { Award, Zap, Globe, HeadphonesIcon } = require(\'lucide-react\'); console.log(\'Icons imported successfully:\', !!Award, !!Zap, !!Globe, !!HeadphonesIcon);"', (error, stdout, stderr) => {
  if (error) {
    console.error('Icon import error:', error);
    return;
  }
  console.log('Icon test result:', stdout);
  if (stderr) {
    console.error('Icon import stderr:', stderr);
  }
});