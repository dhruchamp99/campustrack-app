# Sustainable Capacity Strategy (Deleting Past Semesters)

**Verdict: FOREVER (Indefinitely).**

If you commit to deleting (or archiving) attendance data at the end of every semester, **you will NEVER run out of space** on the free tier with 500 students.

---

## 🔄 The "Reset" Cycle

Here is the math of what happens when you delete old data:

1.  **Storage Used Per Semester (6 Months):**
    *   With 500 students @ 4 lectures/day = **~40 MB** to **50 MB** of data.
2.  **Total Available:**
    *   **512 MB**.
3.  **Result:**
    *   At the end of the semester, you have only used **~10%** of your limit.
    *   When you delete that data, the space is freed up* and reused for the next semester.

### 📅 How long will it last?
*   **Without Deleting:** ~3 to 4 Years.
*   **With Deleting Past Semesters:** **Forever**. 

As long as you clean up once every 6 months, the server storage effectively stays fresh and never grows beyond 50-60 MB.

---

### *A Note on Database "Fragmentation"
*Technically*, when you delete data in MongoDB, the file size on disk might not shrink immediately, but the database marks that space as "free to use". The next time you mark attendance, it fills that empty space instead of growing bigger. So functionally, you never hit the limit.

## 🚀 Recommended Routine
To ensure this "Forever" lifespan:
1.  **Export Data:** At the end of the semester, use your "Export Excel" feature to save all reports to your computer/hard drive.
2.  **Clear Database:** Delete the old attendance records.
3.  **Start New Sem:** You start effectively from 0 MB usage again.
