# BrainBridge

**A cross-platform system for personalized ADHD support in educational settings**

[![Live Demo](https://img.shields.io/badge/demo-brain--bridge.net-blue)](https://brain-bridge.net/)
[![Video](https://img.shields.io/badge/video-demo-red)](https://youtu.be/3yylb_jKSqg)

Capstone Project | Braude College of Engineering 

**Developed by:** Sandra Knizhnik & Nil Adar

**Mentor:** Dr. Natali Levi-Soskin

---

## Overview

BrainBridge is a web-based platform that integrates diagnostic assessment with evidence-based intervention strategies for students with ADHD. The system implements an 11-stage recommendation pipeline that generates personalized support plans across three domains: environmental adjustments, nutritional interventions, and physical activity.

**Key capabilities:**
- Multi-role workflows for teachers, parents, and students
- Integration with external diagnostic platform (NODUS)
- Real-time collaboration tools and progress tracking
- Bilingual interface (Hebrew/English) with full RTL support

![Landing Page](LANDING_PAGE.jpg)

---

## Architecture

The system consists of three main components:

1. **Frontend** – React + TypeScript interface with role-based access control
2. **Backend** – Node.js/Express API implementing the recommendation pipeline
3. **NODUS** – External Python/Django diagnostic engine with deep learning model

**Technology Stack:**
- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: MongoDB with Mongoose ODM
- External: Python 3.10, Django, TensorFlow

---

## Installation

### Prerequisites
- Node.js ≥ 16.x
- Python 3.10+ (for NODUS only)
- MongoDB (local or hosted)

### Setup

## 🚀 How to Run the Project

### Step 1: Clone the repository
```bash
git clone https://github.com/nil-adar/BrainB.git
cd BrainB```
```

### Step 2: Install dependencies
```bash
npm i
```

### Step 3: Configure environment
Create .env file:
```bash
PORT=5000
MONGODB_URI=your_connection_string
NODUS_BASE_URL=http://localhost:8000
```

#### Terminal 4 – Run services
Open three terminals:
Terminal 1 – Frontend
```bash
npm run dev
```

#### Terminal 2 – Backend (Node.js)
```bash
npm run server
```

#### Terminal 3 – NODUS (Django) 
Required only if you want to run the external diagnostic engine that creates an External Assessment to unlock recommendations.
```bash
cd Nodus
python -m venv .venv
source .venv/bin/activate  # Windows: .\.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

💡 Ensure ts-node is available for backend dev:
```bash
npm install -g ts-node typescript
```

Documentation
Project Book – Phase A (Literature review and research methodology) - [View](./project_book_Managing_Attention_Difficulties_phaseA.pdf)


Project Book – Phase B (Implementation and validation) - [View](./Capstone_Project-PhaseB_BrainBridge.pdf)

Project Poster - [View](./final_poster.pdf)


**Key Features Documented:**

11-stage recommendation filtering pipeline
- ADHD subtype classification algorithm
- Multi-role system workflows
- Database schema and API design
- Comprehensive testing procedures

⚖️ License
Developed as an academic capstone project at Braude College of Engineering.

Acknowledgments

👨‍🏫 **Mentor:** Dr. Natali Levi-Soskin

🎓 **Institution:** Braude College of Engineering, Software Engineering Department

🧪 **Clinical Consultation:** Liora Gaz

🤝 Special thanks to all participants who contributed to user testing and validation.


**Contact For questions or collaboration:**

Sandra Knizhnik: [Sandra.knizhnik@e.braude.ac.il]

Nil Adar: [nil.adar@e.braude.ac.il]

Repository: https://github.com/nil-adar/BrainB
