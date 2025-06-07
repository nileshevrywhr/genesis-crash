# Genesis Cloud Mobile App

A cross-platform mobile application built with React Native and Expo for interacting with the Genesis Cloud API. This app allows users to securely connect to their Genesis Cloud account and view compute instances.

## Features

### Core Functionality

- **Secure API Token Input**: Enter your Genesis Cloud Bearer token with validation
- **API Integration**: Fetch compute instances from Genesis Cloud API
- **JSON Response Display**: View API responses in a formatted, readable layout
- **Error Handling**: Comprehensive error handling for network issues and invalid tokens

### UI/UX Features

- **Modern Design**: Clean, intuitive interface following Material Design principles
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Responsive Layout**: Works seamlessly on various screen sizes
- **Smooth Animations**: Haptic feedback and smooth transitions
- **Accessibility**: Screen reader support and proper contrast ratios

### Security Features

- **Secure Storage**: API tokens are stored securely (SecureStore on mobile, localStorage on web)
- **Input Validation**: Token format validation and sanitization
- **Secure HTTP**: All API requests use HTTPS with proper headers

### Additional Features

- **Pull-to-Refresh**: Refresh data by pulling down on the response view
- **Copy to Clipboard**: Copy API responses to clipboard with one tap
- **Persistent Storage**: App remembers your token and last fetched data
- **Loading States**: Visual feedback during API requests
- **Clear Token**: Easy way to clear stored credentials

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: React Hooks
- **Storage**: Platform-specific (SecureStore/AsyncStorage on mobile, localStorage on web)
- **UI Components**: React Native with custom styling
- **Icons**: Expo Vector Icons
- **Haptics**: Expo Haptics for tactile feedback

## Project Structure

```
genesis-cloud-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── TokenInput.tsx   # API token input component
│   │   ├── ApiResponse.tsx  # JSON response display component
│   │   └── LoadingSpinner.tsx # Loading indicator component
│   ├── services/            # API and external services
│   │   └── genesisApi.ts    # Genesis Cloud API service
│   ├── utils/               # Utility functions
│   │   ├── storage.ts       # Secure storage utilities
│   │   └── validation.ts    # Input validation utilities
│   ├── styles/              # Theme and styling
│   │   └── theme.ts         # Light/dark theme definitions
│   ├── hooks/               # Custom React hooks
│   │   └── useColorScheme.ts # Theme management hook
│   └── types/               # TypeScript type definitions
│       └── index.ts         # App-wide type definitions
├── App.tsx                  # Main application component
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional, can use npx)

### Installation

1. **Clone or download the project**
2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start both servers** (required for web version due to CORS):

   ```bash
   # Terminal 1: Start the proxy server
   npm run start-proxy

   # Terminal 2: Start the Expo development server
   npm start
   ```

   **Alternative**: Use the combined command:

   ```bash
   npm run dev
   ```

4. **Run on different platforms**:
   - **Web**: Press `w` in the terminal or visit `http://localhost:8082`
   - **iOS**: Press `i` (requires macOS and Xcode)
   - **Android**: Press `a` (requires Android Studio/SDK)
   - **Mobile Device**: Scan QR code with Expo Go app

### Important: CORS and Proxy Server

The Genesis Cloud API doesn't allow direct browser requests due to CORS restrictions. For the web version to work, you **must** run the proxy server alongside the Expo development server:

- **Proxy Server**: `http://localhost:3001` (handles API requests)
- **Expo App**: `http://localhost:8082` (serves the application)

The mobile versions (iOS/Android) don't have CORS restrictions and can connect directly to the Genesis Cloud API.

### Platform Differences

**Web Browser:**

- Uses proxy server to avoid CORS restrictions
- Stores tokens in browser localStorage
- Full functionality with modern web browsers

**Mobile (iOS/Android):**

- Direct API connection (no proxy needed)
- Uses Expo SecureStore for encrypted token storage
- Native mobile experience with haptic feedback

### Usage

1. **Enter API Token**: Input your Genesis Cloud Bearer token in the text field
2. **Connect**: Tap "Connect to Genesis Cloud" to fetch your instances
3. **View Results**: Browse your compute instances in the formatted JSON display
4. **Refresh**: Pull down to refresh data or tap the refresh icon
5. **Copy Data**: Tap the copy icon to save the response to your clipboard

### API Token Format

The app expects a Genesis Cloud API token in the format:

```
Bearer your_actual_token_here
```

The app will automatically add the "Bearer " prefix if you only enter the token value.

## Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run start-proxy` - Start the proxy server (required for web)
- `npm run dev` - Start both proxy and Expo servers concurrently
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS (macOS only)
- `npm run web` - Run in web browser
- `npm run check-android` - Check Android development setup
- `npm run mobile-start` - Interactive mobile setup and launch

### 📱 Android Development Setup

#### Quick Setup Check

```bash
npm run check-android
```

#### Prerequisites for Android Development

1. **Install Android Studio**: Download from https://developer.android.com/studio
2. **Set up Android SDK**: Install Android SDK and platform-tools
3. **Configure Environment Variables**:

   ```bash
   # Linux/macOS
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools

   # Windows
   set ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
   set PATH=%PATH%;%ANDROID_HOME%\platform-tools
   ```

4. **Create Virtual Device**: Set up an Android emulator in Android Studio
5. **Enable USB Debugging**: For physical devices

#### Running on Android

**With Emulator:**

```bash
# Start your Android emulator first
npm run android
```

**With Physical Device:**

```bash
# Connect device via USB with USB debugging enabled
adb devices  # Verify device is connected
npm run android
```

For detailed Android setup instructions, see: [ANDROID_SETUP.md](./ANDROID_SETUP.md)

### Building for Production

For production builds, refer to the [Expo documentation](https://docs.expo.dev/build/introduction/).

## Security Considerations

- API tokens are stored securely (SecureStore on mobile, localStorage on web)
- All API requests use HTTPS
- Input validation prevents malformed requests
- No sensitive data is logged or exposed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions:

1. Check the Genesis Cloud API documentation
2. Review the app's error messages
3. Ensure your API token has proper permissions
4. Verify network connectivity

## Acknowledgments

- Built with Expo and React Native
- Uses Genesis Cloud API
- Icons by Expo Vector Icons
- Follows Material Design guidelines
