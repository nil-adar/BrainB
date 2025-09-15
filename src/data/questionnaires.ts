//all questions for the questionnaires of student, parent, teacher
import { Questionnaire } from "src/types/questionnaire";

export const questionnaires: Questionnaire[] = [
  {
    id: "questionnaire-1",
    title: {
      he: "שאלון הילד - ריכוז והתנהגות",
      en: "Child Questionnaire - Concentration and Behavior",
    },
    questions: [
      {
        id: "q1-1",
        tag: "seating strategy",
        type: "single",
        text: {
          he: "האם אתה מרגיש שקל לך להתרכז במקום שאתה יושב/ת בו בכיתה?",
          en: "Do you feel your classroom seat helps you focus?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "זה עוזר מאוד",
              en: "It helps a lot",
            },
          },
          {
            id: "opt2",
            text: {
              he: "זה עוזר קצת",
              en: "It helps a little",
            },
          },
          {
            id: "opt3",
            text: {
              he: "מוסח מעט",
              en: "I get a little distracted",
            },
          },
          {
            id: "opt4",
            text: {
              he: "לא, אני מוסח/ת מאוד",
              en: "No, I get very distracted",
            },
          },
        ],
      },
      {
        id: "q1-2",
        tag: "noise_movement_distraction",
        type: "single",
        text: {
          he: "האם רעשים או תנועה בכיתה מפריעים לך להתרכז?",
          en: "Do noises or movement around you make it harder to focus?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "תמיד",
              en: "Always",
            },
          },
        ],
      },
      {
        id: "q1-3",
        tag: "desk_bag_organization",
        type: "single",
        text: {
          he: "האם קשה לך לשמור על הסדר בשולחן או בתיק?",
          en: "Do you find it difficult to keep your desk or bag organized?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "תמיד",
              en: "Always",
            },
          },
        ],
      },
      {
        id: "q1-4",
        tag: "restlessness, seating strategy",
        type: "single",
        text: {
          he: "האם קשה לך להישאר לשבת זמן ממושך בשיעור?",
          en: "Is it difficult for you to stay seated for a long time during class?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "תמיד",
              en: "Always",
            },
          },
        ],
      },
      {
        id: "q1-5",
        tag: "low_energy",
        type: "single",
        text: {
          he: "האם את/ה מרגיש/ה שלפעמים קשה לך להתרכז לאורך זמן, אפילו כשאת/ה מנסה?",
          en: "Do you sometimes find it hard to pay attention, even when you really try?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "אף פעם לא",
              en: "Never",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "תמיד",
              en: "Always",
            },
          },
        ],
      },
      {
        id: "q1-6",
        tag: "emotional_irritability_mgD",
        type: "single",
        text: {
          he: "האם את/ה מרגיש/ה לפעמים שאת/ה כועס/ת בקלות או מתעצבן/ת מהר?",
          en: "Do you get upset or angry easily?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "בכלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Most of the time",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "All the time",
            },
          },
        ],
      },
      {
        id: "q1-7",
        tag: "vegetables_intake",
        type: "single",
        text: {
          he: "האם את/ה אוכל/ת ירקות במהלך היום?",
          en: "Do you eat vegetables during the day?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כל יום",
              en: "Every day",
            },
          },
          {
            id: "opt2",
            text: {
              he: "כמעט כל יום",
              en: "Almost every day",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt4",
            text: {
              he: "אף פעם",
              en: "Never",
            },
          },
        ],
      },
      {
        id: "q1-8",
        tag: "child_daytime_fatigue",
        type: "single",
        text: {
          he: "האם את/ה מרגיש/ה עייף/ה במהלך היום?",
          en: "Do you feel tired during the day, even after sleeping?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "בכלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לרוב",
              en: "Most of the time",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כל הזמן",
              en: "All the time",
            },
          },
        ],
      },
      {
        id: "q1-9",
        tag: "child_memory_support_needed",
        type: "single",
        text: {
          he: "כמה פעמים ביום את/ה שוכח/ת מה רצית לעשות?",
          en: "How often do you forget what you were about to do?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "אף פעם",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Most of the time",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כל הזמן",
              en: "All the time",
            },
          },
        ],
      },
      {
        id: "q1-10",
        tag: "post_snack_behavioral_change",
        type: "single",
        text: {
          he: "מתי את/ה אוכל/ת משהו מהמאכלים האלו? פיצה, המבורגר, שניצל תעשייתי, נקניקיות, במבה, ביסלי, צ'יפס, פיצוחים מלוחים, מאפים תעשייתיים, פיצות, שניצלים מוכנים, צ'יפס, שניצל, חמוצים תעשייתיים, מזון משומר עתיר מלח",
          en: "When do you eat foods like these? (Pizza, burgers, frozen schnitzels, hot dogs, salty snacks like Bamba or chips, fried foods, pickled or canned salty foods)",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "בטיולים שנתיים וחגיגות",
              en: "Only on trips or parties",
            },
          },
          {
            id: "opt2",
            text: {
              he: "כל שבוע",
              en: "About once a week",
            },
          },
          {
            id: "opt3",
            text: {
              he: "כמעט כל יום",
              en: "Almost every day",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמה פעמים ביום",
              en: "A few times a day",
            },
          },
        ],
      },
      {
        id: "q1-11",
        tag: "post_snack_behavioral_change",
        type: "single",
        text: {
          he: "מתי את/ה אוכל/ת משהו מהמתוקים האלו? סוכר לבן, סוכר חום, שתייה ממותקת, שוקולדים, ממתקים, ריבות, גלידות, עוגות ועוגיות תעשייתיות, משקאות ממותקים, דגני בוקר ממותקים",
          en: "When do you eat sweet things like these? (Sugar, candy, chocolate, sweet drinks, cakes, cookies, ice cream, sweet cereals)",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "בטיולים שנתיים וחגיגות",
              en: "Only on trips or parties",
            },
          },
          {
            id: "opt2",
            text: {
              he: "כל שבוע",
              en: "About once a week",
            },
          },
          {
            id: "opt3",
            text: {
              he: "כמעט כל יום",
              en: "Almost every day",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמה פעמים ביום",
              en: "A few times a day",
            },
          },
        ],
      },
      /*{
        id: 'q1-12',
        tag: 'filter',
        type: 'multiple',
        text: {
          he: 'מה מהמאכלים את/ה לא אוהב/ת לאכול?',
          en: 'Which of these foods don\'t you like to eat?'
        },
        options: [
          {
            id: 'meat1',
            text: {
              he: 'עוף',
              en: 'Chicken'
            }
          },
          {
            id: 'meat2',
            text: {
              he: 'כבש',
              en: 'Lamb'
            }
          },
          {
            id: 'meat3',
            text: {
              he: 'פרה',
              en: 'Beef'
            }
          },
          {
            id: 'fish1',
            text: {
              he: 'דג סלמון',
              en: 'Salmon'
            }
          },
          {
            id: 'fish2',
            text: {
              he: 'דג לבן',
              en: 'White fish'
            }
          },
          {
            id: 'fish3',
            text: {
              he: 'דג טונה',
              en: 'Tuna'
            }
          }
        ]
      },
      {
        id: 'q1-13',
        tag: 'filter',
        type: 'multiple',
        text: {
          he: 'איזה ירקות את/ה לא אוהב/ת?',
          en: 'Which vegetables don\'t you like?'
        },
        options: [
          {
            id: 'veg1',
            text: {
              he: 'עגבניה',
              en: 'Tomato'
            }
          },
          {
            id: 'veg2',
            text: {
              he: 'מלפפון',
              en: 'Cucumber'
            }
          },
          {
            id: 'veg3',
            text: {
              he: 'גמבה',
              en: 'Bell pepper'
            }
          },
          {
            id: 'veg4',
            text: {
              he: 'ברוקולי',
              en: 'Broccoli'
            }
          },
          {
            id: 'veg5',
            text: {
              he: 'כרוב ניצנים',
              en: 'Brussels sprouts'
            }
          },
          {
            id: 'veg6',
            text: {
              he: 'בצל',
              en: 'Onion'
            }
          },
          {
            id: 'veg7',
            text: {
              he: 'תפוחי אדמה',
              en: 'Potato'
            }
          },
          {
            id: 'veg8',
            text: {
              he: 'פטרוזיליה',
              en: 'Parsley'
            }
          },
          {
            id: 'veg9',
            text: {
              he: 'כוסברה',
              en: 'Cilantro'
            }
          },
          {
            id: 'veg10',
            text: {
              he: 'גזר',
              en: 'Carrot'
            }
          }
        ]
      },
      {
        id: 'q1-14',
        tag: 'filter',
        type: 'multiple',
        text: {
          he: 'איזה פירות את/ה לא אוהב/ת?',
          en: 'Which fruits don\'t you like?'
        },
        options: [
          {
            id: 'fruit1',
            text: {
              he: 'תפוח',
              en: 'Apple'
            }
          },
          {
            id: 'fruit2',
            text: {
              he: 'אפרסק',
              en: 'Peach'
            }
          },
          {
            id: 'fruit3',
            text: {
              he: 'נקטרינה',
              en: 'Nectarine'
            }
          },
          {
            id: 'fruit4',
            text: {
              he: 'ענבים',
              en: 'Grapes'
            }
          },
          {
            id: 'fruit5',
            text: {
              he: 'אננס',
              en: 'Pineapple'
            }
          },
          {
            id: 'fruit6',
            text: {
              he: 'לימון',
              en: 'Lemon'
            }
          },
          {
            id: 'fruit7',
            text: {
              he: 'קלמנטינה',
              en: 'Clementine'
            }
          },
          {
            id: 'fruit8',
            text: {
              he: 'תפוז',
              en: 'Orange'
            }
          },
          {
            id: 'fruit9',
            text: {
              he: 'אבטיח',
              en: 'Watermelon'
            }
          },
          {
            id: 'fruit10',
            text: {
              he: 'מלון',
              en: 'Melon'
            }
          },
          {
            id: 'fruit11',
            text: {
              he: 'בננה',
              en: 'Banana'
            }
          },
          {
            id: 'fruit12',
            text: {
              he: 'תותים',
              en: 'Strawberries'
            }
          },
          {
            id: 'fruit13',
            text: {
              he: 'אבוקדו',
              en: 'Avocado'
            }
          }
        ]
      },*/
      {
        id: "q1-15",
        tag: "movement_during_class",
        type: "single",
        text: {
          he: "את/ה חושב/ת שקיום פעילות ספורטיבית עוזר לך להתרכז?",
          en: "Do you think physical activity helps you focus better?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Most of the time",
            },
          },
          {
            id: "opt4",
            text: {
              he: "תמיד",
              en: "All the time",
            },
          },
        ],
      },
      /*{
        id: "q1-16",
        tag: "filter",
        type: "multiple",
        text: {
          he: "איזה ספורט הכי קשה לך לעשות?",
          en: "Which sport do you find it hard to do?",
        },
        options: [
          {
            id: "sport1",
            text: {
              he: "ריצה",
              en: "Running",
            },
          },
          {
            id: "sport2",
            text: {
              he: "רכיבה על אופניים",
              en: "Biking",
            },
          },
          {
            id: "sport3",
            text: {
              he: "הליכה מהירה",
              en: "Brisk walking",
            },
          },
          {
            id: "sport4",
            text: {
              he: "שחייה",
              en: "Swimming",
            },
          },
          {
            id: "sport5",
            text: {
              he: "קפיצה",
              en: "Jumping",
            },
          },
          {
            id: "sport6",
            text: {
              he: "אקסרגיימינג",
              en: "Exergaming",
            },
          },
          {
            id: "sport7",
            text: {
              he: "משחקי כדור",
              en: "Ball games",
            },
          },
          {
            id: "sport8",
            text: {
              he: "יוגה",
              en: "Yoga",
            },
          },
        ],
      },*/
      {
        id: "q1-17",
        tag: "task_initiation_difficulty",
        type: "single",
        text: {
          he: "עד כמה קשה לך להתחיל משימות שדורשות ריכוז לאחר מנוחה או הפסקה?",
          en: "How hard is it for you to start tasks that require focus after a break or rest?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Most of the time",
            },
          },
          {
            id: "opt4",
            text: {
              he: "תמיד",
              en: "All the time",
            },
          },
        ],
      },
      {
        id: "q1-18",
        tag: "cognitive_physical_difficulty",
        type: "single",
        text: {
          he: "האם את/ה מוצא/ת את עצמך מוסח/ת או מאבד/ת ריכוז במהלך פעילות פיזית שכוללת גם חשיבה (למשל משחק קבוצתי עם חוקים)?",
          en: "Do you find yourself distracted or losing focus during physical activities that also involve thinking (like team games with rules)?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Most of the time",
            },
          },
          {
            id: "opt4",
            text: {
              he: "תמיד",
              en: "All the time",
            },
          },
        ],
      },
    ],
  },
  {
    id: "questionnaire-2",
    title: {
      he: "שאלון הורה - ריכוז והתנהגות",
      en: "Parent Questionnaire - Concentration and Behavior",
    },
    questions: [
      {
        id: "q2-1",
        tag: "morning routine, initiation",
        type: "single",
        text: {
          he: "עד כמה ילדך מצליח להשלים את שגרת הבוקר באופן עצמאי?",
          en: "How well does your child complete their morning routine independently?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "עצמאי/ת",
              en: "Independent",
            },
          },
          {
            id: "opt2",
            text: {
              he: "זקוק/ה לתזכורות מינימליות",
              en: "Needs minimal reminders",
            },
          },
          {
            id: "opt3",
            text: {
              he: "זקוק/ה לתזכורות מדי פעם",
              en: "Needs occasional reminders",
            },
          },
          {
            id: "opt4",
            text: {
              he: "זקוק/ה לתזכורות קבועות",
              en: "Needs constant reminders",
            },
          },
        ],
      },
      {
        id: "q2-2",
        tag: "task initiation, routine, executive function, time orientation, arousal level, behavioral reinforcement",
        type: "single",
        text: {
          he: "באיזו תדירות הילד/ה מסיים/ת שיעורי בית ללא תזכורות מתמידות?",
          en: "How often does your child complete homework without repeated reminders?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "תמיד",
              en: "Always",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לעתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt4",
            text: {
              he: "אף פעם",
              en: "Never",
            },
          },
        ],
      },
      {
        id: "q2-3",
        tag: "energy release, arousal level, movement breaks, energy, peer support",
        type: "single",
        text: {
          he: "כיצד היית מדרג/ת את רמות האנרגיה הכלליות של ילדך במהלך היום?",
          en: "How would you rate your child's energy levels throughout the day?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "גבוהה מאוד (אנרגטי/ת ומעורב/ת)",
              en: "Very high (energetic and engaged)",
            },
          },
          {
            id: "opt2",
            text: {
              he: "גבוהה (ערני/ת רוב הזמן)",
              en: "High (alert most of the time)",
            },
          },
          {
            id: "opt3",
            text: {
              he: "נמוכה (לעתים קרובות חסר/ת מרץ)",
              en: "Low (often lacking energy)",
            },
          },
          {
            id: "opt4",
            text: {
              he: "נמוכה מאוד (עייף/ה תמיד)",
              en: "Very low (always tired)",
            },
          },
        ],
      },
      {
        id: "q2-4",
        tag: "desk_bag_organization",
        type: "single",
        text: {
          he: "עד כמה קשה לילדך לשמור על סדר בשולחן הלימודים ובחומרי הלמידה?",
          en: "How difficult is it for your child to keep their study space and materials organized?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "אף פעם",
              en: "Never",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "תמיד",
              en: "Always",
            },
          },
        ],
      },
      {
        id: "q2-5",
        tag: "visual/auditory distraction",
        type: "single",
        text: {
          he: "האם הילד/ה מתלוננ/ת לעיתים שרעש בכיתה או בבית מקשה עליו/ה להתרכז?",
          en: "Does your child often complain that noise in class or at home makes it hard to focus?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "אף פעם",
              en: "Never",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "תמיד",
              en: "Always",
            },
          },
        ],
      },
      {
        id: "q2-6",
        tag: "seating_difficulty",
        type: "single",
        text: {
          he: "האם ילדך מתקשה להישאר יושב/ת זמן ממושך במהלך הלמידה?",
          en: "Does your child have difficulty staying seated for long periods during learning?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "תמיד",
              en: "Always",
            },
          },
        ],
      },
      {
        id: "q2-7",
        tag: "emotional_irritability_mgD",
        type: "single",
        text: {
          he: "האם הילד/ה חווה לעיתים מצבי רוח משתנים, התפרצויות או קושי רגשי?",
          en: "Does your child experience frequent mood swings, outbursts, or emotional difficulties?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "תמיד",
              en: "Always",
            },
          },
        ],
      },
      {
        id: "q2-8",
        tag: "daytime_fatigue",
        type: "single",
        text: {
          he: "עד כמה הילד שלך נראה עייף או מותש במהלך היום גם לאחר שינה סבירה?",
          en: "How tired or exhausted does your child seem during the day, even after a reasonable amount of sleep?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "Almost always",
            },
          },
        ],
      },
      {
        id: "q2-9",
        tag: "environmental_distraction",
        type: "single",
        text: {
          he: "עד כמה קל להסיח את הדעה של התלמיד/ה מגירויים סביבתיים (לדוגמה רעש מבחוץ, תזוזה של תלמיד אחר)?",
          en: "How easily is your child distracted by environmental stimuli (e.g., outside noise, another student's movement)?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "Almost always",
            },
          },
        ],
      },
      {
        id: "q2-10",
        tag: "perceptual_motor_difficulty",
        type: "single",
        text: {
          he: "עד כמה הילד/ה מתבלבל או מתקשה לעקוב אחרי הוראות הכוללות גם תנועה?",
          en: "How often does your child get confused or struggle to follow instructions that include movement?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "תמיד",
              en: "Always",
            },
          },
        ],
      },
      {
        id: "q2-11",
        tag: "sensorimotor_Impulsivity",
        type: "single",
        text: {
          he: "האם הילד מתקשה לעצור את עצמו בזמן משחקים שדורשים תנועה או מגע (כגון משחקי כדור, קפיצה, תחרות)?",
          en: "Does your child have difficulty stopping themselves during games that involve movement or physical contact (e.g., ball games, jumping, races)?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "תמיד",
              en: "Always",
            },
          },
        ],
      },
      {
        id: "q2-12",
        tag: "post_workout_up",
        type: "single",
        text: {
          he: "האם הבחנת בשיפור ביכולת הריכוז של ילדך לאחר פעילות גופנית?",
          en: "Have you noticed an improvement in your child's concentration after physical activity?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "אין שיפור",
              en: "No improvement",
            },
          },
          {
            id: "opt2",
            text: {
              he: "שיפור קל",
              en: "Slight improvement",
            },
          },
          {
            id: "opt3",
            text: {
              he: "שיפור בינוני",
              en: "Moderate improvement",
            },
          },
          {
            id: "opt4",
            text: {
              he: "שיפור משמעותי",
              en: "Significant improvement",
            },
          },
        ],
      },
      {
        id: "q2-13",
        tag: "group_behavior_difficulty",
        type: "single",
        text: {
          he: "עד כמה קשה לילד/ה לשמור על כללים בפעילויות קבוצתיות כמו משחקים או ספורט?",
          en: "How difficult is it for your child to follow rules during group activities like games or sports?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "תמיד",
              en: "Always",
            },
          },
        ],
      },
      {
        id: "q2-14",
        tag: "attention_during_movement",
        type: "single",
        text: {
          he: "עד כמה הילד מצליח/ה להתרכז כשנדרש ממנו לעבור בין ישיבה לתנועה (למשל בעת הפסקות פעילות בשיעור)?",
          en: "How well does your child stay focused when switching between sitting and movement (e.g., during active breaks in class)?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "תמיד",
              en: "Always",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
        ],
      },
      {
        id: "q2-15",
        tag: "time orientation",
        type: "single",
        text: {
          he: "האם הילד שוכח/ת לעיתים קרובות משימות שקיבל/ה או מתקשה לעקוב אחרי סדר פעולות?",
          en: "Does your child often forget assigned tasks or struggle to follow a sequence of actions?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "Always",
            },
          },
        ],
      },
      {
        id: "q2-16",
        tag: "subtype",
        type: "single",
        text: {
          he: "איזו מההתנהגויות הבאות מתארת בצורה מדויקת יותר את ילדי?",
          en: "Which of the following behaviors best describes your child?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: " היפראקטיביות: הילד מתקשה לשבת במקום לאורך זמן, קופץ/ת או מתנועע/ת באופן מופרז, מרבה לדבר בלי הפסקה ואינו מצליח/ה להירגע גם כשהסביבה מצפה ממנו להיות שקט.",
              en: " Hyperactivity: Your child has difficulty sitting still for long periods, fidgets or moves excessively, talks nonstop, and is unable to calm down even when the situation calls for quiet.",
            },
          },
          {
            id: "opt2",
            text: {
              he: "אימפולסיביות: הילד נוקט/ת בפעולות ללא מחשבה מוקדמת – לוקח/ת צעצועים או מצרכים בלי לבקש רשות, משיב תשובות או מתערב/ת בשיחות ללא סדר, ולעיתים מתקשה לחכות לתורו או לעצור בזמן",
              en: "Impulsivity: Your child acts without thinking—takes toys or items without asking, blurts out answers or interrupts conversations, and often struggles to wait their turn or stop themselves in time.",
            },
          },
          {
            id: "opt3",
            text: {
              he: " אני מזהה את שתי ההתנהגויות בילדי.",
              en: "I recognize both behaviors in my child.",
            },
          },
          {
            id: "opt4",
            text: {
              he: " איני מזהה אף אחת משתי ההתנהגויות האלו אצל ילדי.",
              en: "I do not recognize any of these behaviors in my child.",
            },
          },
        ],
      },
      {
        id: "q2-17",
        tag: "trauma_suspected",
        type: "single",
        text: {
          he: "האם ההתנהגויות שתיארתם תמיד היו קיימות אצל הילד?",
          en: "Have the behaviors you described always been present in your child?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כן, התסמינים קיימים מגיל קטן",
              en: "Yes, symptoms have been present since early childhood",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לא, התסמינים התחילו לאחרונה",
              en: "No, symptoms started recently",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לא בטוח/ה - קשה לי לזכור",
              en: "Not sure - it's hard for me to remember",
            },
          },
        ],
      },
      {
        id: "q2-18",
        tag: "professional_assessment",
        type: "single",
        text: {
          he: "האם קרה אירוע מיוחד או שינוי משמעותי לפני שהתסמינים התחילו?",
          en: "Did any special event or significant change occur before the symptoms started?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "לא קרה כלום מיוחד שאני יכול/ה לזכור",
              en: "Nothing special that I can remember happened",
            },
          },
          {
            id: "opt2",
            text: {
              he: "מעבר דירה או בית ספר",
              en: "Moving home or changing schools",
            },
          },
          {
            id: "opt3",
            text: {
              he: "פרידה, גירושים או אובדן במשפחה",
              en: "Separation, divorce, or family loss",
            },
          },
          {
            id: "opt4",
            text: {
              he: "אירוע מפחיד, מטריד או טראומטי",
              en: "Frightening, disturbing, or traumatic event",
            },
          },
        ],
      },
      {
        id: "q2-19",
        tag: "allergy",
        type: "single",
        text: {
          he: "האם לילד יש אלרגיות?",
          en: "Does your child have any allergies?",
        },
        options: [
          { id: "yes", text: { he: "כן", en: "Yes" } },
          { id: "no", text: { he: "לא", en: "No" } },
        ],
      },
      {
        id: "q2-20",
        tag: "allergy",
        type: "multiple",
        text: {
          he: "האם הילד אלרגי למאכל מהרשימות הבאות? אגוזים",
          en: "Is your child allergic to any of the following nuts and seeds?",
        },
        options: [
          {
            id: "nut0",
            text: {
              he: "אין אלרגיות לסוגיי האגוזים הללו ",
              en: "There are no allergies to these types of nuts.",
            },
          },
          {
            id: "nut1",
            text: {
              he: "שקדים",
              en: "Almonds",
            },
          },
          {
            id: "nut2",
            text: {
              he: "אגוזי קשיו",
              en: "Cashews",
            },
          },
          {
            id: "nut3",
            text: {
              he: "גרעיני דלעת",
              en: "Pumpkin seeds",
            },
          },
          {
            id: "nut4",
            text: {
              he: "גרעיני חמנייה",
              en: "Sunflower seeds",
            },
          },
          {
            id: "nut5",
            text: {
              he: "אגוזי לוז",
              en: "Hazelnuts",
            },
          },
          {
            id: "nut6",
            text: {
              he: "פולי סויה",
              en: "Soybeans",
            },
          },
          {
            id: "nut7",
            text: {
              he: "אגוזי מלך",
              en: "Walnuts",
            },
          },
          {
            id: "nut8",
            text: {
              he: "זרעי פשתן",
              en: "Flax seeds",
            },
          },
          {
            id: "nut9",
            text: {
              he: "זרעי צ'יה",
              en: "Chia seeds",
            },
          },
          {
            id: "nut10",
            text: {
              he: "זרעי קנבוס",
              en: "Hemp seeds",
            },
          },
        ],
      },
      {
        id: "q2-21",
        tag: "allergy",
        type: "multiple",
        text: {
          he: "האם הילד אלרגי למאכל מהרשימות הבאות? סוגיי חלבון ",
          en: "Is your child allergic to any of the following meat or fish products?",
        },
        options: [
          {
            id: "meat0",
            text: {
              he: "אין אלרגיות לסוגיי החלבון הללו ",
              en: "There are no allergies to these types of protein.",
            },
          },
          {
            id: "meat1",
            text: {
              he: "דג מקרל",
              en: "Mackerel",
            },
          },
          {
            id: "meat2",
            text: {
              he: "סלמון",
              en: "Salmon",
            },
          },
          {
            id: "meat3",
            text: {
              he: "טופו",
              en: "Tofu",
            },
          },
          {
            id: "meat4",
            text: {
              he: "טונה",
              en: "Tuna",
            },
          },
          {
            id: "meat5",
            text: {
              he: "סרדינים",
              en: "Sardines",
            },
          },
          {
            id: "meat6",
            text: {
              he: "דג בקלה",
              en: "Cod",
            },
          },
          {
            id: "meat7",
            text: {
              he: "כבד עוף",
              en: "Chicken liver",
            },
          },
          {
            id: "meat8",
            text: {
              he: "עוף",
              en: "Chicken",
            },
          },
          {
            id: "meat9",
            text: {
              he: "בקר",
              en: "Beef",
            },
          },
          {
            id: "meat10",
            text: {
              he: "הודו",
              en: "Turkey",
            },
          },
          {
            id: "meat11",
            text: {
              he: "שרימפס",
              en: "Shrimp",
            },
          },
          {
            id: "meat12",
            text: {
              he: "צדפות",
              en: "Clams",
            },
          },
          {
            id: "meat13",
            text: {
              he: "סרטן",
              en: "Crab",
            },
          },
          {
            id: "meat14",
            text: {
              he: "טמפה",
              en: "Tempeh",
            },
          },
          {
            id: "meat15",
            text: {
              he: "הרינג",
              en: "Herring",
            },
          },
          {
            id: "meat16",
            text: {
              he: "אנשובי",
              en: "Anchovies",
            },
          },
        ],
      },
      {
        id: "q2-22",
        tag: "allergy",
        type: "multiple",
        text: {
          he: "האם הילד אלרגי למאכל מהרשימות הבאות? דגנים",
          en: "Is your child allergic to any of the following grains or legumes?",
        },
        options: [
          {
            id: "grain0",
            text: {
              he: "אין אלרגיות לדגנים ",
              en: "No grain allergies",
            },
          },
          {
            id: "grain1",
            text: {
              he: "שעועית שחורה",
              en: "Black beans",
            },
          },
          {
            id: "grain2",
            text: {
              he: "עדשים",
              en: "Lentils",
            },
          },
          {
            id: "grain3",
            text: {
              he: "קינואה",
              en: "Quinoa",
            },
          },
          {
            id: "grain4",
            text: {
              he: "שיבולת שועל",
              en: "Oats",
            },
          },
          {
            id: "grain5",
            text: {
              he: "דגנים מלאים (כמו לחם מחיטה מלאה)",
              en: "Whole grains (e.g., whole wheat bread)",
            },
          },
          {
            id: "grain6",
            text: {
              he: "חומוס",
              en: "Chickpeas",
            },
          },
          {
            id: "grain7",
            text: {
              he: "שעועית אדומה",
              en: "Red beans",
            },
          },
          {
            id: "grain8",
            text: {
              he: "אורז לבן",
              en: "White rice",
            },
          },
          {
            id: "grain9",
            text: {
              he: "אורז מלא",
              en: "Brown rice",
            },
          },
          {
            id: "grain10",
            text: {
              he: "דגני בוקר מועשרים",
              en: "Fortified cereals",
            },
          },
        ],
      },
      {
        id: "q2-23",
        tag: "allergy",
        type: "multiple",
        text: {
          he: "האם הילד אלרגי למאכל מהרשימות הבאות? חלבי",
          en: "Is your child allergic to any of the following dairy products?",
        },
        options: [
          {
            id: "dairy0",
            text: {
              he: "אין אלרגיות לחלב ",
              en: "No dairy allergies",
            },
          },
          {
            id: "dairy1",
            text: {
              he: "יוגורט טבעי",
              en: "Plain yogurt",
            },
          },
          {
            id: "dairy2",
            text: {
              he: "חלמון ביצה",
              en: "Egg yolk",
            },
          },
          {
            id: "dairy3",
            text: {
              he: "חלב מועשר בוויטמין D",
              en: "Vitamin D-fortified milk",
            },
          },
          {
            id: "dairy4",
            text: {
              he: "יוגורט מועשר",
              en: "Fortified yogurt",
            },
          },
          {
            id: "dairy5",
            text: {
              he: "משקה סויה מועשר",
              en: "Fortified soy drink",
            },
          },
          {
            id: "dairy6",
            text: {
              he: "משקה שקדים מועשר",
              en: "Fortified almond drink",
            },
          },
          {
            id: "dairy7",
            text: {
              he: "גבינת מוצרלה",
              en: "Mozzarella cheese",
            },
          },
          {
            id: "dairy8",
            text: {
              he: "גבינת קוטג'",
              en: "Cottage cheese",
            },
          },
          {
            id: "dairy9",
            text: {
              he: "ביצים",
              en: "Eggs",
            },
          },
          {
            id: "dairy10",
            text: {
              he: "חלב",
              en: "Milk",
            },
          },
          {
            id: "dairy11",
            text: {
              he: "גבינות בשלות",
              en: "Aged cheeses",
            },
          },
        ],
      },
      {
        id: "q2-24",
        tag: "allergy",
        type: "multiple",
        text: {
          he: "האם הילד אלרגי למאכל מהרשימות הבאות? ירקות",
          en: "Is your child allergic to any of the following vegetables?",
        },
        options: [
          {
            id: "veg0",
            text: {
              he: "אין אלרגיות לסוגיי הירקות הללו ",
              en: "There are no allergies to these types of vegetables.",
            },
          },
          {
            id: "veg1",
            text: {
              he: "תרד",
              en: "Spinach",
            },
          },
          {
            id: "veg2",
            text: {
              he: "מנגולד",
              en: "Chard",
            },
          },
          {
            id: "veg3",
            text: {
              he: "אפונה",
              en: "Peas",
            },
          },
          {
            id: "veg4",
            text: {
              he: "פטריות שחשפו אותן לשמש (כגון פורטובלו, שיטאקי)",
              en: "Sun-exposed mushrooms (e.g., portobello, shiitake)",
            },
          },
          {
            id: "veg5",
            text: {
              he: "קייל",
              en: "Kale",
            },
          },
          {
            id: "veg6",
            text: {
              he: "ברוקולי",
              en: "Broccoli",
            },
          },
          {
            id: "veg7",
            text: {
              he: "אדממה",
              en: "Edamame",
            },
          },
          {
            id: "veg8",
            text: {
              he: "פלפל אדום",
              en: "Red bell pepper",
            },
          },
          {
            id: "veg9",
            text: {
              he: "פלפל צהוב",
              en: "Yellow bell pepper",
            },
          },
          {
            id: "veg10",
            text: {
              he: "כרוב ניצנים",
              en: "Brussels sprouts",
            },
          },
          {
            id: "veg11",
            text: {
              he: "עגבנייה",
              en: "Tomato",
            },
          },
          {
            id: "veg12",
            text: {
              he: "בצל סגול",
              en: "Red onion",
            },
          },
          {
            id: "veg13",
            text: {
              he: "ארטישוק",
              en: "Artichoke",
            },
          },
          {
            id: "veg14",
            text: {
              he: "גזר",
              en: "Carrot",
            },
          },
          {
            id: "veg15",
            text: {
              he: "מלפפון",
              en: "Cucumber",
            },
          },
          {
            id: "veg16",
            text: {
              he: "עגבניות שרי",
              en: "Cherry tomatoes",
            },
          },
          {
            id: "veg17",
            text: {
              he: "קולרבי",
              en: "Kohlrabi",
            },
          },
          {
            id: "veg18",
            text: {
              he: "חסה",
              en: "Lettuce",
            },
          },
          {
            id: "veg19",
            text: {
              he: "רוקט",
              en: "Arugula",
            },
          },
          {
            id: "veg20",
            text: {
              he: "קישוא",
              en: "Zucchini",
            },
          },
          {
            id: "veg21",
            text: {
              he: "כרובית",
              en: "Cauliflower",
            },
          },
          {
            id: "veg22",
            text: {
              he: "בטטה",
              en: "Sweet potato",
            },
          },
          {
            id: "veg23",
            text: {
              he: "דלעת",
              en: "Pumpkin",
            },
          },
          {
            id: "veg24",
            text: {
              he: "פטריות",
              en: "Mushrooms",
            },
          },
          {
            id: "veg25",
            text: {
              he: "כרוב",
              en: "Cabbage",
            },
          },
          {
            id: "veg26",
            text: {
              he: "שומר",
              en: "Fennel",
            },
          },
          {
            id: "veg27",
            text: {
              he: "סלק",
              en: "Beetroot",
            },
          },
          {
            id: "veg28",
            text: {
              he: "אספרגוס",
              en: "Asparagus",
            },
          },
          {
            id: "veg29",
            text: {
              he: "אפונה ירוקה",
              en: "Green peas",
            },
          },
          {
            id: "veg30",
            text: {
              he: "שעועית ירוקה",
              en: "Green beans",
            },
          },
          {
            id: "veg31",
            text: {
              he: "גזר גמדי",
              en: "Baby carrots",
            },
          },
          {
            id: "veg32",
            text: {
              he: "זוקיני",
              en: "Zucchini",
            },
          },
        ],
      },
      {
        id: "q2-25",
        tag: "allergy",
        type: "multiple",
        text: {
          he: "האם הילד אלרגי למאכל מהרשימות הבאות? פרוביוטיקה",
          en: "Is your child allergic to any of the following probiotic foods?",
        },
        options: [
          {
            id: "prob0",
            text: {
              he: "אין אלרגיות לסוגיי הפרוביוטיקה הללו ",
              en: "There are no allergies to these types of probiotic foods.",
            },
          },
          {
            id: "prob1",
            text: {
              he: "יוגורט עם חיידקים פעילים",
              en: "Yogurt with active cultures",
            },
          },
          {
            id: "prob2",
            text: {
              he: "קיפיר",
              en: "Kefir",
            },
          },
          {
            id: "prob3",
            text: {
              he: "חמוצים מותססים טבעית",
              en: "Naturally fermented pickles",
            },
          },
          {
            id: "prob4",
            text: {
              he: "כרוב כבוש",
              en: "Sauerkraut",
            },
          },
          {
            id: "prob5",
            text: {
              he: "קימצ'י",
              en: "Kimchi",
            },
          },
          {
            id: "prob6",
            text: {
              he: "קומבוצ'ה",
              en: "Kombucha",
            },
          },
          {
            id: "prob7",
            text: {
              he: "משקאות פרוביוטיים מועשרים",
              en: "Fortified probiotic drinks",
            },
          },
          {
            id: "prob8",
            text: {
              he: "טופו מותסס",
              en: "Fermented tofu",
            },
          },
          {
            id: "prob9",
            text: {
              he: "חמוצים מותססים",
              en: "Fermented pickles",
            },
          },
          {
            id: "prob10",
            text: {
              he: "משקאות פרוביוטיים צמחיים",
              en: "Plant-based probiotic drinks",
            },
          },
          {
            id: "prob11",
            text: {
              he: "תוספי פרוביוטיקה",
              en: "Probiotic supplements",
            },
          },
        ],
      },
      {
        id: "q2-26",
        tag: "allergy",
        type: "multiple",
        text: {
          he: "האם הילד אלרגי למאכל מהרשימות הבאות? פירות",
          en: "Is your child allergic to any of the following fruits?",
        },
        options: [
          {
            id: "fruit0",
            text: {
              he: "אין אלרגיות לסוגיי הפירות הללו ",
              en: "There are no allergies to these types of fruits.",
            },
          },
          {
            id: "fruit1",
            text: {
              he: "בננה",
              en: "Banana",
            },
          },
          {
            id: "fruit2",
            text: {
              he: "אבוקדו",
              en: "Avocado",
            },
          },
          {
            id: "fruit3",
            text: {
              he: "תפוח",
              en: "Apple",
            },
          },
          {
            id: "fruit4",
            text: {
              he: "אפרסק",
              en: "Peach",
            },
          },
          {
            id: "fruit5",
            text: {
              he: "נקטרינה",
              en: "Nectarine",
            },
          },
          {
            id: "fruit6",
            text: {
              he: "ענבים",
              en: "Grapes",
            },
          },
          {
            id: "fruit7",
            text: {
              he: "אננס",
              en: "Pineapple",
            },
          },
          {
            id: "fruit8",
            text: {
              he: "לימון",
              en: "Lemon",
            },
          },
          {
            id: "fruit9",
            text: {
              he: "קלמנטינה",
              en: "Clementine",
            },
          },
          {
            id: "fruit10",
            text: {
              he: "תפוז",
              en: "Orange",
            },
          },
          {
            id: "fruit11",
            text: {
              he: "אבטיח",
              en: "Watermelon",
            },
          },
          {
            id: "fruit12",
            text: {
              he: "מלון",
              en: "Melon",
            },
          },
          {
            id: "fruit13",
            text: {
              he: "תותים",
              en: "Strawberries",
            },
          },
          {
            id: "fruit14",
            text: {
              he: "מישמשים",
              en: "Apricots",
            },
          },
          {
            id: "fruit15",
            text: {
              he: "קיווי",
              en: "Kiwi",
            },
          },
          {
            id: "fruit16",
            text: {
              he: "תות שדה",
              en: "Wild strawberries",
            },
          },
          {
            id: "fruit17",
            text: {
              he: "גויאבה",
              en: "Guava",
            },
          },
          {
            id: "fruit18",
            text: {
              he: "מנגו",
              en: "Mango",
            },
          },
          {
            id: "fruit19",
            text: {
              he: "פפאיה",
              en: "Papaya",
            },
          },
          {
            id: "fruit20",
            text: {
              he: "אוכמניות",
              en: "Blueberries",
            },
          },
          {
            id: "fruit21",
            text: {
              he: "תפוחים",
              en: "Apples",
            },
          },
          {
            id: "fruit22",
            text: {
              he: "שזיפים",
              en: "Plums",
            },
          },
          {
            id: "fruit23",
            text: {
              he: "דובדבנים",
              en: "Cherries",
            },
          },
          {
            id: "fruit24",
            text: {
              he: "רימון",
              en: "Pomegranate",
            },
          },
        ],
      },
      {
        id: "q2-27",
        tag: "allergy",
        type: "multiple",
        text: {
          he: "האם הילד אלרגי למאכל מהרשימות הבאות? שמן",
          en: "Is your child allergic to any of the following oils?",
        },
        options: [
          {
            id: "oil0",
            text: {
              he: "אין אלרגיות לסוגיי השמן הללו ",
              en: "There are no allergies to these types of oils.",
            },
          },
          {
            id: "oil1",
            text: {
              he: "שמן כבד דגים",
              en: "Fish liver oil",
            },
          },
          {
            id: "oil2",
            text: {
              he: "שמן קנולה",
              en: "Canola oil",
            },
          },
          {
            id: "oil3",
            text: {
              he: "זית",
              en: "Olive oil",
            },
          },
          {
            id: "oil4",
            text: {
              he: "שמן דגים",
              en: "Fish oil",
            },
          },
          {
            id: "oil5",
            text: {
              he: "שמן סויה",
              en: "Soybean oil",
            },
          },
          {
            id: "oil6",
            text: {
              he: "תוספי שמן אצות",
              en: "Algae oil supplements",
            },
          },
          {
            id: "oil7",
            text: {
              he: "שמן פשתן",
              en: "Flaxseed oil",
            },
          },
        ],
      },
      {
        id: "q2-28",
        tag: "allergy",
        type: "multiple",
        text: {
          he: "האם הילד אלרגי למאכל מהרשימות הבאות? מתוקים",
          en: "Is your child allergic to any of the following sweets?",
        },
        options: [
          {
            id: "sweet0",
            text: {
              he: "אין אלרגיות לסוגיי המתוקים הללו ",
              en: "There are no allergies to these types of sweets.",
            },
          },
          {
            id: "sweet1",
            text: {
              he: "שוקולד מריר (מעל 70%)",
              en: "Dark chocolate (over 70%)",
            },
          },
          {
            id: "sweet2",
            text: {
              he: "משמשים מיובשים",
              en: "Dried apricots",
            },
          },
          {
            id: "sweet3",
            text: {
              he: "צימוקים",
              en: "Raisins",
            },
          },
        ],
      },
      {
        id: "q2-29",
        tag: "allergy",
        type: "multiple",
        text: {
          he: "האם הילד אלרגי למאכל מהרשימות הבאות? אחר",
          en: "Is your child allergic to any of the following others?",
        },
        options: [
          {
            id: "other0",
            text: {
              he: "אין אלרגיות לסוגיי המאכלים הללו ",
              en: "There are no allergies to these types of foods.",
            },
          },
          {
            id: "other1",
            text: {
              he: "מיסו",
              en: "Miso",
            },
          },
          {
            id: "other2",
            text: {
              he: "זיתים שחורים",
              en: "Black olives",
            },
          },
          {
            id: "other3",
            text: {
              he: "תה ירוק",
              en: "Green tea",
            },
          },
          {
            id: "other4",
            text: {
              he: "תה שחור",
              en: "Black tea",
            },
          },
          {
            id: "other5",
            text: {
              he: "שוקולד מריר",
              en: "Dark chocolate",
            },
          },
          {
            id: "other6",
            text: {
              he: "אורגנו",
              en: "Oregano",
            },
          },
          {
            id: "other7",
            text: {
              he: "טימין",
              en: "Thyme",
            },
          },
          {
            id: "other8",
            text: {
              he: "רוזמרין",
              en: "Rosemary",
            },
          },
          {
            id: "other9",
            text: {
              he: "מרווה",
              en: "Sage",
            },
          },
          {
            id: "other10",
            text: {
              he: "עשבי תיבול",
              en: "Mixed herbs",
            },
          },
        ],
      },
    ],
  },
  {
    id: "questionnaire-3",
    title: {
      he: "שאלון מורה - ריכוז והתנהגות",
      en: "Teacher Questionnaire - Concentration and Behavior",
    },
    questions: [
      {
        id: "q3-1",
        tag: "seating location",
        type: "single",
        text: {
          he: "עד כמה מיקום הישיבה הנוכחי תורם לריכוז של התלמיד/ה?",
          en: "To what extent does the current seating arrangement help the student stay focused?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "תורם מאוד – שומר/ת על ריכוז לאורך זמן",
              en: "Very helpful – The student maintains focus for extended periods",
            },
          },
          {
            id: "opt2",
            text: {
              he: "תורם חלקית – נדרשת תזכורת מדי פעם",
              en: "Somewhat helpful – Occasional reminders are needed",
            },
          },
          {
            id: "opt3",
            text: {
              he: "אינו תורם – התלמיד מוסח לעיתים קרובות",
              en: "Not helpful – The student is frequently distracted",
            },
          },
          {
            id: "opt4",
            text: {
              he: "מזיק – מיקום גורם להסחות משמעותיות או אובדן מיקוד",
              en: "Harmful – The seating location causes significant distractions or loss of focus",
            },
          },
        ],
      },
      {
        id: "q3-2",
        tag: "task_completion",
        type: "single",
        text: {
          he: "באיזו תדירות התלמיד משלים את המשימות שלו בזמן?",
          en: "How often does the student complete tasks on time?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "תמיד",
              en: "Always",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לעתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt4",
            text: {
              he: "אף פעם",
              en: "Never",
            },
          },
        ],
      },
      {
        id: "q3-3",
        tag: "maintain_focus_lessons",
        type: "single",
        text: {
          he: "האם התלמיד/ה שומר/ת על ריכוז לאורך שיעור שלם?",
          en: "Does the student maintain focus throughout an entire lesson?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כן, לאורך כל השיעור – ללא קושי",
              en: "Yes, maintains focus throughout the entire lesson without difficulty",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לרוב – לעיתים נדרש תזכורת קלה או שינוי גירוי",
              en: "Mostly – occasionally needs a reminder or stimulus change",
            },
          },
          {
            id: "opt3",
            text: {
              he: "קושי לשמור על ריכוז לאורך זמן – נדרש חיזוק חיצוני או הפסקות קצרות",
              en: "Has difficulty maintaining focus – requires external prompts or short breaks",
            },
          },
          {
            id: "opt4",
            text: {
              he: "לא מצליח/ה לשמור על ריכוז – מוסח/ת באופן תדיר",
              en: "Unable to stay focused – frequently distracted",
            },
          },
        ],
      },
      {
        id: "q3-4",
        tag: "Allow_movement",
        type: "single",
        text: {
          he: "רמת האנרגיה של התלמיד/ה מתאימה לפעילויות למידה",
          en: "The student's energy level is appropriate for learning activities",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "רמת האנרגיה יציבה ומתאימה",
              en: "Energy level is stable and appropriate",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לעיתים יש ירידה קלה באנרגיה",
              en: "Occasionally shows slight drops in energy",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות חסר/ת מרץ או עייף/ה",
              en: "Often lacks energy or appears tired",
            },
          },
          {
            id: "opt4",
            text: {
              he: "רמת האנרגיה נמוכה מאוד, משפיעה על יכולת הלמידה",
              en: "Very low energy level, affecting learning ability",
            },
          },
        ],
      },
      {
        id: "q3-5",
        tag: "behavior boundaries",
        type: "single",
        text: {
          he: "כיצד מגיב/ה התלמיד/ה לחיזוקים חיוביים לעומת ענישה?",
          en: "How does the student respond to positive reinforcement compared to punishment?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "מגיב/ה היטב לחיזוקים חיוביים, פחות לענישה",
              en: "Responds well to positive reinforcement, less to punishment",
            },
          },
          {
            id: "opt2",
            text: {
              he: "מגיב/ה לשני הסוגים באופן דומה",
              en: "Responds similarly to both approaches",
            },
          },
          {
            id: "opt3",
            text: {
              he: "מגיב/ה טוב יותר לענישה ברורה",
              en: "Responds better to clear punishment",
            },
          },
          {
            id: "opt4",
            text: {
              he: "אינו מגיב לא לחיזוקים חיוביים ולא לענישה",
              en: "Does not respond well to either reinforcement or punishment",
            },
          },
        ],
      },
      {
        id: "q3-6",
        tag: "immediate feedback",
        type: "single",
        text: {
          he: "האם התלמיד/ה מגיב/ה באופן חיובי למשוב מיידי מצדך?",
          en: "Does the student respond positively to immediate feedback from you?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "מגיב/ה מיידית למשוב – שינוי בהתנהגות מורגש",
              en: "Responds immediately – noticeable behavioral change",
            },
          },
          {
            id: "opt2",
            text: {
              he: "מגיב/ה חלקית – לעיתים יש צורך בחיזוק נוסף",
              en: "Responds partially – occasionally needs additional reinforcement",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לרוב לא מגיב/ה – דרוש תיווך נוסף או שיח",
              en: "Rarely responds – requires further mediation or discussion",
            },
          },
          {
            id: "opt4",
            text: {
              he: "לא מגיב/ה כלל – המשוב לא מוביל לשינוי בהתנהגות",
              en: "Does not respond – feedback does not lead to behavioral change",
            },
          },
        ],
      },
      {
        id: "q3-7",
        tag: "visual_schedules",
        type: "single",
        text: {
          he: "האם התלמיד/ה מפיק/ה תועלת מלוחות זמנים חזותיים בכיתה?",
          en: "Does the student benefit from visual schedules in the classroom?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "לא נדרש/ת לעזרים חזותיים",
              en: "Does not require visual aids",
            },
          },
          {
            id: "opt2",
            text: {
              he: "משתמש/ת לעיתים בלוחות, עם הצלחה",
              en: "Occasionally uses visual schedules successfully",
            },
          },
          {
            id: "opt3",
            text: {
              he: "תלוי/ה בעזרים חזותיים כדי להתמצא",
              en: "Relies on visual aids for orientation",
            },
          },
          {
            id: "opt4",
            text: {
              he: "מתקשה בלי עזרים חזותיים, ויש צורך בהנגשה עקבית",
              en: "Struggles without visual aids and requires consistent support",
            },
          },
        ],
      },
      {
        id: "q3-8",
        tag: "teacher support",
        type: "single",
        text: {
          he: "האם התלמיד/ה מגיב/ה טוב יותר כשמקבל/ת פנייה אישית לפני התחלת משימה?",
          en: "Does the student respond better when given a personal cue before starting a task?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "מתחיל/ה משימות באופן עצמאי ללא צורך בפנייה",
              en: "Initiates tasks independently without the need for prompting",
            },
          },
          {
            id: "opt2",
            text: {
              he: "נעזר/ת לעיתים בפנייה אישית",
              en: "Occasionally benefits from personal prompting",
            },
          },
          {
            id: "opt3",
            text: {
              he: "זקוק/ה לרוב לפנייה אישית כדי להתחיל משימה",
              en: "Often requires personal prompting to begin a task",
            },
          },
          {
            id: "opt4",
            text: {
              he: "לא מתחיל/ה משימות ללא פנייה ישירה וממוקדת",
              en: "Does not begin tasks without direct and focused prompting",
            },
          },
        ],
      },
      {
        id: "q3-9",
        tag: "consequence understanding",
        type: "single",
        text: {
          he: "האם התלמיד/ה ממשיך/ה בהתנהגות לא הולמת גם לאחר שהתבקשה ממנו תגובה מרסנת (למשל: להירגע או לשבת במקום)?",
          en: "Does the student continue inappropriate behavior even after being prompted to self-regulate (e.g., calm down or return to their seat)?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "לרוב נרגע/ת מיד",
              en: "Usually calms down immediately",
            },
          },
          {
            id: "opt2",
            text: {
              he: "נרגע/ת לאחר תזכורת נוספת",
              en: "Calms down after an additional reminder",
            },
          },
          {
            id: "opt3",
            text: {
              he: "ממשיך/ה בהתנהגות הלא הולמת זמן ממושך",
              en: "Continues the inappropriate behavior for a prolonged time",
            },
          },
          {
            id: "opt4",
            text: {
              he: "מתפרץ/ת אף יותר לאחר התערבות",
              en: "Escalates further after the intervention",
            },
          },
        ],
      },
      {
        id: "q3-10",
        tag: "focus_morning",
        type: "single",
        text: {
          he: "האם הילד מתקשה לשמור על ריכוז לאורך זמן בשעות הבוקר?",
          en: "Does the child struggle to maintain concentration for an extended period in the morning hours?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "Almost always",
            },
          },
        ],
      },
      {
        id: "q3-11",
        tag: "emotional_dysregulation_relax",
        type: "single",
        text: {
          he: "עד כמה התלמיד/ה מתקשה להירגע לאחר שהתרגש או כעס בשיעור?",
          en: "To what extent does the student have difficulty calming down after becoming excited or angry in class?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "Almost always",
            },
          },
        ],
      },
      {
        id: "q3-12",
        tag: "emotional_reactivity_classroom",
        type: "single",
        text: {
          he: "האם התלמיד/ה נוטה להגיב בעוצמה רגשית למצבים פשוטים (כגון שינוי במיקום ישיבה או תיקון של טעות)?",
          en: "Does the student tend to react emotionally and intensely to minor situations (such as a change in seating arrangement or a correction of a mistake)?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "Almost always",
            },
          },
        ],
      },
      {
        id: "q3-13",
        tag: "task_completion_difficulty",
        type: "single",
        text: {
          he: "האם התלמיד/ה מתחיל משימות בכיתה אך לא מצליח לסיים אותן?",
          en: "Does the student start tasks in class but fail to complete them?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "Almost always",
            },
          },
        ],
      },
      {
        id: "q3-14",
        tag: "post_snack_behavioral_change",
        type: "single",
        text: {
          he: "האם אתה שם לב להחמרה בחוסר שקט או בתגובות אימפולסיביות לאחר הפסקות אוכל או חטיפים?",
          en: "Have you noticed increased restlessness or Impulsive behavior after snack or meal breaks?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "Almost always",
            },
          },
        ],
      },
      {
        id: "q3-15",
        tag: "post_meal_fatigue_focus_drop",
        type: "single",
        text: {
          he: "האם התלמיד/ה מראה ירידה בריכוז או מגלה עייפות במיוחד בשעות שלאחר ארוחת עשר או הצהריים?",
          en: "Does the student show a drop in focus or appear tired especially after mid-morning or lunch breaks?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "Almost always",
            },
          },
        ],
      },
      {
        id: "q3-16",
        tag: "attention_instruction_following",
        type: "single",
        text: {
          he: "האם התלמיד/ה מתקשה להקשיב להוראות מתחילתן ועד סופן?",
          en: "Does the student struggle to follow instructions from beginning to end?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "Almost always",
            },
          },
        ],
      },
      {
        id: "q3-17",
        tag: "general_Impulsivity",
        type: "single",
        text: {
          he: "עד כמה התלמיד/ה פועל באופן אימפולסיבי, מבלי לעצור ולחשוב?",
          en: "To what extent does the student act Impulsivity without stopping to think?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "Almost always",
            },
          },
        ],
      },
      {
        id: "q3-18",
        tag: "sustained_attention_difficulty",
        type: "single",
        text: {
          he: "האם התלמיד/ה מגלה קושי להתמיד במשימה לאורך זמן, גם כאשר היא מותאמת לרמתו?",
          en: "Does the student have difficulty staying on task for a prolonged period, even when the task is at an appropriate level?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "Almost always",
            },
          },
        ],
      },
      {
        id: "q3-19",
        tag: "physical_engagement_level",
        type: "single",
        text: {
          he: "מעורבות בפעילויות גופניות שהוקצו:",
          en: "Engagement in assigned physical activities:",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "השתתפות מצוינת",
              en: "Excellent participation",
            },
          },
          {
            id: "opt2",
            text: {
              he: "השתתפות טובה",
              en: "Good participation",
            },
          },
          {
            id: "opt3",
            text: {
              he: "השתתפות בינונית",
              en: "Moderate participation",
            },
          },
          {
            id: "opt4",
            text: {
              he: "מסרב/ת להשתתף",
              en: "Refuses to participate",
            },
          },
        ],
      },
      {
        id: "q3-20",
        tag: "post_activity_focus",
        type: "single",
        text: {
          he: "האם התלמיד/ה הראה/תה שיפור בריכוז לאחר פעילות גופנית?",
          en: "Does the student show improved concentration after physical activity?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "שיפור משמעותי",
              en: "Significant improvement",
            },
          },
          {
            id: "opt2",
            text: {
              he: "שיפור בינוני",
              en: "Moderate improvement",
            },
          },
          {
            id: "opt3",
            text: {
              he: "שיפור קל",
              en: "Slight improvement",
            },
          },
          {
            id: "opt4",
            text: {
              he: "ללא שיפור",
              en: "No improvement",
            },
          },
        ],
      },
      {
        id: "q3-21",
        tag: "movement_during_class",
        type: "single",
        text: {
          he: "האם הילד מתקשה לשבת במקום לאורך זמן במהלך השיעור?",
          en: "Does the student have difficulty staying seated during class for extended periods?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "Almost always",
            },
          },
        ],
      },
      {
        id: "q3-22",
        tag: "low_energy",
        type: "single",
        text: {
          he: "האם הילד נראה עייף או חסר אנרגיה במהלך שעות הלימודים?",
          en: "Does the student appear tired or lacking energy during school hours?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "Almost always",
            },
          },
        ],
      },
      {
        id: "q3-23",
        tag: "teamwork_challenges",
        type: "single",
        text: {
          he: "האם הילד מתקשה לשתף פעולה במשחקים קבוצתיים ולשמור על כללים (כגון תורות, האזנה להנחיות)?",
          en: "Does the child struggle to cooperate in group games and follow rules (e.g., taking turns, listening to instructions)?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "Almost always",
            },
          },
        ],
      },
      {
        id: "q3-24",
        tag: "sustained_attention_difficulty",
        type: "single",
        text: {
          he: "האם הילד מתחיל/ה משימות אך מפסיק/ה לפני סיום, גם כשהן מותאמות לרמתו?",
          en: "Does the child start tasks but stop before completing them, even when they are appropriate for their level?",
        },
        options: [
          {
            id: "opt1",
            text: {
              he: "כלל לא",
              en: "Not at all",
            },
          },
          {
            id: "opt2",
            text: {
              he: "לפעמים",
              en: "Sometimes",
            },
          },
          {
            id: "opt3",
            text: {
              he: "לעיתים קרובות",
              en: "Often",
            },
          },
          {
            id: "opt4",
            text: {
              he: "כמעט תמיד",
              en: "Almost always",
            },
          },
        ],
      },
    ],
  },
];
