# BrainBridge
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D16-green.svg)](https://nodejs.org)
[![Python](https://img.shields.io/badge/python-3.10%2B-blue.svg)](https://python.org)
[![SUS Score](https://img.shields.io/badge/SUS%20Score-83.75%2F100-brightgreen.svg)](docs/usability-study.pdf)
[![Live Demo](https://img.shields.io/badge/demo-brain--bridge.net-blue)](https://brain-bridge.net/)
[![Video](https://img.shields.io/badge/video-demo-red)](https://youtu.be/3yylb_jKSqg)

*A cross-platform system for personalized ADHD support in educational settings*

Capstone Project | Braude College of Engineering 

**Developed by:** Sandra Knizhnik & Nil Adar

**Mentor:** Dr. Natali Levi-Soskin

---

## Overview

BrainBridge is a web-based platform that integrates diagnostic assessment with evidence-based intervention strategies for students with ADHD. The system implements an 11-stage recommendation pipeline that generates personalized support plans across three domains: environmental adjustments, nutritional interventions, and physical activity.

## 🎯 Who Is This For?

BrainBridge is designed for:
- **Educators** managing students with attention challenges
- **Parents** seeking evidence-based support strategies
- **Researchers** exploring personalized ADHD interventions
- **Schools** implementing data-driven student support systems

  
**Key capabilities:**
- Multi-role workflows for teachers, parents, and students
- Integration with external diagnostic platform (NODUS)
- Real-time collaboration tools and progress tracking
- Bilingual interface (Hebrew/English) with full RTL support

## 🚀 Quick Start (Try it Live)
Visit [https://brain-bridge.net](https://brain-bridge.net) and use these test accounts:
- **Teacher**: `312167216` / `123456`
- **Student**: `312121054` / `123456`
- **Parent**: `067487850` / `123456`

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

MONGODB_URI=connection_string

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

## **Documentation**
[Project Book – Phase A (Literature review and research methodology)](./project_book_Managing_Attention_Difficulties_phaseA.pdf)

[Project Book – Phase B (Implementation and validation)](./Capstone_Project-PhaseB_BrainBridge.pdf)

[Project Poster](./final_poster.pdf)




## 🧠 Core Innovation: 11-Stage Recommendation Engine

Our pipeline combines diagnostic data with contextual factors:

1. **Stages 1-6**: ADHD subtype classification (using NODUS output)
2. **Stage 7**: Environmental screening (trauma/situational factors)
3. **Stages 8-11**: Tag-based filtering + allergy exclusions + parent input

📊 **Result**: Personalized recommendations across:
- 🏫 Environmental adjustments (24 strategies)
- 🥗 Nutritional interventions (18 recommendations)
- 🏃 Physical activity plans (22 exercises)



## ⚖️ License
Developed as an academic capstone project at Braude College of Engineering.

## Acknowledgments

👨‍🏫 **Mentor:** Dr. Natali Levi-Soskin

🎓 **Institution:** Braude College of Engineering, Software Engineering Department

🧪 **Clinical Consultation:** Liora Gaz

🤝 Special thanks to all participants who contributed to user testing and validation.


## **Contact For questions or collaboration:**

Sandra Knizhnik: [Sandra.knizhnik@e.braude.ac.il]

Nil Adar: [nil.adar@e.braude.ac.il]

Repository: https://github.com/nil-adar/BrainB
