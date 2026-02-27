# Firebase Push Notification Setup Guide

## Step 1: Install Required Packages

Run the following command to install Firebase messaging:

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

After installation, rebuild your app:

```bash
npm run android
```

## Step 2: Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Click on "Add app" and select Android
4. Enter your package name: `com.jantasarkar.adviser`
5. Download the `google-services.json` file
6. Place it in `android/app/` directory

## Step 3: Android Configuration

### 3.1 Update `android/build.gradle`

Add the following in the buildscript dependencies:

```gradle
buildscript {
    dependencies {
        // Add this line
        classpath('com.google.gms:google-services:4.4.0')
    }
}
```

### 3.2 Update `android/app/build.gradle`

Add at the bottom of the file:

```gradle
apply plugin: 'com.google.gms.google-services'
```

## Step 4: AndroidManifest.xml Configuration

Add the following permissions in `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
    <!-- Add these permissions -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

    <application>
        <!-- Add notification icon metadata (optional) -->
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_icon"
            android:resource="@drawable/ic_notification" />

        <!-- Add notification color metadata (optional) -->
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_color"
            android:resource="@color/colorAccent" />
    </application>
</manifest>
```

## Step 5: iOS Configuration (if targeting iOS)

### 5.1 Install Pods

```bash
cd ios
pod install
cd ..
```

### 5.2 Add GoogleService-Info.plist

1. Download `GoogleService-Info.plist` from Firebase Console
2. Place it in `ios/` directory
3. Add it to Xcode project

### 5.3 Enable Push Notifications in Xcode

1. Open `ios/JantaSarkarAdviser.xcworkspace` in Xcode
2. Select your project in navigator
3. Go to "Signing & Capabilities"
4. Click "+ Capability"
5. Add "Push Notifications"
6. Add "Background Modes" and enable "Remote notifications"

## Step 6: Test Push Notifications

### Test from Firebase Console

1. Go to Firebase Console → Cloud Messaging
2. Click "Send your first message"
3. Enter notification title and text
4. Click "Send test message"
5. Enter your FCM token (check console logs)
6. Click "Test"

### Test from Backend

Use the following curl command or Postman:

```bash
curl -X POST http://192.168.1.10:8000/mobile/notification/fcm-token/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{"token": "YOUR_FCM_TOKEN"}'
```

## How It Works

1. **App Launch**: `NotificationService` initializes automatically
2. **Permission Request**: User is asked for notification permission
3. **Token Generation**: FCM generates a unique token for the device
4. **Token Registration**: Token is sent to your backend API
5. **Receive Notifications**: App can now receive push notifications

## Notification Types Handled

- ✅ **Foreground**: When app is open and active
- ✅ **Background**: When app is in background
- ✅ **Quit State**: When app is completely closed
- ✅ **Notification Tap**: When user taps on notification

## Troubleshooting

### Token not generating?

- Check if `google-services.json` is in correct location
- Verify package name matches in Firebase Console
- Rebuild the app completely

### Notifications not received?

- Check device logs for FCM token
- Verify token is registered with backend
- Check notification permissions in device settings
- Test with Firebase Console first

### Build errors?

- Run `cd android && ./gradlew clean && cd ..`
- Rebuild: `npm run android`
- Check gradle versions are compatible

## Console Logs to Monitor

You'll see these logs in your console:

- `Notification authorization status:` - Permission status
- `FCM Token:` - Your device's FCM token
- `FCM token registered successfully with backend` - Backend registration success
- `Foreground notification received:` - Notification in foreground
- `Background notification received:` - Notification in background
- `Notification opened app:` - User tapped notification

## Important Notes

- FCM tokens can refresh, so always listen for token refresh events (already handled)
- Test on real device for best results (emulator may have issues)
- Store FCM token in AsyncStorage to prevent duplicate registrations
- Handle notification navigation based on payload data
