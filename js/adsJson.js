const ads = [
    {
        "logo": {
            "icon": "fa-brands fa-octopus-deploy",
            "firstWord": "octopus",
            "secondWord": "energy"
        },
        "headline": "Cheaper Energy This Summer",
        "text": ["Take our quick survey to see if you can save on energy costs with Octopus Energy this summer. Complete the survey and get a free guide with energy-saving tips!", "Take our quick survey to see if you can save on energy costs with Octopus Energy this summer.", "Take our quick survey to see if you can save on energy costs."],
        "tags": "#SaveMoney #GreenEnergy",
        "cta": "Take the Survey"
    },
    {
        "logo": {
            "icon": "fa-brands fa-octopus-deploy",
            "firstWord": "octopus",
            "secondWord": "energy"
        },
        "headline": "Solar Panel Grants",
        "text": ["Discover if you’re eligible for solar panel grants and save on your energy bills. Fill out our survey and get a guide on maximizing your energy savings.", "Discover if you’re eligible for solar panel grants and save on your energy bills."],
        "tags": "#SolarEnergy #EcoFriendly",
        "cta": "Start Now"
    },
    {
        "logo": {
            "icon": "fa-brands fa-octopus-deploy",
            "firstWord": "octopus",
            "secondWord": "energy"
        },
        "headline": "Save on Energy Bills",
        "text": ["Complete our survey to see if your area qualifies for cheaper energy rates with Octopus Energy. Get a free energy-saving guide just for participating!", "Complete our survey to see if your area qualifies for cheaper energy rates with Octopus Energy."],
        "tags": "#EnergySavings #SwitchAndSave",
        "cta": "Learn More"
    }
];

const images = [
    "img/woman.png",
    "img/energy_savings_3.webp",
    "img/car.png",
    "img/car3.png",
    "img/energy_savings_3.png",
    "img/google-ads-responsive-ad-example.png.webp",
    "img/umbrella.png"];

const bannerSettings = [
    {
        "size": "480x120",
        "settings": {
            "elements": {
                "logoIcon": true,
                "image": true,
                "headline": true,
                "text": false,
                "tags": false,
                "cta": true,
                "svgWave": true
            },
            "layout": {
                "logoLayout": "flex-row",
                "ctaStyle": "default",
                "imageOpacity": 1,
                "svgOneOpacity": 0.53,
                "svgTwoOpacity": 1,
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "25%",
                "titleSize": "1.5rem",
                "bodySize": "1rem",
                "switchPosition": false,
                "textLength": 0
            }
        }
    },
    {
        "size": "300x250",
        "settings": {
            "elements": {
                "logoIcon": true,
                "image": true,
                "headline": true,
                "text": true,
                "tags": true,
                "cta": true,
                "svgWave": true
            },
            "layout": {
                "logoLayout": "flex-col",
                "ctaStyle": "default",
                "imageOpacity": 1,
                "svgOneOpacity": 0.53,
                "svgTwoOpacity": 1,
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "50%",
                "titleSize": "1.25rem",
                "bodySize": "1rem",
                "switchPosition": true,
                "textLength": 2 || 0
            }
        }
    },
    {
        "size": "160x600",
        "settings": {
            "elements": {
                "logoIcon": true,
                "image": true,
                "headline": true,
                "text": true,
                "tags": true,
                "cta": true,
                "svgWave": true
            },
            "layout": {
                "logoLayout": "flex-row",
                "ctaStyle": "circle",
                "imageOpacity": 1,
                "svgOneOpacity": 0.53,
                "svgTwoOpacity": 1,
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "100%",
                "titleSize": "1.5rem",
                "bodySize": "1rem",
                "switchPosition": false,
                "textLength": 0
            }
        }
    },
    {
        "size": "300x250-text",
        "settings": {
            "elements": {
                "logoIcon": true,
                "image": false,
                "headline": true,
                "text": true,
                "tags": true,
                "cta": true,
                "svgWave": false
            },
            "layout": {
                "logoLayout": "flex-row",
                "ctaStyle": "default",
                "imageOpacity": 1,
                "svgOneOpacity": 0,
                "svgTwoOpacity": 0,
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "0%",
                "titleSize": "1.5rem",
                "bodySize": "1rem",
                "switchPosition": false,
                "textLength": 0
            }
        }
    },
    {
        "size": "728x90",
        "settings": {
            "elements": {
                "logoIcon": true,
                "image": true,
                "headline": true,
                "text": false,
                "tags": true,
                "cta": true,
                "svgWave": true
            },
            "layout": {
                "logoLayout": "flex-row",
                "ctaStyle": "circle",
                "imageOpacity": 1,
                "svgOneOpacity": 0.53,
                "svgTwoOpacity": 1,
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "33%",
                "titleSize": "1.25rem",
                "bodySize": "1rem",
                "switchPosition": false,
                "textLength": 0
            }
        }
    },
    {
        "size": "1200x628",
        "settings": {
            "elements": {
                "logoIcon": true,
                "image": true,
                "headline": true,
                "text": true,
                "tags": true,
                "cta": true,
                "svgWave": true
            },
            "layout": {
                "logoLayout": "flex-row",
                "ctaStyle": "default",
                "imageOpacity": 1,
                "svgOneOpacity": 0.53,
                "svgTwoOpacity": 1,
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "33%",
                "titleSize": "2rem",
                "bodySize": "1.25rem",
                "switchPosition": false,
                "textLength": 0
            }
        }
    },
    {
        "size": "1200x628-2",
        "settings": {
            "elements": {
                "logoIcon": true,
                "image": true,
                "headline": true,
                "text": true,
                "tags": true,
                "cta": true,
                "svgWave": true
            },
            "layout": {
                "logoLayout": "flex-row",
                "ctaStyle": "default",
                "imageOpacity": 1,
                "svgOneOpacity": 0.53,
                "svgTwoOpacity": 1,
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "50%",
                "titleSize": "2rem",
                "bodySize": "1.25rem",
                "switchPosition": false,
                "textLength": 0
            }
        }
    }
]

