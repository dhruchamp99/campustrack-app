# 🔧 Troubleshooting Login Error

## ✅ What I've Fixed:
1. Updated server to listen on 0.0.0.0 (all network interfaces)
2. Server should auto-restart with nodemon

## 🔍 Check if Server Restarted:
Look at your server terminal - you should see:
```
Server accessible at http://192.168.1.4:5000
```

## 🛡️ Windows Firewall Issue:

Windows Firewall might be blocking external connections to port 5000.

### Fix Windows Firewall:

1. **Open Windows Defender Firewall**:
   - Press Windows key
   - Type "Windows Defender Firewall"
   - Click "Windows Defender Firewall with Advanced Security"

2. **Create Inbound Rule**:
   - Click "Inbound Rules" on the left
   - Click "New Rule..." on the right
   - Choose "Port" → Next
   - TCP, Specific local ports: 5000 → Next
   - Allow the connection → Next
   - Check all (Domain, Private, Public) → Next
   - Name: "CampusTrack Backend" → Finish

### OR Quick Command (Run as Administrator):

```powershell
netsh advfirewall firewall add rule name="CampusTrack Backend" dir=in action=allow protocol=TCP localport=5000
```

## 🧪 Test from Your Phone:

1. Open browser on phone
2. Go to: http://192.168.1.4:5000
3. You should see: "API is running..."

If you see this, the backend is accessible!

## 📱 Then Test the App:

1. Open: https://campustrack-app-4b232.web.app
2. Login with: dhru@campus.com / admin123
3. Should work now!

---

## 🆘 If Still Not Working:

Check:
1. Is server running? (check terminal)
2. Is firewall rule added?
3. Are you on same WiFi?
4. Can you access http://192.168.1.4:5000 from phone browser?

Let me know what happens!
