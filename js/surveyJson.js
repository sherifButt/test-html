export const surveyJson6 = {
    "pages": [
     {
      "name": "page1",
      "elements": [
       {
        "type": "matrix",
        "name": "qualities",
        "title": "Please indicate if you agree or disagree with the following statements",
        "columns": [
         {
          "value": 5,
          "text": "Strongly agree"
         },
         {
          "value": 4,
          "text": "Agree"
         },
         {
          "value": 3,
          "text": "Neutral"
         },
         {
          "value": 2,
          "text": "Disagree"
         },
         {
          "value": 1,
          "text": "Strongly disagree"
         }
        ],
        "rows": [
         {
          "value": "affordable",
          "text": "Product is affordable"
         },
         {
          "value": "does-what-it-claims",
          "text": "Product does what it claims"
         },
         {
          "value": "better-than-others",
          "text": "Product is better than other products on the market"
         },
         {
          "value": "easy-to-use",
          "text": "Product is easy to use"
         }
        ]
       },
       {
        "type": "rating",
        "name": "satisfaction-score",
        "title": "How satisfied are you with our product?",
        "minRateDescription": "Not satisfied",
        "maxRateDescription": "Completely satisfied"
       },
       {
        "type": "rating",
        "name": "recommend",
        "visibleIf": "{satisfaction-score} > 3",
        "title": "How likely are you to recommend our product to a friend or co-worker?",
        "minRateDescription": "Will not recommend",
        "maxRateDescription": "I will recommend"
       },
       {
        "type": "comment",
        "name": "suggestions",
        "title": "What would make you more satisfied with our product?"
       }
      ]
     },
     {
      "name": "page2",
      "elements": [
       {
        "type": "radiogroup",
        "name": "price-comparison",
        "title": "Compared to our competitors, do you feel our product is:",
        "choices": [
         "Less expensive",
         "Priced about the same",
         "More expensive",
         "Not sure"
        ]
       },
       {
        "type": "radiogroup",
        "name": "current-price",
        "title": "Do you feel our current price is merited by our product?",
        "choices": [
         {
          "value": "correct",
          "text": "Yes, the price is about right"
         },
         {
          "value": "low",
          "text": "No, the price is too low for your product"
         },
         {
          "value": "high",
          "text": "No, the price is too high for your product"
         }
        ]
       },
       {
        "type": "multipletext",
        "name": "price-limits",
        "title": "What is the highest and lowest price you would pay for a product like ours?",
        "items": [
         {
          "name": "highest",
          "title": "Highest"
         },
         {
          "name": "lowest",
          "title": "Lowest"
         }
        ]
       }
      ]
     },
     {
      "name": "page3",
      "elements": [
       {
        "type": "text",
        "name": "email",
        "title": "Please leave your email address if you would like us to contact you."
       }
      ]
     }
    ],
    "showQuestionNumbers": "off"
   }
export const surveyJson5 = {
    "pages": [
     {
      "name": "page1",
      "elements": [
       {
        "type": "matrix",
        "name": "qualities",
        "title": "Please indicate if you agree or disagree with the following statements",
        "columns": [
         {
          "value": 5,
          "text": "Strongly agree"
         },
         {
          "value": 4,
          "text": "Agree"
         },
         {
          "value": 3,
          "text": "Neutral"
         },
         {
          "value": 2,
          "text": "Disagree"
         },
         {
          "value": 1,
          "text": "Strongly disagree"
         }
        ],
        "rows": [
         {
          "value": "affordable",
          "text": "Product is affordable"
         },
         {
          "value": "does-what-it-claims",
          "text": "Product does what it claims"
         },
         {
          "value": "better-than-others",
          "text": "Product is better than other products on the market"
         },
         {
          "value": "easy-to-use",
          "text": "Product is easy to use"
         }
        ]
       },
       {
        "type": "rating",
        "name": "satisfaction-score",
        "title": "How satisfied are you with our product?",
        "minRateDescription": "Not satisfied",
        "maxRateDescription": "Completely satisfied"
       },
       {
        "type": "rating",
        "name": "recommend",
        "visibleIf": "{satisfaction-score} > 3",
        "title": "How likely are you to recommend our product to a friend or co-worker?",
        "minRateDescription": "Will not recommend",
        "maxRateDescription": "I will recommend"
       },
       {
        "type": "comment",
        "name": "suggestions",
        "title": "What would make you more satisfied with our product?"
       }
      ]
     },
     {
      "name": "page2",
      "elements": [
       {
        "type": "radiogroup",
        "name": "price-comparison",
        "title": "Compared to our competitors, do you feel our product is:",
        "colCount": 2,
        "choices": [
         "Less expensive",
         "Priced about the same",
         "More expensive",
         "Not sure"
        ]
       },
       {
        "type": "radiogroup",
        "name": "current-price",
        "title": "Do you feel our current price is merited by our product?",
        "colCount": 2,
        "choices": [
         {
          "value": "correct",
          "text": "Yes, the price is about right"
         },
         {
          "value": "low",
          "text": "No, the price is too low for your product"
         },
         {
          "value": "high",
          "text": "No, the price is too high for your product"
         }
        ]
       },
       {
        "type": "multipletext",
        "name": "price-limits",
        "title": "What is the highest and lowest price you would pay for a product like ours?",
        "items": [
         {
          "name": "highest",
          "title": "Highest"
         },
         {
          "name": "lowest",
          "title": "Lowest"
         }
        ]
       }
      ]
     },
     {
      "name": "page3",
      "elements": [
       {
        "type": "text",
        "name": "email",
        "title": "Please leave your email address if you would like us to contact you."
       }
      ]
     }
    ],
    "showQuestionNumbers": "off"
   }

