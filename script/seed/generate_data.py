import json
import random
import uuid
import os

# הגדרות מינימליות לגרסה מצומצמת
school_count = 1
classes_per_school = 2
students_per_class = 5
teachers_per_school = 2
parents_per_class = 3

subjects = ["Math", "English", "Science"]

def generate_id(prefix):
    return f"{prefix}_{uuid.uuid4().hex[:8]}"

schools = []
users = []

for s in range(school_count):
    school_id = generate_id("school")
    school_name = f"School_{s + 1}"
    schools.append({
        "schoolId": school_id,
        "schoolName": school_name
    })

    # מורים
    for t in range(teachers_per_school):
        teacher_id = generate_id("teacher")
        teacher_name = f"Teacher_{s}_{t}"
        assigned_classes = [f"Class_{chr(65 + i)}" for i in range(classes_per_school)]
        users.append({
            "name": teacher_name,
            "email": f"{teacher_name.lower()}@school.com",
            "phone": f"052{random.randint(1000000,9999999)}",
            "password": "123456",
            "role": "teacher",
            "isActivated": False,
            "schoolId": school_id,
            "schoolName": school_name,
            "uniqueId": teacher_id,
            "assignedClasses": assigned_classes,
            "subjects": [random.choice(subjects)]
        })

    # כיתות ותלמידים
    for c in range(classes_per_school):
        class_id = generate_id("class")
        class_name = f"Class_{chr(65 + c)}"
        student_ids = []

        for i in range(students_per_class):
            student_id = generate_id("student")
            student_name = f"Student_{s}_{c}_{i}"
            student_ids.append(student_id)
            users.append({
                "name": student_name,
                "email": f"{student_name.lower()}@school.com",
                "phone": f"050{random.randint(1000000,9999999)}",
                "password": "123456",
                "role": "student",
                "isActivated": False,
                "schoolId": school_id,
                "schoolName": school_name,
                "classId": class_id,
                "className": class_name,
                "uniqueId": student_id
            })

        # הורים
        for i in range(parents_per_class):
            parent_id = generate_id("parent")
            parent_name = f"Parent_{s}_{c}_{i}"
            related_students = random.sample(student_ids, k=min(2, len(student_ids)))
            users.append({
                "name": parent_name,
                "email": f"{parent_name.lower()}@school.com",
                "phone": f"053{random.randint(1000000,9999999)}",
                "password": "123456",
                "role": "parent",
                "isActivated": False,
                "schoolId": school_id,
                "schoolName": school_name,
                "classId": class_id,
                "className": class_name,
                "uniqueId": parent_id,
                "parentOf": related_students
            })

# שמירת הנתונים לקובץ JSON
output_path = "C:/Users/nilad/BrainB/script/seed/synthetic_school_data_small.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump({
        "users": users,
        "schools": schools
    }, f, ensure_ascii=False, indent=2)

print(f"Data saved to: {output_path}")

