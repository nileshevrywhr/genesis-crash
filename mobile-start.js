#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Genesis Cloud Mobile App - Quick Start');
console.log('=========================================\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

function runCommand(command, description) {
  console.log(`\n📋 ${description}...`);
  console.log(`💻 Running: ${command}\n`);
  
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.log(`❌ Failed to ${description.toLowerCase()}`);
    return false;
  }
}

function checkDevices() {
  console.log('\n📱 Checking for Android devices...');
  
  try {
    const devices = execSync('adb devices', { encoding: 'utf8' });
    const lines = devices.split('\n').filter(line => line.trim() && !line.includes('List of devices'));
    
    if (lines.length === 0) {
      console.log('⚠️  No Android devices found');
      return false;
    }
    
    console.log('✅ Found Android devices:');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`   📱 ${line.trim()}`);
      }
    });
    return true;
  } catch (error) {
    console.log('❌ Could not check for devices (ADB not available)');
    return false;
  }
}

async function main() {
  try {
    // Step 1: Check if we're in the right directory
    if (!require('fs').existsSync('package.json')) {
      console.log('❌ Please run this script from the project root directory');
      process.exit(1);
    }

    // Step 2: Check Android setup
    console.log('🔍 Checking Android setup...');
    
    const setupCheck = await askQuestion('Do you want to run the Android setup check? (y/n): ');
    if (setupCheck === 'y' || setupCheck === 'yes') {
      if (!runCommand('node check-android-setup.js', 'Checking Android setup')) {
        console.log('\n❌ Android setup incomplete. Please fix the issues above.');
        console.log('📖 See ANDROID_SETUP.md for detailed instructions.');
        process.exit(1);
      }
    }

    // Step 3: Install dependencies
    const install = await askQuestion('\nInstall/update dependencies? (y/n): ');
    if (install === 'y' || install === 'yes') {
      if (!runCommand('npm install', 'Installing dependencies')) {
        console.log('❌ Failed to install dependencies');
        process.exit(1);
      }
    }

    // Step 4: Check for devices
    const hasDevices = checkDevices();
    
    if (!hasDevices) {
      console.log('\n💡 To connect a device:');
      console.log('   📱 Physical device: Enable USB debugging and connect via USB');
      console.log('   🖥️  Emulator: Start an AVD from Android Studio');
      
      const continueAnyway = await askQuestion('\nContinue anyway? (y/n): ');
      if (continueAnyway !== 'y' && continueAnyway !== 'yes') {
        console.log('👋 Setup your device and try again!');
        process.exit(0);
      }
    }

    // Step 5: Choose how to start
    console.log('\n🚀 How would you like to start the app?');
    console.log('1. Start development server and open Android automatically');
    console.log('2. Start development server only (you choose platform)');
    console.log('3. Exit');
    
    const choice = await askQuestion('\nEnter your choice (1-3): ');
    
    rl.close();
    
    switch (choice) {
      case '1':
        console.log('\n🚀 Starting development server and launching Android...');
        console.log('📱 This will open the app on your connected Android device/emulator');
        
        // Start the development server with Android
        const androidProcess = spawn('npm', ['run', 'android'], {
          stdio: 'inherit',
          shell: true
        });
        
        androidProcess.on('close', (code) => {
          console.log(`\n📱 Android process exited with code ${code}`);
        });
        
        break;
        
      case '2':
        console.log('\n🚀 Starting development server...');
        console.log('📱 Press "a" for Android, "i" for iOS, "w" for web');
        
        // Start the development server
        const devProcess = spawn('npm', ['start'], {
          stdio: 'inherit',
          shell: true
        });
        
        devProcess.on('close', (code) => {
          console.log(`\n🚀 Development server exited with code ${code}`);
        });
        
        break;
        
      case '3':
        console.log('\n👋 Goodbye! Run this script again when you\'re ready.');
        break;
        
      default:
        console.log('\n❌ Invalid choice. Please run the script again.');
        break;
    }
    
  } catch (error) {
    console.error('\n❌ An error occurred:', error.message);
    rl.close();
    process.exit(1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Goodbye!');
  rl.close();
  process.exit(0);
});

main();