export const surveyJson4 = {
    "title": "HOTEL BY THE SEA",
    "description": "1901 Thornridge Cir. Shiloh, Hawaii 81063 +1 (808) 555-0111",
    "logo": "https://api.surveyjs.io/private/Surveys/files?name=cd99ec15-4054-4e75-8e42-9edff605a5d4",
    "logoWidth": "auto",
    "logoHeight": "80",
    "completedHtml": "<div style=\"max-width:688px;text-align:center;margin: 16px auto;\">\n\n<div style=\"padding:0 24px;\">\n<h4>Thank you for choosing us.</h4>\n<br>\n<p>Dear {firstname-for-complete-page}, we're thrilled to have you on board and excited to be a part of your upcoming journey. Your reservation is confirmed, and we can't wait to make your travel experience exceptional.</p>\n</div>\n\n</div>\n",
    "pages": [
     {
      "name": "page1",
      "elements": [
       {
        "type": "text",
        "name": "check-in-date",
        "width": "37%",
        "minWidth": "256px",
        "titleLocation": "hidden",
        "description": "Check-in",
        "descriptionLocation": "underInput",
        "defaultValueExpression": "today()",
        "validators": [
         {
          "type": "expression",
          "text": "Check-in date cannot precede today's date.",
          "expression": "{check-in-date} >= today()"
         }
        ],
        "inputType": "date",
        "placeholder": "Check-in"
       },
       {
        "type": "text",
        "name": "check-out-date",
        "width": "37%",
        "minWidth": "256px",
        "startWithNewLine": false,
        "titleLocation": "hidden",
        "description": "Check-out",
        "descriptionLocation": "underInput",
        "defaultValueExpression": "today(1)",
        "validators": [
         {
          "type": "expression",
          "text": "Invalid date range: check-out date cannot precede check-in date.",
          "expression": "getDate({check-out-date}) >= getDate({check-in-date})"
         }
        ],
        "inputType": "date",
        "placeholder": "Check-out"
       },
       {
        "type": "dropdown",
        "name": "number-of-guests",
        "width": "26%",
        "minWidth": "192px",
        "startWithNewLine": false,
        "titleLocation": "hidden",
        "choices": [ 1, 2, 3, 4, 5, 6, 7, 8, 9,
         { "value": "10", "text": "10+" }
        ],
        "placeholder": "# of guests",
        "allowClear": false
       },
       {
        "type": "dropdown",
        "name": "room-type",
        "useDisplayValuesInDynamicTexts": false,
        "width": "74%",
        "minWidth": "256px",
        "titleLocation": "hidden",
        "choices": [
         {
          "value": "queen",
          "text": "Queen Room"
         },
         {
          "value": "king",
          "text": "King Room"
         },
         {
          "value": "deluxe-king",
          "text": "Deluxe King Room"
         },
         {
          "value": "superior-king",
          "text": "Superior King Room"
         }
        ],
        "placeholder": "Room type",
        "allowClear": false
       },
       {
        "type": "checkbox",
        "name": "non-smoking",
        "width": "26%",
        "minWidth": "192px",
        "startWithNewLine": false,
        "titleLocation": "hidden",
        "choices": [
         {
          "value": "true",
          "text": "Non-smoking"
         }
        ]
       },
       {
        "type": "image",
        "name": "king-room-image",
        "visibleIf": "{room-type} = 'king'",
        "width": "37%",
        "minWidth": "192px",
        "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=31ba1c67-201e-458e-b30b-86b45ba25f40",
        "imageFit": "cover",
        "imageHeight": "224",
        "imageWidth": "1000"
       },
       {
        "type": "html",
        "name": "king-room-description",
        "visibleIf": "{room-type} = 'king'",
        "width": "63%",
        "minWidth": "256px",
        "startWithNewLine": false,
        "html": "<h4 style=\"padding-top:16px\">King Room</h4>\n<p style=\"padding-top:8px;font-size:14px;\">\nOur King Room offers spacious luxury with a king-sized bed for a great night's sleep. Stay connected with complimentary Wi-Fi, refresh in the private bathroom, and enjoy in-room entertainment with a flat-screen TV. Keep your favorite beverages cool in the mini-fridge, and start your day right with a coffee from the in-room coffee maker. The ideal retreat for your travels.\n</p>\n\n"
       },
       {
        "type": "image",
        "name": "deluxe-king-room-image",
        "visibleIf": "{room-type} = 'deluxe-king'",
        "width": "37%",
        "minWidth": "192px",
        "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=4fc633b5-0ac3-48f5-9728-284446e72adf",
        "imageFit": "cover",
        "imageHeight": "224",
        "imageWidth": "1000"
       },
       {
        "type": "html",
        "name": "deluxe-king-room-description",
        "visibleIf": "{room-type} = 'deluxe-king'",
        "width": "63%",
        "minWidth": "256px",
        "startWithNewLine": false,
        "html": "<h4 style=\"padding-top:16px\">Deluxe King Room</h4>\n<p style=\"padding-top:8px;font-size:14px;\">\nElevate your stay in our Deluxe King Room. Experience ultimate comfort on a luxurious king-sized bed. Enjoy the convenience of complimentary Wi-Fi, a private bathroom, and entertainment on a flat-screen TV. Stay refreshed with a well-stocked mini-fridge and coffee maker. With added space and upscale amenities, this room offers a touch of luxury for a truly special stay.\n</p>\n\n"
       },
       {
        "type": "image",
        "name": "queen-room-image",
        "visibleIf": "{room-type} = 'queen'",
        "width": "37%",
        "minWidth": "192px",
        "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=2e2bc916-6f2e-47ff-b321-74b34118a748",
        "imageFit": "cover",
        "imageHeight": "224",
        "imageWidth": "1000"
       },
       {
        "type": "html",
        "name": "queen-room-description",
        "visibleIf": "{room-type} = 'queen'",
        "width": "63%",
        "minWidth": "256px",
        "startWithNewLine": false,
        "html": "<h4 style=\"padding-top:16px\">Queen Room</h4>\n<p style=\"padding-top:8px;font-size:14px;\">\nExperience comfort and convenience in our Queen Room. Unwind on a cozy queen-sized bed, stay connected with complimentary Wi-Fi, and enjoy the convenience of a private bathroom. For your entertainment, there's a flat-screen TV. A mini-fridge and coffee maker are at your disposal for added convenience. Your perfect choice for a relaxing stay.\n</p>\n\n"
       },
       {
        "type": "image",
        "name": "superior-king-room-image",
        "visibleIf": "{room-type} = 'superior-king'",
        "width": "37%",
        "minWidth": "192px",
        "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=e16770dd-818c-4847-8b7f-19ee527420c1",
        "imageFit": "cover",
        "imageHeight": "224",
        "imageWidth": "1000"
       },
       {
        "type": "html",
        "name": "superior-king-room-description",
        "visibleIf": "{room-type} = 'superior-king'",
        "width": "63%",
        "minWidth": "256px",
        "startWithNewLine": false,
        "html": "<h4 style=\"padding-top:16px\">Superior King Room</h4>\n<p style=\"padding-top:8px;font-size:14px;\">\nIndulge in the epitome of luxury in our Superior King Room. Experience ample space and opulence with a king-sized bed. Complimentary Wi-Fi keeps you connected, while the private bathroom and flat-screen TV provide comfort and entertainment. Enjoy the convenience of a well-equipped mini-fridge and coffee maker. This room is the top choice for a superior and memorable stay.\n</p>\n\n"
       },
       {
        "type": "dropdown",
        "name": "number-of-rooms",
        "width": "37%",
        "minWidth": "192px",
        "titleLocation": "hidden",
        "choices": [ 1, 2, 3, 4, 5 ],
        "placeholder": "# of rooms",
        "allowClear": false
       },
       {
        "type": "checkbox",
        "name": "with-pets",
        "width": "63%",
        "minWidth": "256px",
        "startWithNewLine": false,
        "titleLocation": "hidden",
        "choices": [
         {
          "value": "true",
          "text": "I am traveling with pets"
         }
        ]
       },
       {
        "type": "tagbox",
        "name": "extras",
        "width": "100%",
        "minWidth": "256px",
        "titleLocation": "hidden",
        "choices": [
           "Breakfast",
           "Fitness",
           "Parking",
           "Swimming pool",
           "Restaurant",
           "Spa"
        ],
        "placeholder": "Extras"
       },
       {
        "type": "comment",
        "name": "notes",
        "width": "100%",
        "minWidth": "256px",
        "titleLocation": "hidden",
        "placeholder": "Notes...",
        "autoGrow": true,
        "allowResize": false
       }
      ]
     },
     {
      "name": "page2",
      "elements": [
       {
        "type": "text",
        "name": "last-name",
        "width": "64%",
        "minWidth": "192px",
        "titleLocation": "hidden",
        "description": "Must match the passport exactly",
        "descriptionLocation": "underInput",
        "placeholder": "Last name"
       },
       {
        "type": "text",
        "name": "first-name",
        "width": "36%",
        "minWidth": "256px",
        "startWithNewLine": false,
        "titleLocation": "hidden",
        "placeholder": "First name"
       },
       {
        "type": "text",
        "name": "address-line-1",
        "width": "100%",
        "minWidth": "256px",
        "titleLocation": "hidden",
        "descriptionLocation": "underInput",
        "placeholder": "Address line 1"
       },
       {
        "type": "text",
        "name": "address-line-2",
        "width": "100%",
        "minWidth": "256px",
        "titleLocation": "hidden",
        "placeholder": "Address line 2"
       },
       {
        "type": "text",
        "name": "city",
        "width": "36%",
        "minWidth": "256px",
        "titleLocation": "hidden",
        "placeholder": "City"
       },
       {
        "type": "text",
        "name": "zip",
        "width": "28%",
        "minWidth": "192px",
        "startWithNewLine": false,
        "titleLocation": "hidden",
        "placeholder": "Zip code"
       },
       {
        "type": "text",
        "name": "state",
        "width": "36%",
        "minWidth": "256px",
        "startWithNewLine": false,
        "titleLocation": "hidden",
        "placeholder": "State"
       },
       {
        "type": "dropdown",
        "name": "country",
        "width": "36%",
        "minWidth": "256px",
        "titleLocation": "hidden",
        "choicesByUrl": {
         "url": "https://surveyjs.io/api/CountriesExample"
        },
        "placeholder": "Country",
        "allowClear": false
       },
       {
        "type": "text",
        "name": "phone",
        "width": "64%",
        "minWidth": "192px",
        "startWithNewLine": false,
        "titleLocation": "hidden",
        "description": "Example: +1 (555) 777-55-22",
        "descriptionLocation": "underInput",
        "placeholder": "Phone"
       }
      ]
     }
    ],
    "calculatedValues": [{
       "name": "firstname-for-complete-page",
       "expression": "iif({first-name} notempty, {first-name}, guests)"
    }],
    "showPrevButton": false,
    "showQuestionNumbers": "off",
    "questionErrorLocation": "bottom",
    "pagePrevText": "Booking Details",
    "pageNextText": "Traveler Info ➝",
    "completeText": "Book Now",
    "widthMode": "static",
    "width": "904",
    "fitToContainer": true
   }
