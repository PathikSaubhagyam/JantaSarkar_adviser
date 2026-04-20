# Android Signing Note

Generated on: 2026-04-17

## App

- Application ID: `com.jantasarkar.adviserapp`
- Release keystore: `android/app/jantasarkar.keystore`
- Alias: `jantasarkar`
- Created: `2026-04-17`
- Valid until: `2053-09-02`

## Release Fingerprints

Use these for Firebase, Google Sign-In, Maps, or any service that requires the release certificate fingerprint.

- SHA-1: `EA:EA:A7:2B:5C:63:9D:75:3F:07:13:17:38:3F:3B:E4:FE:D5:1E:D2`
- SHA-256: `C0:9C:88:75:B3:79:76:07:6F:6E:EA:F7:39:35:3A:F5:5A:CD:6E:BC:F9:3D:9D:38:25:69:41:0A:7A:CB:4D:FB`

## Gradle Signing Report

Command used:

```powershell
cd android
./gradlew.bat signingReport
```

Relevant release section:

```text
Variant: release
Config: release
Store: G:\MobileGitProject\j\JantaSarkar_adviser\android\app\jantasarkar.keystore
Alias: jantasarkar
MD5: 84:78:76:79:42:FE:53:92:D5:7D:A9:BF:90:89:74:1E
SHA1: EA:EA:A7:2B:5C:63:9D:75:3F:07:13:17:38:3F:3B:E4:FE:D5:1E:D2
SHA-256: C0:9C:88:75:B3:79:76:07:6F:6E:EA:F7:39:35:3A:F5:5A:CD:6E:BC:F9:3D:9D:38:25:69:41:0A:7A:CB:4D:FB
Valid until: Tuesday, 2 September, 2053
```

## keytool Verification

Command used:

```powershell
keytool -list -v -keystore android/app/jantasarkar.keystore -alias jantasarkar
```

Verified certificate owner:

```text
Owner: CN=Janta Sarkar, OU=Adviser, O=Janta Sarkar, L=Unknown, ST=Unknown, C=IN
Issuer: CN=Janta Sarkar, OU=Adviser, O=Janta Sarkar, L=Unknown, ST=Unknown, C=IN
SHA1: EA:EA:A7:2B:5C:63:9D:75:3F:07:13:17:38:3F:3B:E4:FE:D5:1E:D2
SHA256: C0:9C:88:75:B3:79:76:07:6F:6E:EA:F7:39:35:3A:F5:5A:CD:6E:BC:F9:3D:9D:38:25:69:41:0A:7A:CB:4D:FB
Signature algorithm: SHA256withRSA
Key algorithm: 2048-bit RSA
```

## Source Config

- Signing properties are defined in `android/gradle.properties`
- Release signing config is wired in `android/app/build.gradle`

Keep the keystore file and passwords backed up securely. If this keystore is lost, app updates signed with the same identity cannot be published.
