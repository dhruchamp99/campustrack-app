# System Capacity & Scalability Analysis

This guide outlines the theoretical limits of your current CampusTrack deployment (Firebase Frontend + Render Backend + MongoDB Atlas Free Tier) and provides estimated capacity numbers.

## 1. Concurrent Users (Speed & Stability)
*How many people can use the site at the exact same moment without it slowing down or crashing?*

Your system is currently constrained primarily by the **MongoDB Atlas Free Tier** connection limit (500 connections) and **Render's Free/Starter CPU** limits.

| User Type | Concurrent Limit (Approx.) | Behavior at Limit |
| :--- | :--- | :--- |
| **Active Users** (Clicking buttons simultaneously) | **~50 - 100 users** | Requests may time out or load slowly. |
| **Online Users** (Browsing/Idle on page) | **~500+ users** | System remains stable as they are not making requests constantly. |

### ⚠️ Risk Factors
*   **Marking Attendance:** If 20 teachers try to submit attendance *at the exact same second*, the database might queue requests, causing a 2-3 second delay. It rarely crashes, but it will feel "laggy".
*   **Cold Starts:** Since you are using Render (likely free tier), if no one uses the site for 15 minutes, the server "sleeps". The first person to wake it up will wait ~30-50 seconds.

---

## 2. Total Data Capacity (Storage Limits)
*How many students/teachers and records can I store before the database is full?*

Your database (MongoDB Atlas Free Tier) has a hard limit of **512 MB**.

### Breakdown of Storage Usage
*   **1 Student Account:** ~1 KB
*   **1 Teacher Account:** ~1 KB
*   **1 Attendance Record (Per Student, Per Day):** ~0.2 KB (optimised)

### Estimated Maximums

| category | Maximum Capacity | Time until Full (Estimate) |
| :--- | :--- | :--- |
| **Total Users** | **~5,000 - 10,000 Users** | Would only use ~10MB (2% of capacity). |
| **Attendance Records** | **~2.5 Million Records** | This is your main storage consumer. |

### Practical Example
If you have **500 Students** and **20 Teachers** marking attendance daily:
*   Daily Records: 500 records
*   Monthly Storage: ~10 MB
*   **Time until 512MB Full:** **~3 to 4 Years**

---

## 3. Recommendations to Prevent Crashes

1.  **Avoid "Rush Hour" Syncing:** Do not force all 50 teachers to mark attendance at exactly 10:00 AM. Spreading usage by a few minutes drastically improves performance.
2.  **Archive Old Data:** After 1-2 years, if the app slows down, you can delete or "archive" old attendance reports (e.g., from previous semesters) to free up space.
3.  **Upgrade Path:**
    *   If you exceed **500 students**, consider upgrading MongoDB to the "Basic" tier ($9/month) which removes the connection limit and giving you 2GB+ storage.