export const surveyJson3 = {
    "title": "Year 12 Final Exams Feedback",
    "hideNumber": true,
    "completedHtml": "<h4>Thank you for your feedback.</h4>",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "mathDifficulty",
                    "title": "How difficult did you find the Math final exam?",
                    "description": "Rate the difficulty level of the Math exam.",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        "Very Easy",
                        "Easy",
                        "Moderate",
                        "Difficult",
                        "Very Difficult"
                    ],
                    "colCount": 2,
                    "nextButtonVisible": true,
                }
            ]
        },
        {
            "name": "page2",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "mathDifficulty",
                    "title": "How difficult did you find the Math final exam?",
                    "description": "Rate the difficulty level of the Math exam.",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        "Very Easy",
                        "Easy",
                    ],
                    "colCount": 2,
                    "nextButtonVisible": true,
                }
            ]
        },
       
        
    ],
    "goNextPageAutomatic": true,
    "startSurveyText": "Start",
    "maxTimeToFinish": 600
}
export const surveyJson2 = {
    "title": "Year 12 Final Exams Feedback",
    "hideNumber": true,
    "completedHtml": "<h4>Thank you for your feedback.</h4>",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "mathDifficulty",
                    "title": "How difficult did you find the Math final exam?",
                    "description": "Rate the difficulty level of the Math exam.",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        "Very Easy",
                        "Easy",
                        "Moderate",
                        "Difficult",
                        "Very Difficult"
                    ],
                    "colCount": 2,
                    "nextButtonVisible": true,
                }
            ]
        },
        {
            "name": "page2",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "chemistryDifficulty",
                    "title": "How difficult did you find the Chemistry final exam?",
                    "description": "Rate the difficulty level of the Chemistry exam.",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        "Very Easy",
                        "Easy",
                        "Moderate",
                        "Difficult",
                        "Very Difficult"
                    ],
                    "colCount": 2,
                    "nextButtonVisible": true,
                }
            ]
        },
        {
            "name": "page3",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "biologyDifficulty",
                    "title": "How difficult did you find the Biology final exam?",
                    "description": "Rate the difficulty level of the Biology exam.",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        "Very Easy",
                        "Easy",
                        "Moderate",
                        "Difficult",
                        "Very Difficult"
                    ],
                    "colCount": 2,
                    "nextButtonVisible": false,
                }
            ]
        },
        {
            "name": "page4",
            "elements": [
                {
                    "type": "comment",
                    "name": "mathFeedback",
                    "title": "Please provide any additional feedback or comments about the Math final exam.",
                    "hideNumber": true
                }
            ]
        },
        {
            "name": "page5",
            "elements": [
                {
                    "type": "comment",
                    "name": "chemistryFeedback",
                    "title": "Please provide any additional feedback or comments about the Chemistry final exam.",
                    "hideNumber": true
                }
            ]
        },
        {
            "name": "page6",
            "elements": [
                {
                    "type": "comment",
                    "name": "biologyFeedback",
                    "title": "Please provide any additional feedback or comments about the Biology final exam.",
                    "hideNumber": true
                }
            ]
        },
        {
            "name": "page7",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "examPreparation",
                    "title": "Do you feel the teaching and revision sessions prepared you well for the exams?",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        "Yes",
                        "No"
                    ],
                    "colCount": 2
                }
            ]
        },
        {
            "name": "page8",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "fairness",
                    "title": "Do you think the exams were fair?",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        "Yes",
                        "No"
                    ],
                    "colCount": 2
                }
            ]
        },
        {
            "name": "page9",
            "elements": [
                {
                    "type": "comment",
                    "name": "generalFeedback",
                    "title": "Please provide any additional comments or suggestions regarding the exams.",
                    "hideNumber": true
                }
            ]
        }
    ],
    "goNextPageAutomatic": true,
    "startSurveyText": "Start",
    "maxTimeToFinish": 600
}



