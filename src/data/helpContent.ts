// helpContent.ts

export const helpContent = {
  // Common pages
  login: {
    title_en: "Login Instructions",
    title_he: "הוראות כניסה למערכת",
    content_en: `
      <h3><strong>How to Login?</strong></h3>
      <ol>
        <li>1. Open the BrainBridge web portal</li>
        <li>2. Enter your credentials (ID Number and Password)</li>
        <li>3. Click the Login button</li>
      </ol>
      
      <p><strong>Troubleshooting:</strong></p>
      <ul>
        <li>If you forgot your password, click "Forgot your password? Click here to reset"</li>
        <li>Make sure you're using the correct ID Number registered in the school system</li>
        <li>Contact your school administrator if you continue experiencing issues</li>
      </ul>
    `,
    content_he: `
      <h3><strong>כיצד להתחבר?</strong></h3>
      <ol>
        <li>1. פתח את פורטל BrainBridge</li>
        <li>2. הזן את פרטי ההתחברות שלך (תעודת זהות וסיסמה)</li>
        <li>3. לחץ על כפתור ההתחברות</li>
      </ol>
      
      <p><strong>פתרון בעיות:</strong></p>
      <ul>
        <li>אם שכחת את הסיסמה, לחץ על "שכחת סיסמה? לחץ כאן לאיפוס"</li>
        <li>וודא שאתה משתמש במספר תעודת זהות הנכון הרשום במערכת בית הספר</li>
        <li>פנה למנהל בית הספר אם אתה ממשיך לחוות בעיות</li>
      </ul>
    `,
  },

  resetPassword: {
    title_en: "Reset Password",
    title_he: "איפוס סיסמה",
    content_en: `
      <h3><strong>How to Reset Your Password</strong></h3>
      
      <h4>Prerequisites:</h4>
      <ul>
        <li>- You already exist in the school's BrainBridge roster</li>
        <li>- You know the ID Number and Phone recorded in the school system</li>
      </ul>

      <h4><strong>Steps:</strong></h4>
      <ol>
        <li>1. Start the reset: On the login page, click "Forgot your password? Click here to reset"</li>
        <li>2. Verify your identity:</> Enter your ID Number and Phone (digits only)</li>
        <li>3. Click Continue</li>
        <li>4. Set a new password: Enter and confirm your new password (minimum 8 characters recommended)</li>
        <li>5. Click Save Password</li>
        <li>6. Log in: Return to login screen and use your new password</li>
      </ol>

      <p><strong>Troubleshooting:</strong></p>
      <ul>
        <li><strong>No match found:</strong> Your ID/Phone may differ from stored records. Contact school admin.</li>
        <li><strong>Validation errors:</strong> Follow on-screen hints (e.g., passwords must match)</li>
      </ul>
    `,
    content_he: `
      <h3><strong>כיצד לאפס את הסיסמה</strong></h3>
      
      <h4>דרישות מוקדמות:</h4>
      <ul>
        <li>- אתה כבר קיים ברשימת BrainBridge של בית הספר</li>
        <li>- אתה יודע את מספר תעודת הזהות והטלפון הרשומים במערכת בית הספר</li>
      </ul>

      <h4><strong>שלבים:</strong></h4>
      <ol>
        <li>1. התחל את האיפוס: בעמוד ההתחברות, לחץ על "שכחת סיסמה? לחץ כאן לאיפוס"</li>
        <li>2. אמת את זהותך: הזן את מספר תעודת הזהות והטלפון שלך (ספרות בלבד)</li>
        <li>3. לחץ על המשך</li>
        <li>4. הגדר סיסמה חדשה: הזן ואשר את הסיסמה החדשה (מומלץ לפחות 8 תווים)</li>
        <li>5. לחץ על שמור סיסמה</li>
        <li>6. התחבר: חזור למסך ההתחברות והשתמש בסיסמה החדשה</li>
      </ol>

      <p><strong>פתרון בעיות:</strong></p>
      <ul>
        <li><strong>לא נמצאה התאמה:</strong> פרטי תעודת הזהות/טלפון שלך עשויים להיות שונים מהרישומים. פנה למנהל בית הספר.</li>
        <li><strong>שגיאות אימות:</strong> עקוב אחר הרמזים על המסך (למשל, הסיסמאות חייבות להתאים)</li>
      </ul>
    `,
  },

  viewRecommendations: {
    title_en: "View Recommendations",
    title_he: "צפייה בהמלצות",

    content_en: `
    <h3>Personalized Recommendations</h3>
    <p>This page shows <strong>personalized recommendations</strong> for the student, based on diagnostics and questionnaires.</p>

    <br>

    <h4>How to View</h4>
    <ul>
      <li><strong>By Category:</strong> Browse recommendations grouped by <em>Nutrition</em>, <em>Physical Activity</em>, and <em>Environmental Changes</em> — view only what you need.</li>
      <li><strong>Full PDF:</strong> Scroll down to view <em>all recommendations</em> together in a single PDF.</li>
    </ul>

    <br>

    <h4>Working with the PDF</h4>
    <ul>
      <li><strong>Keyword Search:</strong> Use the PDF’s search to filter and show only recommendations that include your keywords.</li>
      <li><strong>Annotations:</strong> You can highlight, add notes, and mark items like any standard PDF.</li>
      <li><strong>Print &amp; Download:</strong> Print the document or download it for offline use.</li>
    </ul>

    <br>

    <h4>Important – Allergy Handling</h4>
    <p>If, during the <strong>parent questionnaire</strong>, a food allergy was reported for the student, then within the <strong>Nutrition</strong> category, any examples of “foods to eat” will <strong>exclude</strong> items that were classified as allergens for this student.</p>
  `,

    content_he: `
    <h3>המלצות מותאמות אישית</h3>
    <p>בעמוד זה מוצגות <strong>המלצות מותאמות אישית</strong> לתלמיד, המבוססות על האבחון והשאלונים.</p>

    <br>

    <h4>איך לצפות</h4>
    <ul>
      <li><strong>לפי קטגוריות:</strong> ניתן לצפות בהמלצות לפי <em>תזונה</em>, <em>פעילות גופנית</em> ו<em>שינויים סביבתיים</em> — בהתאם לנוחות שלכם.</li>
      <li><strong>קובץ PDF מלא:</strong> בתחתית העמוד ניתן לצפות <em>בכל ההמלצות כמקשה אחת</em> בתוך קובץ PDF.</li>
    </ul>

    <br>

    <h4>עבודה עם ה־PDF</h4>
    <ul>
      <li><strong>חיפוש מילות מפתח:</strong> ניתן לבצע חיפוש בתוך הקובץ; בסיום החיפוש יוצגו רק ההמלצות שמכילות את מילות המפתח.</li>
      <li><strong>סימונים:</strong> אפשר להדגיש, להוסיף הערות ולסמן כמו בכל קובץ PDF רגיל.</li>
      <li><strong>הדפסה והורדה:</strong> ניתן להדפיס ולהוריד את הקובץ למחשב.</li>
    </ul>

    <br>

    <h4>חשוב – טיפול באלרגיות</h4>
    <p>אם במהלך <strong>שאלון ההורה</strong> דווחה אלרגיה למזון עבור התלמיד, אז בקטגוריית <strong>תזונה</strong> דוגמאות “מאכלים שניתן לאכול” <strong>יושמטו</strong> באופן אוטומטי מכל מאכל שסווג כאלרגן עבור תלמיד זה.</p>
  `,
  },

  teacherDashboard: {
    title_en: "Teacher Dashboard Guide",
    title_he: "מדריך לוח הבקרה של המורה",
    content_en: `
<h3>Teacher Dashboard Overview</h3>

<p>After logging in, you will see your dashboard with:</p>

<ul>
  <li><strong>Daily Schedule:</strong> View your lessons for today with time, subject, topic, and classroom.</li>
  <li>You can add a personal event to the calendar by clicking the <strong>"Add Personal Event"</strong> button.</li>
  <li><strong>Class Students:</strong> Quick access to all students in the selected class.</li>
  <li><strong>Notifications:</strong> View important updates via the bell icon.</li>
</ul>

<br>

<h4><strong>Main Available Actions:</strong></h4>

<ul>
  <li>- Switch between classes to view different students assigned to each class using the "Select Class" button.</li>
  <li>- Add new students to your class.</li>
  <li>- Access student profiles to assign tasks.</li>
  <li>- Contact parents and view notifications about parent messages and system updates.</li>
</ul>

<br>

<h4><strong>Quick Tips:</strong></h4>

<ul>
  <li>- The class list updates automatically when you switch classes.</li>
  <li>- Use the top search bar to quickly find specific students.</li>
  <li>- Check notifications regularly for communication with parents.</li>
</ul>

    `,
    content_he: `
<h3>סקירת לוח הבקרה של המורה</h3>
<p>לאחר ההתחברות, תראה את לוח הבקרה שלך עם:</p>

<ul>
  <li><strong>לוח זמנים יומי:</strong> צפה בשיעורים שלך להיום עם שעה, נושא, נושא וחדר</li>
  <li>ניתן להוסיף אירוע אישי ליומן בלחיצה על כפתור <strong>"הוסף אירוע אישי"</strong></li>
  <li><strong>תלמידי כיתה:</strong> גישה מהירה לכל התלמידים בכיתה שבחרת.</li>
  <li><strong>התראות:</strong> צפה בעדכונים חשובים דרך סמל הפעמון</li>
</ul>

<br>

<h4><strong>פעולות עיקריות זמינות:</strong></h4>
<ul>
  <li>- החלף בין הכיתות על מנת לצפות בתלמידים השונים המוקצים לכיתות באמצעות כפתור "בחר כיתה"</li>
  <li>- הוסף תלמידים חדשים לכיתה שלך</li>
  <li>- גישה לפרופילי תלמידים להקצאת משימות</li>
  <li>- צור קשר עם הורים וצפה בהתראות על הודעות הורים ועדכוני מערכת</li>
</ul>

<br>

<h4><strong>טיפים מהירים:</strong></h4>
<ul>
  <li>- רשימת הכיתה מתעדכנת אוטומטית כשאתה מחליף כיתות</li>
  <li>- השתמש בסרגל החיפוש מעלה על מנת למצוא במהירות תלמידים ספציפיים</li>
  <li>- בדוק התראות באופן קבוע לתקשורת עם הורים</li>
</ul>
    `,
  },

  createTask: {
    title_en: "Create and Assign Tasks",
    title_he: "יצירה והקצאת משימות",

    content_en: `
    <h3>How to Create Tasks for Students</h3>

    <h4>Assignment Options:</h4>
    <ul>
      <li><strong>Assign to entire class:</strong> Toggle on "Assign to all students in class".</li>
      <li><strong>Assign to specific student:</strong> Select from the dropdown list.</li>
    </ul>

    <br>

    <h4>Task Details to Fill:</h4>
    <ol>
      <li><strong>Task Title:</strong> Brief description of the assignment.</li>
      <li><strong>Notes:</strong> Detailed instructions or expectations.</li>
      <li><strong>Task Date:</strong> Choose the date when the task should appear.  
          This allows you to schedule tasks across a week in advance.</li>
      <li><strong>Color:</strong> Each color defines the nature of the task, with a guide:  
        <ul>
          <li>Blue – Independent Learning</li>
          <li>Red – Urgent / Very Important</li>
          <li>Orange – Difficult / Challenging</li>
          <li>Yellow – Regular / Moderate</li>
          <li>Green – Easy / Fun</li>
          <li>Purple – Creative / Self Expression</li>
        </ul>
      </li>
      <li><strong>Time (minutes):</strong> Expected duration.  
          For students with extra time accommodations, the system will automatically adjust the allocated time.</li>
      <li><strong>Stars:</strong> Defines the task difficulty and weight.  
          In the student dashboard, the Progress Bar fills according to completed tasks.  
          The number of stars determines how much each task contributes to the bar.</li>
    </ol>

    <br>

    <h4>After Creation:</h4>
    <p>The task will appear in the student’s dashboard on the selected date, and they can start working on it then.</p>
  `,

    content_he: `
    <h3>כיצד ליצור משימות לתלמידים</h3>

    <h4>אפשרויות הקצאה:</h4>
    <ul>
      <li><strong>הקצה לכיתה שלמה:</strong> הפעל את "הקצה לכל התלמידים בכיתה".</li>
      <li><strong>הקצה לתלמיד ספציפי:</strong> בחר מרשימת התלמידים.</li>
    </ul>

    <br>

    <h4>פרטי משימה למילוי:</h4>
    <ol>
      <li><strong>כותרת משימה:</strong> תיאור קצר של המטלה.</li>
      <li><strong>הערות:</strong> הוראות מפורטות או ציפיות.</li>
      <li><strong>תאריך משימה:</strong> בחר את התאריך שבו המשימה תופיע.  
          כך ניתן להגדיר משימות לשבוע קדימה.</li>
      <li><strong>צבע:</strong> לכל צבע יש משמעות המגדירה את אופי המשימה, לפי מדריך:  
        <ul>
          <li>כחול – למידה עצמאית</li>
          <li>אדום – דחוף / חשוב מאוד</li>
          <li>כתום – קשה / מאתגר</li>
          <li>צהוב – רגיל / בינוני</li>
          <li>ירוק – קל / כיף</li>
          <li>סגול – יצירתי / ביטוי עצמי</li>
        </ul>
      </li>
      <li><strong>זמן (דקות):</strong> משך משוער.  
          לתלמידים שהוגדרה להם הארכת זמן מראש – המערכת תעדכן את משך הזמן בהתאם.</li>
      <li><strong>כוכבים:</strong> בחירת רמת הקושי והמשקל של המשימה.  
          במסך התלמיד מופיע Progress Bar – השלמת משימות ממלאת את הבר הזה.  
          כמות הכוכבים קובעת את המשקל היחסי של כל משימה במילוי הבר.</li>
    </ol>

    <br>

    <h4>לאחר היצירה:</h4>
    <p>המשימה תופיע בלוח הבקרה של התלמיד בתאריך שנבחר, ומשם יוכל להתחיל בביצוע.</p>
  `,
  },

  teacherQuestionnaire: {
    title_en: "Fill Teacher Questionnaire",
    title_he: "מילוי שאלון מורה",
    content_en: `
      <h3>Teacher Questionnaire Guide</h3>

      <h4>Purpose:</h4>
      <p>This questionnaire helps generate personalized recommendations by gathering your observations about the student's classroom behavior and performance.</p>

      <h4>How to Fill:</h4>
      <ol>
        <li>Navigate to the student's profile</li>
        <li>Click "Fill student questionnaire"</li>
        <li>Answer all questions based on your classroom observations</li>
        <li>Questions cover topics like:
          <ul>
            <li>Seating arrangement effectiveness</li>
            <li>Task completion frequency</li>
            <li>Focus and attention patterns</li>
            <li>Behavioral observations</li>
          </ul>
        </li>
        <li>Click "Next" to move between pages</li>
        <li>Review and submit when complete</li>
      </ol>

      <h4>Important Notes:</h4>
      <ul>
        <li>Your responses are stored securely and confidentially</li>
        <li>The questionnaire must be completed for recommendations to be generated</li>
        <li>You can see completion progress at the top of each page</li>
      </ul>
    `,
    content_he: `
      <h3>מדריך שאלון מורה</h3>

      <h4>מטרה:</h4>
      <p>שאלון זה עוזר ליצור המלצות מותאמות אישית על ידי איסוף תצפיות שלך על התנהגות וביצועים של התלמיד בכיתה.</p>

      <h4>כיצד למלא:</h4>
      <ol>
        <li>נווט לפרופיל של התלמיד</li>
        <li>לחץ על "מלא שאלון תלמיד"</li>
        <li>ענה על כל השאלות בהתבסס על התצפיות שלך בכיתה</li>
        <li>השאלות מכסות נושאים כמו:
          <ul>
            <li>יעילות סידור הישיבה</li>
            <li>תדירות השלמת משימות</li>
            <li>דפוסי ריכוז וקשב</li>
            <li>תצפיות התנהגותיות</li>
          </ul>
        </li>
        <li>לחץ על "הבא" כדי לעבור בין עמודים</li>
        <li>סקור ושלח כשמסיים</li>
      </ol>

      <h4>הערות חשובות:</h4>
      <ul>
        <li>התשובות שלך נשמרות בצורה מאובטחת וחסויה</li>
        <li>יש להשלים את השאלון כדי שניתן יהיה ליצור המלצות</li>
        <li>אתה יכול לראות את התקדמות ההשלמה בראש כל עמוד</li>
      </ul>
    `,
  },

  createAssessment: {
    title_en: "Create Diagnostic Assessment",
    title_he: "יצירת אבחון דיאגנוסטי",

    content_en: `
    <h3>Initiating Diagnostic Assessment</h3>
    <p><strong>NODUS is an external system</strong> that performs the formal ADHD diagnostic.  
    In order to receive <strong>personalized recommendations</strong>, the student must complete the NODUS assessment, and in parallel the <strong>teacher, parent, and student</strong> must each fill an adapted questionnaire.</p>

    <br>

    <h4>How to Initiate</h4>
    <ol>
      <li>From the student’s profile, click <strong>"Create new assessment"</strong>.</li>
      <li>The student’s name is filled automatically.</li>
      <li><strong>Verify the date</strong> (the diagnostic will be available for <strong>24 hours</strong> from the moment it is opened).</li>
      <li>Click <strong>"Start Assessment"</strong> to open the diagnostic window for the student.</li>
      <li>For convenience, you can also open the <strong>Teacher Questionnaire</strong> from this page if you haven’t completed it yet.</li>
    </ol>

    <br>

    <h4>What Happens Next</h4>
    <ul>
      <li>A <strong>"Start Diagnostic"</strong> button appears on the student’s dashboard.</li>
      <li>The student clicks the button and is redirected to the <strong>NODUS</strong> system.</li>
      <li>After completion, results are sent back to <strong>BrainBridge</strong>.</li>
      <li>Once all questionnaires (teacher, parent, student) are submitted and the diagnostic is complete, the system generates <strong>personalized recommendations</strong>.</li>
    </ul>

    <br>

    <h4>Important</h4>
    <p>The diagnostic runs <strong>outside</strong> BrainBridge. Make sure the student has access and completes it within the scheduled <strong>24-hour window</strong>.  
    If the timer expires, you will need to initiate the assessment again.</p>
  `,

    content_he: `
    <h3>יזום אבחון דיאגנוסטי</h3>
    <p><strong>NODUS היא מערכת חיצונית</strong> האחראית על האבחון הרשמי של ADHD.  
    כדי לקבל <strong>המלצות מותאמות אישית</strong>, התלמיד חייב להשלים את אבחון NODUS, ובמקביל <strong>המורה, ההורה והתלמיד</strong> צריכים למלא שאלונים מותאמים בנוגע לתלמיד.</p>

    <br>

    <h4>כיצד ליזום</h4>
    <ol>
      <li>מפרופיל התלמיד לחץ על <strong>"צור אבחון חדש"</strong>.</li>
      <li>שם התלמיד נשלף אוטומטית.</li>
      <li><strong>וודא/י את התאריך</strong> (האבחון יהיה זמין למשך <strong>24 שעות</strong> מרגע הפתיחה).</li>
      <li>לחץ/י על <strong>"צור אבחון"</strong> כדי לפתוח את חלון האבחון עבור התלמיד.</li>
      <li>לנוחיותך, בעמוד זה יש גם כפתור לפתיחת <strong>שאלון המורה</strong> אם עדיין לא מלאת עבור תלמיד זה.</li>
    </ol>

    <br>

    <h4>מה קורה אחר כך</h4>
    <ul>
      <li>בלוח הבקרה של התלמיד יופיע כפתור <strong>"התחל אבחון"</strong>.</li>
      <li>התלמיד לוחץ על הכפתור ומועבר למערכת <strong>NODUS</strong>.</li>
      <li>לאחר ההשלמה, התוצאות נשלחות חזרה ל־<strong>BrainBridge</strong>.</li>
      <li>כאשר כל השאלונים (מורה, הורה, תלמיד) הוגשו והאבחון הושלם, המערכת תייצר <strong>המלצות מותאמות אישית</strong>.</li>
    </ul>

    <br>

    <h4>חשוב</h4>
    <p>האבחון מתבצע <strong>מחוץ</strong> ל־BrainBridge. יש לוודא שלתלמיד יש גישה ולסיים בתוך חלון ה־<strong>24 שעות</strong>.  
    אם הזמן פג, יהיה צורך ליזום מחדש את האבחון.</p>
  `,
  },

  chatWithParent: {
    title_en: "Chat with Parents",
    title_he: "צ'אט עם הורים",
    content_en: `
      <h3>Communicating with Parents</h3>

      <h4>How to Start a Conversation:</h4>
      <ol>
        <li>From the student's profile, click "Contact parent"</li>
        <li>A chat window opens showing message history</li>
        <li>Type your message in the text box</li>
        <li>You can add emojis or attachments if needed</li>
        <li>Click "Send Message"</li>
      </ol>

      <h4>Viewing Messages:</h4>
      <ul>
        <li>Check the notification bell icon for new messages</li>
        <li>Click on a notification to view the conversation</li>
        <li>All messages are timestamped for reference</li>
      </ul>

      <h4>Best Practices:</h4>
      <ul>
        <li>Share specific progress updates regularly</li>
        <li>Highlight both achievements and areas for improvement</li>
        <li>Use the chat to coordinate on recommendation implementation</li>
        <li>Respond to parent questions promptly</li>
        <li>Keep communication professional and constructive</li>
      </ul>
    `,
    content_he: `
      <h3>תקשורת עם הורים</h3>

      <h4>כיצד להתחיל שיחה:</h4>
      <ol>
        <li>מפרופיל התלמיד, לחץ על "צור קשר עם הורה"</li>
        <li>חלון צ'אט נפתח המציג היסטוריית הודעות</li>
        <li>הקלד את ההודעה שלך בתיבת הטקסט</li>
        <li>אתה יכול להוסיף אימוג'ים או קבצים מצורפים במידת הצורך</li>
        <li>לחץ על "שלח הודעה"</li>
      </ol>

      <h4>צפייה בהודעות:</h4>
      <ul>
        <li>בדוק את סמל פעמון ההתראות להודעות חדשות</li>
        <li>לחץ על התראה כדי לצפות בשיחה</li>
        <li>כל ההודעות מתויגות בזמן לעיון</li>
      </ul>

      <h4>שיטות עבודה מומלצות:</h4>
      <ul>
        <li>שתף עדכוני התקדמות ספציפיים באופן קבוע</li>
        <li>הדגש גם הישגים וגם תחומים לשיפור</li>
        <li>השתמש בצ'אט כדי לתאם את יישום ההמלצות</li>
        <li>השב לשאלות הורים במהירות</li>
        <li>שמור על תקשורת מקצועית ובונה</li>
      </ul>
    `,
  },

  parentDashboard: {
    title_en: "Parent Dashboard Guide",
    title_he: "מדריך לוח בקרה להורים",
    content_en: `
    <h3>Parent Dashboard — Quick Guide</h3>

    <p><strong>Children at this school:</strong> Browse all your children currently associated with this school.</p>
    <br>

    <p><strong>For each child you’ll see these actions (exactly as on screen):</strong></p>
    <ul>
      <li><strong>"Contact Teacher"</strong> — send a message to the teacher about this child.</li>
      <li><strong>"Fill questionnaire for <em>{child name}</em>"</strong> — complete the parent form if it’s still pending.</li>
      <li><strong>"View recommendations for <em>{child name}</em>"</strong> — open the personalized recommendations (once available).</li>
    </ul>
    <br>

    <p><strong>Important:</strong> Recommendations are unlocked only after the required forms are completed (student, parent, teacher, and NODUS diagnosis when applicable).</p>
    <br>

    <p><strong>School Calendar:</strong> View school events. <em>Currently read-only;</em> additional actions will be added later.</p>
    <br>
  `,
    content_he: `
    <h3>מדריך מהיר ללוח ההורה</h3>

    <p><strong>ילדים בבית הספר:</strong> ניתן לעבור בין כל הילדים המשויכים לבית הספר הנוכחי.</p>
    <br>

    <p><strong>לכל ילד יופיעו הפעולות הבאות (בדיוק כפי שמופיע במסך):</strong></p>
    <ul>
      <li><strong>"צור קשר עם המורה"</strong> — שליחת הודעה למורה בנוגע לתלמיד זה.</li>
      <li><strong>"מילוי שאלן עבור <em>{שם התלמיד}</em>"</strong> — מילוי שאלון ההורה אם עדיין לא מולא.</li>
      <li><strong>"צפייה בהמלצות של  <em>{שם התלמיד}</em>"</strong> — צפייה בהמלצות מותאמות אישית (כשזמין).</li>
    </ul>
    <br>

    <p><strong>חשוב:</strong> ההמלצות נפתחות רק לאחר השלמת כל השאלונים הנדרשים (תלמיד, הורה, מורה, ואבחון NODUS אם נדרש).</p>
    <br>

    <p><strong>לוח שנה:</strong> תצוגת אירועי בית הספר. <em>כרגע לצפייה בלבד;</em> בהמשך יתווספו פעולות.</p>
    <br>
  `,
  },

  parentQuestionnaire: {
    title_en: "Parent Questionnaire",
    title_he: "שאלון הורים",
    content_en: `
      <h3>Completing the Parent Questionnaire</h3>

      <h4>Purpose:</h4>
      <p>Your observations at home are crucial for generating accurate, personalized recommendations for your child.</p>

      <h4>How to Complete:</h4>
      <ol>
        <li>From your dashboard, find your child's profile</li>
        <li>Click "Fill questionnaire for [child's name]"</li>
        <li>Answer all questions honestly based on your home observations</li>
        <li>Questions cover:
          <ul>
            <li>Home environment and routines</li>
            <li>Homework completion patterns</li>
            <li>Sleep and nutrition habits</li>
            <li>Behavioral observations at home</li>
            <li>Social interactions</li>
          </ul>
        </li>
        <li>Use "Previous" and "Next" to navigate between pages</li>
        <li>Submit when complete</li>
      </ol>

      <h4>Important to Know:</h4>
      <ul>
        <li>All responses are confidential and secure</li>
        <li>There are no "right" or "wrong" answers - be honest</li>
        <li>The questionnaire must be completed for recommendations to be generated</li>
        <li>You can see your progress at the top of each page</li>
      </ul>
    `,
    content_he: `
      <h3>השלמת שאלון הורים</h3>

      <h4>מטרה:</h4>
      <p>התצפיות שלך בבית חיוניות ליצירת המלצות מדויקות ומותאמות אישית עבור ילדך.</p>

      <h4>כיצד להשלים:</h4>
      <ol>
        <li>מלוח הבקרה שלך, מצא את פרופיל ילדך</li>
        <li>לחץ על "מלא שאלון עבור [שם הילד]"</li>
        <li>ענה על כל השאלות בכנות על סמך התצפיות שלך בבית</li>
        <li>השאלות מכסות:
          <ul>
            <li>סביבה ושגרה ביתית</li>
            <li>דפוסי השלמת שיעורי בית</li>
            <li>הרגלי שינה ותזונה</li>
            <li>תצפיות התנהגותיות בבית</li>
            <li>אינטראקציות חברתיות</li>
          </ul>
        </li>
        <li>השתמש ב"הקודם" ו"הבא" כדי לנווט בין עמודים</li>
        <li>שלח כשמסיים</li>
      </ol>

      <h4>חשוב לדעת:</h4>
      <ul>
        <li>כל התשובות הן חסויות ומאובטחות</li>
        <li>אין תשובות "נכונות" או "שגויות" - היה כן</li>
        <li>יש להשלים את השאלון כדי שניתן יהיה ליצור המלצות</li>
        <li>אתה יכול לראות את ההתקדמות שלך בראש כל עמוד</li>
      </ul>
    `,
  },

  studentDashboard: {
    title_en: "Student Dashboard Guide",
    title_he: "מדריך לוח בקרה לתלמידים",
    content_en: `
    <p><strong>Language:</strong> Use the Hebrew/English button at the top to switch the UI.</p>
    <br>

    <p><strong>Today:</strong> The header shows today’s date and time.</p>
    <br>

    <p><strong>Tasks:</strong> Under "Tasks" you’ll see what your teacher assigned for today. Click a task to start an hourglass timer with the time your teacher set. If you have extra-time accommodations, the timer already includes them.</p>
    <br>

    <p><strong>Complete a task:</strong> Upload a photo or file of your work. Click the small image icon in the task row and choose the file.</p>
    <br>

    <p><strong>Progress:</strong> Your progress bar under the timer fills as you complete tasks. Finish them all to see fireworks 🎉.</p>
    <br>

    <p><strong>Recommendations:</strong> Click "View Recommendations" to see your personalized tips.</p>
    <br>

    <p><strong>Assessment:</strong> "Start New Assessment" works only if your teacher enabled the NODUS diagnosis.</p>
    <br>

    <p><strong>Student Questionnaire:</strong> If you haven’t filled it yet, do it to get the best-fit recommendations.</p>
    <br>

    <p><strong>Questions?</strong> Click "Help & Support" to message your teacher.</p>
    <br>
  `,
    content_he: `
    <p><strong>שפה:</strong> למעלה יש כפתור עברית/English להחלפת שפה.</p>
    <br>

    <p><strong>היום:</strong> בחלק העליון תראה את התאריך והשעה של היום.</p>
    <br>

    <p><strong>משימות:</strong> תחת "משימות" תראה את מה שהמורה הגדיר לביצוע היום. לחיצה על משימה תפתח שעון חול עם הזמן שהמורה קבע. אם יש לך הארכת זמן — זה מחושב אוטומטית.</p>
    <br>

    <p><strong>השלמת משימה:</strong> צלם/העלה תמונה או קובץ של העבודה. לחץ על סמל התמונה הקטן בשורת המשימה ובחר קובץ.</p>
    <br>

    <p><strong>התקדמות:</strong> מתחת לשעון תראה את סרגל ההתקדמות. כשהכול הושלם — זיקוקים 🎉.</p>
    <br>

    <p><strong>המלצות:</strong> לחץ על "צפה בהמלצות" כדי לראות המלצות מותאמות לך.</p>
    <br>

    <p><strong>אבחון:</strong> "בצע אבחון חדש" יעבוד רק אם המורה אפשר אבחון NODUS.</p>
    <br>

    <p><strong>שאלון תלמיד:</strong> אם עוד לא מילאת — מומלץ למלא כדי לקבל את ההמלצות הכי מתאימות.</p>
    <br>

    <p><strong>שאלה למורה?</strong> לחץ "עזרה ותמיכה".</p>
    <br>
  `,
  },

  register: {
    title_en: "Registration Guide",
    title_he: "מדריך הרשמה",
    content_en: `<h3>How to Register</h3><p>Fill in all required fields and submit.</p>`,
    content_he: `<h3>כיצד להירשם</h3><p>מלא את כל השדות הנדרשים ושלח.</p>`,
  },

  completeTasks: {
    title_en: "Complete Daily Tasks",
    title_he: "השלמת משימות יומיות",
    content_en: `
      <h3>How to Complete Your Tasks</h3>

      <h4>Step-by-Step Guide:</h4>
      <ol>
        <li><strong>Select a task</strong> from your Tasks list</li>
        <li><strong>Start the timer</strong> (optional):
          <ul>
            <li>Click the hourglass icon</li>
            <li>The timer is set to the expected task duration</li>
            <li>Work on your task while the timer counts down</li>
          </ul>
        </li>
        <li><strong>Complete your work</strong> on paper or computer</li>
        <li><strong>Take a photo</strong> of your completed work</li>
        <li><strong>Upload the photo</strong>:
          <ul>
            <li>Click the camera icon</li>
            <li>Select or take a photo of your work</li>
            <li>Wait for "task image uploaded successfully" message</li>
          </ul>
        </li>
        <li><strong>Mark as complete</strong>:
          <ul>
            <li>Click the checkmark button</li>
            <li>The task will turn green</li>
            <li>Your progress bar will update</li>
          </ul>
        </li>
      </ol>

      <h4>Important Rules:</h4>
      <ul>
        <li>You MUST upload a photo before marking a task complete</li>
        <li>Only after the photo is confirmed will the task be considered done</li>
        <li>Complete all daily tasks to reach 100% progress!</li>
      </ul>

      <h4>Understanding Task Colors:</h4>
      <ul>
        <li><strong>Blue:</strong> Independent Learning</li>
        <li><strong>Red:</strong> Urgent / Very Important</li>
        <li><strong>Orange:</strong> Difficult / Challenging</li>
        <li><strong>Yellow:</strong> Regular / Moderate</li>
        <li><strong>Green:</strong> Easy / Fun</li>
        <li><strong>Purple:</strong> Creative / Self Expression</li>
      </ul>
    `,
    content_he: `
      <h3>כיצד להשלים את המשימות שלך</h3>

      <h4>מדריך צעד אחר צעד:</h4>
      <ol>
        <li><strong>בחר משימה</strong> מרשימת המשימות שלך</li>
        <li><strong>התחל את הטיימר</strong> (אופציונלי):
          <ul>
            <li>לחץ על סמל שעון החול</li>
            <li>הטיימר מוגדר למשך המשימה הצפוי</li>
            <li>עבוד על המשימה שלך בזמן שהטיימר סופר לאחור</li>
          </ul>
        </li>
        <li><strong>השלם את העבודה שלך</strong> על נייר או מחשב</li>
        <li><strong>צלם תמונה</strong> של העבודה המושלמת שלך</li>
        <li><strong>העלה את התמונה</strong>:
          <ul>
            <li>לחץ על סמל המצלמה</li>
            <li>בחר או צלם תמונה של העבודה שלך</li>
            <li>המתן להודעה "תמונת משימה הועלתה בהצלחה"</li>
          </ul>
        </li>
        <li><strong>סמן כהושלם</strong>:
          <ul>
            <li>לחץ על כפתור סימן הווי</li>
            <li>המשימה תהפוך לירוקה</li>
            <li>סרגל ההתקדמות שלך יתעדכן</li>
          </ul>
        </li>
      </ol>

      <h4>כללים חשובים:</h4>
      <ul>
        <li>אתה חייב להעלות תמונה לפני סימון משימה כהושלמה</li>
        <li>רק לאחר אישור התמונה המשימה תיחשב כמושלמת</li>
        <li>השלם את כל המשימות היומיות כדי להגיע ל-100% התקדמות!</li>
      </ul>

      <h4>הבנת צבעי משימות:</h4>
      <ul>
        <li><strong>כחול:</strong> למידה עצמאית</li>
        <li><strong>אדום:</strong> דחוף / חשוב מאוד</li>
        <li><strong>כתום:</strong> קשה / מאתגר</li>
        <li><strong>צהוב:</strong> רגיל / בינוני</li>
        <li><strong>ירוק:</strong> קל / כיף</li>
        <li><strong>סגול:</strong> יצירתי / ביטוי עצמי</li>
      </ul>
    `,
  },
  studentQuestionnaire: {
    title_en: "Student Questionnaire",
    title_he: "שאלון תלמיד",
    content_en: `
      <h3>Filling Out Your Questionnaire</h3>

      <h4>Why Fill This Out?</h4>
      <p>Your answers help create recommendations that work best for YOU. You know yourself better than anyone!</p>

      <h4>How to Complete:</h4>
      <ol>
        <li>Click "Form for Student" from your dashboard</li>
        <li>Read each question carefully</li>
        <li>Choose the answer that feels most true for you</li>
        <li>Questions are about:
          <ul>
            <li>How you like to learn</li>
            <li>What helps you focus</li>
            <li>Your favorite activities</li>
            <li>How you feel at school</li>
          </ul>
        </li>
        <li>Use "Next" to move forward</li>
        <li>Submit when you're done</li>
      </ol>

      <h4>Remember:</h4>
      <ul>
        <li>There are no wrong answers - just be honest!</li>
        <li>Your answers are private</li>
        <li>Take your time and think about each question</li>
        <li>Ask for help if you don't understand something</li>
      </ul>
    `,
    content_he: `
      <h3>מילוי השאלון שלך</h3>

      <h4>למה למלא את זה?</h4>
      <p>התשובות שלך עוזרות ליצור המלצות שעובדות הכי טוב בשבילך. אתה מכיר את עצמך יותר טוב מכולם!</p>

      <h4>כיצד להשלים:</h4>
      <ol>
        <li>לחץ על "טופס לתלמיד" מלוח הבקרה שלך</li>
        <li>קרא כל שאלה בזהירות</li>
        <li>בחר את התשובה שמרגישה הכי נכונה עבורך</li>
        <li>השאלות הן על:
          <ul>
            <li>איך אתה אוהב ללמוד</li>
            <li>מה עוזר לך להתרכז</li>
            <li>הפעילויות האהובות עליך</li>
            <li>איך אתה מרגיש בבית הספר</li>
          </ul>
        </li>
        <li>השתמש ב"הבא" כדי להתקדם</li>
        <li>שלח כשסיימת</li>
      </ol>

      <h4>זכור:</h4>
      <ul>
        <li>אין תשובות שגויות - פשוט תהיה כן!</li>
        <li>התשובות שלך פרטיות</li>
        <li>קח את הזמן שלך וחשוב על כל שאלה</li>
        <li>בקש עזרה אם אתה לא מבין משהו</li>
      </ul>
    `,
  },

  profileSettings: {
    title_en: "Profile & Settings",
    title_he: "פרופיל והגדרות",
    content_en: `
      <h3>Managing Your Profile</h3>

      <h4>Profile Settings:</h4>
      <ul>
        <li><strong>Profile Photo:</strong> Click "Change Photo" to upload a new picture</li>
        <li><strong>Full Name:</strong> View or update your name</li>
        <li><strong>Email:</strong> Your contact email address</li>
      </ul>

      <h4>System Preferences:</h4>
      <ul>
        <li><strong>Notifications:</strong> Toggle on/off to control system notifications</li>
        <li><strong>Language:</strong> Switch between Hebrew and English
          <ul>
            <li>Can also be changed from the top navigation bar</li>
            <li>Changes apply immediately across the entire system</li>
          </ul>
        </li>
      </ul>

      <h4>Saving Changes:</h4>
      <ol>
        <li>Make your desired changes</li>
        <li>Click "Save Changes" button at the bottom</li>
        <li>Your preferences are stored securely</li>
        <li>Changes take effect immediately</li>
      </ol>

      <h4>Note:</h4>
      <p>This page looks identical for teachers, parents, and students. Everyone can manage their profile and preferences the same way.</p>
    `,
    content_he: `
      <h3>ניהול הפרופיל שלך</h3>

      <h4>הגדרות פרופיל:</h4>
      <ul>
        <li><strong>תמונת פרופיל:</strong> לחץ על "שנה תמונה" כדי להעלות תמונה חדשה</li>
        <li><strong>שם מלא:</strong> צפה או עדכן את שמך</li>
        <li><strong>אימייל:</strong> כתובת הדוא"ל שלך</li>
      </ul>

      <h4>העדפות מערכת:</h4>
      <ul>
        <li><strong>התראות:</strong> הפעל/כבה כדי לשלוט בהתראות המערכת</li>
        <li><strong>שפה:</strong> החלף בין עברית לאנגלית
          <ul>
            <li>ניתן לשנות גם מסרגל הניווט העליון</li>
            <li>השינויים חלים מיד על כל המערכת</li>
          </ul>
        </li>
      </ul>

      <h4>שמירת שינויים:</h4>
      <ol>
        <li>בצע את השינויים הרצויים</li>
        <li>לחץ על כפתור "שמור שינויים" בתחתית</li>
        <li>ההעדפות שלך נשמרות בצורה מאובטחת</li>
        <li>השינויים נכנסים לתוקף מיד</li>
      </ol>

      <h4>הערה:</h4>
      <p>עמוד זה נראה זהה למורים, הורים ותלמידים. כולם יכולים לנהל את הפרופיל וההעדפות שלהם באותה דרך.</p>
    `,
  },
};

// Type for language selection
export type Language = "en" | "he";

// Type for page keys
export type HelpPage = keyof typeof helpContent;

// Helper function to get content
export const getHelpContent = (page: HelpPage, language: Language) => {
  const pageContent = helpContent[page];
  return {
    title: pageContent[`title_${language}`],
    content: pageContent[`content_${language}`],
  };
};
