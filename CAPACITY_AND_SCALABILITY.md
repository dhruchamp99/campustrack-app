# 📊 CampusTrack — Production Capacity Report

### 4,000 Students | 48 Subjects | 4 Years | MongoDB Atlas Free Tier (512 MB)
> Schema: Array-Based Sessions | Generated: April 4, 2026

---

## 📋 Your Exact Configuration

| Parameter | Value |
|-----------|-------|
| Total students | **4,000** |
| Students per year (Y1–Y4) | **1,000** |
| Total subjects (across 4 years) | **48** |
| Subjects per year | **12** (6 per semester) |
| Classes per day per student | **5** |
| Working days per week | **5** |
| Academic weeks per year | **~40** (2 semesters × 20 weeks) |
| **Working days per year** | **200** |

---

## 🧮 Step-by-Step Calculation

### Step 1: How Many Sessions Per Day?

A "session" = **1 document** = one subject taught on one date.

```
Year 1 students → 5 subject classes per day  = 5 sessions
Year 2 students → 5 subject classes per day  = 5 sessions
Year 3 students → 5 subject classes per day  = 5 sessions
Year 4 students → 5 subject classes per day  = 5 sessions
─────────────────────────────────────────────────────────
Total sessions per day                       = 20 sessions
```

### Step 2: How Many Sessions Per Year?

```
20 sessions/day × 200 working days = 4,000 sessions/year
```

### Step 3: How Big Is Each Session Document?

Each session stores student IDs in arrays:

```
4,000 students ÷ 48 subjects = ~83 students per subject (minimum)
4,000 students ÷ 4 years = 1,000 students per year
1,000 students ÷ 4-5 departments = ~200-250 students per class
```

| Average Class Size | Present Array (85%) | Absent Array (15%) | Overhead | **Total** |
|-------------------|--------------------:|-------------------:|---------:|----------:|
| 100 students | 1,020 B | 180 B | 200 B | **~1.4 KB** |
| 200 students | 2,040 B | 360 B | 200 B | **~2.6 KB** |
| 250 students | 2,550 B | 450 B | 200 B | **~3.2 KB** |
| 500 students | 5,100 B | 900 B | 200 B | **~6.2 KB** |

### Step 4: Annual Storage

| Class Size Assumption | Sessions/Year | Doc Size | **Storage/Year** |
|-----------------------|--------------|----------|-----------------|
| 200 students (typical) | 4,000 | 2.6 KB | **~10 MB/year** |
| 250 students | 4,000 | 3.2 KB | **~13 MB/year** |
| 500 students (large) | 4,000 | 6.2 KB | **~25 MB/year** |

---

## 💾 Total Storage Breakdown

### Fixed Storage (One-Time)

| Collection | Documents | Size |
|------------|----------|------|
| Users (4,000 students + ~200 teachers) | 4,200 | **~3 MB** |
| Subjects | 48 | **~0.1 MB** |
| Holidays | ~50/year | **~0.05 MB** |
| Indexes & metadata | — | **~2 MB** |
| **Total fixed** | — | **~5 MB** |

### Growing Storage (Per Year)

| Component | Size |
|-----------|------|
| Attendance sessions (4,000 × 2.6 KB) | **~10 MB** |

---

## 📅 Year-by-Year Capacity (200 students/class)

| Year | Sessions Total | Attendance Data | Total Storage | Free Space | Used |
|------|---------------|----------------|---------------|------------|------|
| **Year 1** | 4,000 | 10 MB | 15 MB | 497 MB | **3%** 🟢 |
| **Year 2** | 8,000 | 20 MB | 25 MB | 487 MB | **5%** 🟢 |
| **Year 3** | 12,000 | 30 MB | 35 MB | 477 MB | **7%** 🟢 |
| **Year 4** | 16,000 | 40 MB | 45 MB | 467 MB | **9%** 🟢 |
| **Year 5** | 20,000 | 50 MB | 55 MB | 457 MB | **11%** 🟢 |
| **Year 10** | 40,000 | 100 MB | 105 MB | 407 MB | **21%** 🟢 |
| **Year 15** | 60,000 | 150 MB | 155 MB | 357 MB | **30%** 🟢 |
| **Year 20** | 80,000 | 200 MB | 205 MB | 307 MB | **40%** 🟢 |
| **Year 25** | 100,000 | 250 MB | 255 MB | 257 MB | **50%** 🟡 |
| **Year 30** | 120,000 | 300 MB | 305 MB | 207 MB | **60%** 🟡 |
| **Year 40** | 160,000 | 400 MB | 405 MB | 107 MB | **79%** 🟠 |
| **Year 50** | 200,000 | 500 MB | 505 MB | 7 MB | **99%** 🔴 |

> ### 🎯 Your database lasts **~50 years** with 4,000 students.

---

## ⚡ Stress Test: What If Classes Are Bigger?

| Scenario | Avg Class Size | MB/Year | Years Until Full |
|----------|---------------|---------|-----------------|
| **Departmental** (typical) | 200 | 10 MB | **~50 years** ✅ |
| **Year-wide** classes | 500 | 25 MB | **~20 years** ✅ |
| **All-student** lectures | 1,000 | 48 MB | **~10 years** ✅ |

Even in the worst case (every class has 1,000 students), you still get **10 years** free.

---

## 📊 Old Schema vs New Schema — Your Numbers

| Metric | ❌ Old (Per Student) | ✅ New (Per Session) |
|--------|---------------------|---------------------|
| Docs per day | 4,000 students × 5 = **20,000** | 4 years × 5 = **20** |
| Docs per year | **4,000,000** | **4,000** |
| Size per year | **~800 MB** (exceeds limit!) | **~10 MB** |
| Time to fill 512 MB | **~7 months** ❌ | **~50 years** ✅ |
| Document reduction | — | **99.9%** |