export const surveyJson = {
    "title": "Hajj 2024 Inquiry",
    "hideNumber": true,
    "completedHtml": "<h4>Thank you for your time.</h4>",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "umrahPlanning",
                    "title": "Planning to go to 🕋 Umrah in the next 3 months?",
                    "description": "This will help us understand your travel plans better.",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        "Yes",
                        "No"
                    ],
                    "colCount": 2
                }
            ]
        },
        {
            "name": "page2",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "hajjExperience",
                    "title": "Have you performed 🕋 Hajj before?",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        "Yes",
                        "No"
                    ],
                    "colCount": 2,
                    "visibleIf": "{umrahPlanning} == 'Yes'"
                }
            ]
        },
        {
            "name": "page3",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "groupTravel",
                    "title": "Will you be 🛫 traveling with a group?",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        "Yes",
                        "No"
                    ],
                    "colCount": 2,
                    "visibleIf": "{umrahPlanning} == 'Yes'"
                }
            ]
        },
        {
            "name": "page4",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "specialNeeds",
                    "title": "Do you have any special needs ⚠️ or requirements?",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        "Yes",
                        "No"
                    ],
                    "colCount": 2,
                    "visibleIf": "{umrahPlanning} == 'Yes'"
                }
            ]
        },
        {
            "name": "page5",
            "elements": [
                {
                    "type": "comment",
                    "name": "specialNeedsDetails",
                    "title": "If yes, please specify",
                    "hideNumber": true,
                    "placeholder": "Write your special needs ...",
                    "visibleIf": "{specialNeeds} == 'Yes'"
                }
            ]
        },
        {
            "name": "page6",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "packagePreference",
                    "title": "Which type of Hajj package are you interested in?",
                    "hideNumber": true,
                    "isRequired": true,
                    "description": "Select the package that best suits your needs.",
                    "choices": [
                        "Economy",
                        "Standard",
                        "Deluxe"
                    ],
                    "colCount": 3,
                    "visibleIf": "{umrahPlanning} == 'Yes'"
                }
            ]
        },
        {
            "name": "page7",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "vaccinationStatus",
                    "title": "Are you fully 💉 vaccinated against COVID-19?",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        "Yes",
                        "No"
                    ],
                    "colCount": 2,
                    "visibleIf": "{umrahPlanning} == 'Yes'"
                }
            ]
        },
        {
            "name": "page8",
            "elements": [
                {
                    "type": "text",
                    "name": "passportNumber",
                    "title": "Passport Number",
                    "hideNumber": true,
                    "description": "Please enter your 🛂 passport number for verification purposes.",
                    "isRequired": true,
                    "visibleIf": "{umrahPlanning} == 'Yes'",
                    "placeholder": "67844AD4U"
                }
            ]
        },
        {
            "name": "page9",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "contactOffers",
                    "title": "Would you like us to ☎️ contact you about Hajj and Umrah offers?",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        "Yes",
                        "No"
                    ],
                    "colCount": 2,
                    "visibleIf": "{umrahPlanning} == 'No'"
                }
            ]
        },
        {
            "name": "page10",
            "elements": [
                {
                    "type": "text",
                    "name": "name",
                    "title": "Name",
                    "hideNumber": true,
                    "description": "Please enter your full name.",
                    "isRequired": true
                }
            ],
            "visibleIf": "{umrahPlanning} == 'Yes' or {contactOffers} == 'Yes'"
        },
        {
            "name": "page11",
            "elements": [
                {
                    "type": "text",
                    "name": "email",
                    "description": "We will send you the offers to this email. Please ensure it is correct.",
                    "title": "Email",
                    "hideNumber": true,
                    "inputType": "email",
                    "isRequired": true,
                    "placeholder": "youremail@domain.com"
                }
            ],
            "visibleIf": "{umrahPlanning} == 'Yes' or {contactOffers} == 'Yes'"
        },
        {
            "name": "page12",
            "elements": [
                {
                    "type": "text",
                    "name": "phone",
                    "title": "Phone Number",
                    "hideNumber": true,
                    "description": "Please provide your phone number for further communication.",
                    "inputType": "tel",
                    "isRequired": true,
                    "placeholder": "07563542681"
                }
            ],
            "visibleIf": "{umrahPlanning} == 'Yes' or {contactOffers} == 'Yes'"
        },
        {
            "name": "page13",
            "elements": [
                {
                    "type": "comment",
                    "name": "additionalNote",
                    "title": "Thank you for your time. Any particular note before leaving?",
                    "hideNumber": true,
                    "visibleIf": "{contactOffers} == 'No'",
                    "placeholder": "Please write something.."
                }
            ]
        },
        // {
        //     "name": "page14",
        //     "elements": [
        //         {
        //             "type": "html",
        //             "name": "gdprConsent",
        //             "html": "<span><i class=\"fa fa-bath scale:110\" aria-hidden=\"true\"></i></span><p><strong>GDPR Consent:</strong> By completing this survey, you consent to the collection and processing of your personal data in accordance with our Privacy Policy. Your data will be used solely for the purpose of improving our services and will not be shared with third parties without your explicit consent.</p>"
        //         }
        //     ]
        // },
        // {
        //     "name": "page15",
        //     "elements": [
        //         {
        //             "type": "html",
        //             "name": "emailSecurity",
        //             "html": "<p><strong>Email Security:</strong> Please note that while we take all reasonable precautions to protect your data, email communications may not be completely secure. We recommend not including sensitive information in your emails to us.</p>"
        //         }
        //     ]
        // }
    ],
    "goNextPageAutomatic": true,
    "startSurveyText": "Start",
    "maxTimeToFinish": 600,
    
}
