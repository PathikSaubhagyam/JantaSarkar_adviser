# Quick Installation Commands for Push Notifications

## Step 1: Install Firebase Packages

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

## Step 2: Download google-services.json

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project (or create new one)
3. Go to Project Settings → Add App → Android
4. Enter package name: `com.jantasarkar.adviser`
5. Download `google-services.json`
6. **IMPORTANT**: Place it here: `android/app/google-services.json`

## Step 3: Rebuild the App

```bash
# Clean previous build
cd android
./gradlew clean
cd ..

# Rebuild and run
npm run android
```

## Step 4: Test Push Notifications

After the app launches, check the console logs for:

- `FCM Token: ey...` - Your device token
- `FCM token registered successfully with backend` - Confirmation

## Quick Test from Firebase Console

1. Firebase Console → Cloud Messaging → Send Test Message
2. Copy your FCM token from console logs
3. Paste and send

## API Endpoint

Your backend endpoint for FCM token registration:

```
POST http://192.168.1.10:8000/mobile/notification/fcm-token/
Authorization: Bearer YOUR_AUTH_TOKEN
Content-Type: application/json

{
  "token": "YOUR_FCM_TOKEN_HERE"
}
```

## Files Modified/Created

✅ `src/common/APIWebCall.tsx` - Added FCM token API
✅ `src/services/NotificationService.tsx` - FCM service handler
✅ `App.tsx` - Initialize notifications on app start
✅ `index.js` - Background message handler
✅ `android/build.gradle` - Firebase plugin
✅ `android/app/build.gradle` - Google services
✅ `android/app/src/main/AndroidManifest.xml` - Permissions
✅ `android/app/src/main/res/values/colors.xml` - Notification color

## Troubleshooting

### Package installation fails?

```bash
npm install --legacy-peer-deps @react-native-firebase/app @react-native-firebase/messaging
```

### Build error: "google-services.json not found"?

- Make sure file is at: `android/app/google-services.json`
- Package name in Firebase matches: `com.jantasarkar.adviser`

### No FCM token in logs?

- Rebuild completely: `cd android && ./gradlew clean && cd .. && npm run android`
- Check if google-services.json is valid
- Test on real device (emulator may have issues)

### Notifications not working?

- Grant notification permission manually in device settings
- Check FCM token in backend database
- Test with Firebase Console first
- Check backend API is working

## Next Steps

After successful installation:

1. Your app will automatically register FCM token on launch
2. FCM token is sent to backend API
3. Backend can now send push notifications
4. App handles foreground, background, and quit state notifications

For detailed setup guide, see: `FCM_SETUP.md`