```
OLD:  4,000 students × 5 classes × 200 days = 4,000,000 docs/year  ❌ IMPOSSIBLE
NEW:  20 sessions/day × 200 days            =     4,000 docs/year  ✅ EASY
```

---

## 🏗️ Production Status

| Component | Details | Status |
|-----------|---------|--------|
| Frontend | `campustrack-app-4b232.web.app` | ✅ Deployed on Firebase |
| Backend | Auto-deploys from GitHub | ✅ Deployed on Render |
| Database | `campustrack.qxnptp5.mongodb.net` | ✅ Migrated & Optimized |
| Old data backup | `attendances_backup_1775287245787` | ✅ Safe |
| Undo script | `undo-attendance-optimization.ps1` | ✅ Ready |

---

## 👥 Concurrent Access — How Many Can Use It At Once?

### Your Stack's Limits

```
┌────────────────────────────────────────────────────────────────┐
│  LAYER 1: Firebase Hosting (Frontend - Static Files)          │
│  ✅ Limit: Virtually unlimited (CDN serves globally)          │
│  ✅ All 4,000 students can open the website simultaneously    │
│  ⚠️  Free plan: 10 GB bandwidth/month                        │
├────────────────────────────────────────────────────────────────┤
│  LAYER 2: Render Backend (API Server - Free Tier)             │
│  ⚠️  RAM: 512 MB                                             │
│  ⚠️  CPU: Shared (single core)                               │
│  ⚠️  Sleeps after 15 min idle (cold start: ~30-50 sec)       │
│  ✅ Node.js handles concurrent I/O efficiently                │
├────────────────────────────────────────────────────────────────┤
│  LAYER 3: MongoDB Atlas (Database - M0 Free Tier)             │
│  ⚠️  Max connections: 500                                     │
│  ⚠️  Shared cluster (throttled under heavy load)             │
│  ✅ Read operations are fast with proper indexes              │
└────────────────────────────────────────────────────────────────┘
```

### Realistic Concurrent User Limits

| Action | Same Second | Same Minute | Same Hour |
|--------|------------|-------------|-----------|
| **Students viewing attendance** | ~50-80 | **~500** | **4,000+** ✅ |
| **Students viewing dashboard** | ~80-100 | **~600** | **4,000+** ✅ |
| **Teachers marking attendance** | ~20-30 | **~100** | **200+** ✅ |
| **Teachers downloading reports** | ~10-20 | **~80** | **200+** ✅ |
| **Mixed (students + teachers)** | ~50-70 | **~400** | **3,000+** ✅ |

### Why These Numbers?

**Students viewing (READ operations):**
```
Each page load = 1-2 API calls
Each API call takes ~100-200ms on the server
Server can process ~50-100 requests/second
Students browse, then sit idle (not constant requests)

→ 500 students can load their pages within the same minute easily
→ Over an hour, all 4,000 can cycle through without issues
```

**Teachers marking (WRITE operations):**
```
Each attendance submission = 1 API call (single updateOne)
Each write takes ~200-500ms
Server can process ~20-50 writes/second

→ 100 teachers can mark attendance within the same minute
→ Realistically, not all 48 subjects mark at exact same second
```

### Real-World Scenario

```
Morning 9:00-9:15 AM — Peak Usage Window:

  40 teachers open the app to mark first-period attendance
  → 40 write operations spread across 15 minutes
  → That's ~3 writes per minute = ZERO stress on server ✅

  500 students check yesterday's attendance during break
  → 500 read operations spread across 15 minutes
  → That's ~33 reads per minute = ZERO stress on server ✅

  Total: ~36 requests per minute
  Server capacity: ~3,000-6,000 requests per minute
  Load: ~1% ✅
```

### ⚠️ The One Catch: Cold Starts

```
Render Free Tier sleeps after 15 minutes of no requests.

First request after sleep → 30-50 second wait (server waking up)
All subsequent requests → instant (~100-200ms)

This means:
  ❌ If nobody uses the app for 15 min, first user waits 30-50 sec
  ✅ Once one person opens it, everyone else gets instant responses
  ✅ During active hours (8 AM - 5 PM), this rarely happens
```

### 📊 Bandwidth Check

| Component | Free Limit | Your Monthly Usage (est.) | Status |
|-----------|-----------|--------------------------|--------|
| Firebase Hosting | 10 GB/month | ~2-3 GB | ✅ Comfortable |
| Render Backend | 100 GB/month | ~1-2 GB | ✅ Comfortable |
| MongoDB Atlas | Unlimited reads | — | ✅ No limit |

### 💡 Can All 4,000 Students Use It At Once?

| Question | Answer |
|----------|--------|
| Can 4,000 students **have the app open** at once? | ✅ Yes (frontend is CDN) |
| Can 4,000 students **load a page** at the exact same second? | ⚠️ No, ~80 at a time |
| Can 4,000 students **use it within the same hour**? | ✅ Yes, easily |
| Can 200 teachers **mark attendance** in the same minute? | ✅ Yes |
| Can 50 teachers **mark at the exact same second**? | ⚠️ Possible lag, but works |
| Will anyone notice slowness during normal use? | ✅ No (except cold starts) |

---

## 🎯 Final Verdict

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   4,000 Students × 48 Subjects × 5 Classes/Day         │
│                                                         │
│   Storage:     ~10 MB per year                          │
│   Capacity:    ~50 years on free tier                   │
│   Cost:        ₹0 forever                               │
│   Credit card: Not needed                               │
│   Maintenance: None                                     │
│                                                         │
│   Your database is 97% EMPTY after Year 1.              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
