
let animationTemplates = [
    {
        "id": "default",
        "name": "Default",
        "entry": {
            "settings": {
                "duration": 0,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "fade-in",
                "cta": "fade-in",
                "tags": "fade-in",
                "text": "fade-in",
                "headline": "fade-in",
                "logoIcon": "fade-in",
                "pathTwo": "hidden-element",
                "pathOne": "hidden-element",
                "logo-title": "fade-in",
                "textContainer": "fade-in",
                "backdrop": "fade-in",
                "frontdrop": "fade-in",
                "backbanner": "fade-in"
            }
        },
        "exit": {
            "settings": {
                "duration": 0,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "fade-out",
                "cta": "fade-out",
                "tags": "fade-out",
                "text": "fade-out",
                "headline": "fade-out",
                "logoIcon": "fade-out",
                "pathTwo": "hidden-element",
                "pathOne": "hidden-element",
                "logo-title": "fade-out",
                "textContainer": "fade-out",
                "backdrop": "fade-out",
                "frontdrop": "fade-out",
                "backbanner": "fade-out"
            }
        }
    },
    {
        "id": "dramatic-entry",
        "name": "Dramatic Entry",
        "entry": {
            "settings": {
                "duration": 4000,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "zoom-in-sm-to-twist",
                "cta": "fade-in",
                "tags": "fade-in",
                "text": "fade-in",
                "headline": "fade-in",
                "logoIcon": "fade-in",
                "pathTwo": "hidden-element",
                "pathOne": "hidden-element",
                "logo-title": "zoom-in-sm-to-twist",
                "textContainer": "zoom-in-md",
                "backdrop": "zoom-out-lg-to-stay",
                "filter": "zoom-in-md",
                "frontdrop": "zoom-out-md-to-stay",
                "backbanner": "fade-in"
            }
        },
        "exit": {
            "settings": {
                "duration": 2000,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "zoom-out-sm-to-twist",
                "cta": "fade-out",
                "tags": "fade-out",
                "text": "fade-out",
                "headline": "fade-out",
                "logoIcon": "fade-out",
                "pathTwo": "hidden-element",
                "pathOne": "hidden-element",
                "logo-title": "fade-out",
                "textContainer": "zoom-out-sm",
                "backdrop": "zoom-in-lg-to-go",
                "filter": "zoom-out-md",
                "frontdrop": "zoom-in-md-to-go",
                "backbanner": "fade-out"
            }
        }
    },
    {
        "id": "fade-in",
        "name": "Fade In",
        "entry": {
            "settings": {
                "duration": 2000,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "fade-in",
                "cta": "fade-in",
                "tags": "fade-in",
                "text": "fade-in",
                "headline": "fade-in",
                "logoIcon": "fade-in",
                "pathTwo": "hidden-element",
                "pathOne": "hidden-element",
                "logo-title": "fade-in",
                "textContainer": "fade-in",
                "backdrop": "fade-in",
                "filter": "fade-in",
                "frontdrop": "fade-in",
                "backbanner": "fade-in"
            }
        },
        "exit": {
            "settings": {
                "duration": 1000,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "fade-out",
                "cta": "fade-out",
                "tags": "fade-out",
                "text": "fade-out",
                "headline": "fade-out",
                "logoIcon": "fade-out",
                "pathTwo": "hidden-element",
                "pathOne": "hidden-element",
                "logo-title": "fade-out",
                "textContainer": "fade-out",
                "backdrop": "fade-out",
                "filter": "fade-out",
                "frontdrop": "fade-out",
                "backbanner": "fade-out"
            }
        }
    },
    {
        "id": "only-text",
        "name": "Only Text",
        "entry": {
            "settings": {
                "duration": 1000,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "none",
                "cta": "none",
                "tags": "none",
                "text": "bounce-from-left",
                "headline": "bounce-from-left",
                "logoIcon": "none",
                "pathTwo": "none",
                "pathOne": "none",
                "logo-title": "none",
                "textContainer": "none",
                "backdrop": "none",
                "filter": "none",
                "frontdrop": "none",
                "backbanner": "none"
            }
        },
        "exit": {
            "settings": {
                "duration": 1000,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "none",
                "cta": "none",
                "tags": "none",
                "text": "bounce-to-left",
                "headline": "bounce-to-left",
                "logoIcon": "none",
                "pathTwo": "none",
                "pathOne": "none",
                "logo-title": "none",
                "textContainer": "none",
                "backdrop": "none",
                "filter": "none",
                "frontdrop": "none",
                "backbanner": "none"
            }
        }
    },
    {
        "id": "slide-from-left",
        "name": "Slide From Left",
        "entry": {
            "settings": {
                "duration": 2000,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "slide-from-left",
                "cta": "slide-from-left",
                "tags": "slide-from-left",
                "text": "slide-from-left",
                "headline": "slide-from-left",
                "logoIcon": "slide-from-left",
                "pathTwo": "slide-from-bottom",
                "pathOne": "slide-from-bottom",
                "logo-title": "slide-from-left",
                "textContainer": "slide-from-left",
                "backdrop": "fade-in",
                "filter": "fade-in",
                "frontdrop": "fade-in",
                "backbanner": "fade-in"

            }
        },
        "exit": {
            "settings": {
                "duration": 2000,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "slide-to-left",
                "cta": "slide-to-left",
                "tags": "slide-to-left",
                "text": "slide-to-left",
                "headline": "slide-to-left",
                "logoIcon": "slide-to-left",
                "pathTwo": "slide-to-bottom",
                "pathOne": "slide-to-bottom",
                "logo-title": "slide-to-left",
                "textContainer": "slide-to-left",
                "backdrop": "fade-out",
                "filter": "fade-out",
                "frontdrop": "fade-out",
                "backbanner": "fade-out"
            }
        }
    },
    {
        "id": "slide-from-left-to-right",
        "name": "Slide From Left",
        "entry": {
            "settings": {
                "duration": 2000,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "slide-from-left",
                "cta": "slide-from-left",
                "tags": "slide-from-left",
                "text": "slide-from-left",
                "headline": "slide-from-left",
                "logoIcon": "slide-from-left",
                "pathTwo": "slide-from-bottom",
                "pathOne": "slide-from-bottom",
                "logo-title": "slide-from-left",
                "textContainer": "slide-from-left",
                "backdrop": "fade-in",
                "filter": "fade-in",
                "frontdrop": "fade-in",
                "backbanner": "fade-in"
            }
        },
        "exit": {
            "settings": {
                "duration": 2000,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "slide-to-right",
                "cta": "slide-to-right",
                "tags": "slide-to-right",
                "text": "slide-to-right",
                "headline": "slide-to-right",
                "logoIcon": "slide-to-right",
                "pathTwo": "slide-to-bottom",
                "pathOne": "slide-to-bottom",
                "logo-title": "slide-to-right",
                "textContainer": "slide-to-right",
                "backdrop": "fade-out",
                "filter": "fade-out",
                "frontdrop": "fade-out",
                "backbanner": "fade-out"
            }
        }
    },
    {
        "id": "slide-from-left-some-to-right",
        "name": "slide-from-left",
        "entry": {
            "settings": {
                "duration": 2000,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "slide-from-left",
                "cta": "slide-from-left",
                "tags": "slide-from-left",
                "text": "slide-from-left",
                "headline": "slide-from-left",
                "logoIcon": "slide-from-left",
                "pathTwo": "slide-from-bottom",
                "pathOne": "slide-from-bottom",
                "logo-title": "slide-from-left",
                "textContainer": "slide-from-left",
                "backdrop": "fade-in",
                "filter": "fade-in",
                "frontdrop": "fade-in",
                "backbanner": "fade-in"
            }
        },
        "exit": {
            "settings": {
                "duration": 2000,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "slide-to-left",
                "cta": "slide-to-right",
                "tags": "slide-to-right",
                "text": "slide-to-right",
                "headline": "slide-to-right",
                "logoIcon": "slide-to-left",
                "pathTwo": "slide-to-bottom",
                "pathOne": "slide-to-bottom",
                "logo-title": "slide-to-left",
                "textContainer": "slide-to-right",
                "backdrop": "fade-out",
                "backbanner": "fade-out"
            }
        }
    },
    {
        "id": "slide-from-right",
        "name": "slide-from-right",
        "entry": {
            "settings": {
                "duration": 500,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "slide-from-right",
                "cta": "slide-from-right",
                "tags": "slide-from-right",
                "text": "slide-from-right",
                "headline": "slide-from-right",
                "logoIcon": "slide-from-right",
                "pathTwo": "slide-from-bottom",
                "pathOne": "slide-from-bottom",
                "logo-title": "slide-from-right",
                "textContainer": "slide-from-right",
                "backdrop": "fade-in",
                "filter": "fade-in",
                "frontdrop": "fade-in",
                "backbanner": "slide-from-right"
            }
        },
        "exit": {
            "settings": {
                "duration": 500,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "slide-to-right",
                "cta": "slide-to-right",
                "tags": "slide-to-right",
                "text": "slide-to-right",
                "headline": "slide-to-right",
                "logoIcon": "slide-to-right",
                "pathTwo": "slide-to-bottom",
                "pathOne": "slide-to-bottom",
                "logo-title": "slide-to-right",
                "textContainer": "slide-to-right",
                "backdrop": "fade-out",
                "backbanner": "slide-to-right"
            }
        }
    },
    {
        "id": "slide-from-top",
        "name": "slide-from-top",
        "entry": {
            "settings": {
                "duration": 500,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "slide-from-top",
                "cta": "slide-from-top",
                "tags": "slide-from-top",
                "text": "slide-from-top",
                "headline": "slide-from-top",
                "logoIcon": "slide-from-top",
                "pathTwo": "slide-from-bottom",
                "pathOne": "slide-from-bottom",
                "logo-title": "slide-from-top",
                "textContainer": "slide-from-top",
                "backdrop": "fade-in",
                "backbanner": "slide-from-top"
            }
        },
        "exit": {
            "settings": {
                "duration": 500,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "slide-to-top",
                "cta": "slide-to-top",
                "tags": "slide-to-top",
                "text": "slide-to-top",
                "headline": "slide-to-top",
                "logoIcon": "slide-to-top",
                "pathTwo": "slide-to-bottom",
                "pathOne": "slide-to-bottom",
                "logo-title": "slide-to-top",
                "textContainer": "slide-to-top",
                "backdrop": "fade-out",
                "backbanner": "slide-to-top"
            }
        }
    },
    {
        "id": "slide-from-bottom",
        "name": "slide-from-bottom",
        "entry": {
            "settings": {
                "duration": 500,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "slide-from-bottom",
                "cta": "slide-from-bottom",
                "tags": "slide-from-bottom",
                "text": "slide-from-bottom",
                "headline": "slide-from-bottom",
                "logoIcon": "slide-from-bottom",
                "pathTwo": "slide-from-bottom",
                "pathOne": "slide-from-bottom",
                "logo-title": "slide-from-bottom",
                "textContainer": "slide-from-bottom",
                "backdrop": "fade-in",
                "backbanner": "slide-from-bottom"
            }
        },
        "exit": {
            "settings": {
                "duration": 500,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "slide-to-bottom",
                "cta": "slide-to-bottom",
                "tags": "slide-to-bottom",
                "text": "slide-to-bottom",
                "headline": "slide-to-bottom",
                "logoIcon": "slide-to-bottom",
                "pathTwo": "slide-to-bottom",
                "pathOne": "slide-to-bottom",
                "logo-title": "slide-to-bottom",
                "textContainer": "slide-to-bottom",
                "backdrop": "fade-out",
                "backbanner": "slide-to-bottom"
            }
        }
    },
    {
        "id": "hidden-element",
        "name": "hidden-element",
        "entry": {
            "settings": {
                "duration": 500,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "hidden-element",
                "cta": "hidden-element",
                "tags": "hidden-element",
                "text": "hidden-element",
                "headline": "hidden-element",
                "logoIcon": "hidden-element",
                "pathTwo": "hidden-element",
                "pathOne": "hidden-element",
                "logo-title": "hidden-element",
                "textContainer": "hidden-element",
                "backdrop": "fade-in",
                "backbanner": "hidden-element"
            }
        },
        "exit": {
            "settings": {
                "duration": 500,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "hidden-element",
                "cta": "hidden-element",
                "tags": "hidden-element",
                "text": "hidden-element",
                "headline": "hidden-element",
                "logoIcon": "hidden-element",
                "pathTwo": "hidden-element",
                "pathOne": "hidden-element",
                "logo-title": "hidden-element",
                "textContainer": "hidden-element",
                "backdrop": "fade-out",
                "backbanner": "hidden-element"
            }
        }
    },
    {
        "id": "cross-slide",
        "name": "cross-slide",
        "entry": {
            "settings": {
                "duration": 500,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "slide-from-left",
                "cta": "slide-from-right",
                "tags": "slide-from-right",
                "text": "slide-from-right",
                "headline": "slide-from-right",
                "logoIcon": "slide-from-left",
                "pathTwo": "slide-from-bottom",
                "pathOne": "slide-from-bottom",
                "logo-title": "slide-from-left",
                "textContainer": "slide-from-right",
                "backdrop": "fade-in",
                "backbanner": "slide-from-right"
            }
        },
        "exit": {
            "settings": {
                "duration": 1500,
                "delay": 0,
                "easing": "ease-in-out"
            },
            "elements": {
                "image": "slide-to-left",
                "cta": "slide-to-right",
                "tags": "slide-to-right",
                "text": "slide-to-right",
                "headline": "slide-to-right",
                "logoIcon": "slide-to-left",
                "pathTwo": "slide-to-bottom",
                "pathOne": "slide-to-bottom",
                "logo-title": "slide-to-left",
                "textContainer": "slide-to-right",
                "backdrop": "fade-out",
                "backbanner": "slide-to-right"

            }
        }
    }
]
const bannerTemplates = [
    {
        "id": "480x120",
        "name": "480x120",
        "width": 480,
        "height": 120,
        "path": "/img/banners/480x120/",
        "direction": "horizontal",
        "description": "this is a description for the banner template",
        "images": [
            "banner-01.jpg",
            "banner-02.jpg",
            "banner-03.jpg",
            "banner-04.jpg",
            "banner-05.jpg",
            "banner-06.jpg",
            "banner-07.jpg",
            "banner-08.jpg",
            "banner-09.jpg",
            "banner-10.jpg"
        ],
        "tags": ["#banner", "#480x120", "#marketing"],
        "category": "marketing",
        "type": "banner",
        "date": "2022-01-01",
        "author": "john doe",

        "cta": "Learn More",
        "ctaUrl": "#",
        "logo": {
            "icon": "fa-brands fa-octopus-deploy",
            "firstWord": "octopus",
            "secondWord": "energy"
        },
        "animation": {
            "isLooped": false,
            "isExitAnimated": true,
            "isEntryAnimated": true,
            "template": "fade-in"
        }
    },
]

let settingsTemplates = [
    {
        "id": "default",
        "name": "Default",
        "description": "Default template with all possible settings",
        "img": "/img/default-template.gif",
        "width": 480,
        "height": 120,
        "date": "2023-07-29",
        "author": "System",
        "elements": {
            "logoIcon": true,
            "image": true,
            "headline": true,
            "text": true,
            "tags": true,
            "cta": true,
            "svgWave": true,
            "textContainer": true,
            "backdrop": true,
            "filter": true,
            "frontdrop": true,
            "backbanner": true,
            "pathOne": true,
            "pathTwo": true,
            "logo-title": true
        },
        "layout": {
            "logoLayout": "flex-row",
            "ctaStyle": "default",
            "imageOpacity": "1",
            "svgOneOpacity": "1",
            "svgTwoOpacity": "1",
            "logoRotation": 0,
            "backgroundImage": false,
            "imageSize": "27%",
            "titleSize": "1.2rem",
            "bodySize": "1rem",
            "switchPosition": false,
            "imageZIndex": 29,
            "textLength": 0,
            "zIndex": {
                "logoIcon": 10,
                "image": 20,
                "headline": 30,
                "text": 40,
                "tags": 50,
                "cta": 60,
                "svgWave": 5,
                "textContainer": 15,
                "backdrop": 1,
                "filter": 2,
                "frontdrop": 3,
                "backbanner": 0,
                "pathOne": 6,
                "pathTwo": 7,
                "logo-title": 11
            },
            "scales": {
                "logoIcon": 1,
                "image": 1,
                "headline": 1,
                "text": 1,
                "tags": 1,
                "cta": 1,
                "svgWave": 1,
                "textContainer": 1,
                "backdrop": 1,
                "filter": 1,
                "frontdrop": 1,
                "backbanner": 1,
                "pathOne": 1,
                "pathTwo": 1,
                "logo-title": 1
            },
            "positions": {
                "logoIcon": { "top": "0px", "left": "0px" },
                "image": { "top": "0px", "left": "125px" },
                "headline": { "top": "30px", "left": "0px" },
                "text": { "top": "60px", "left": "0px" },
                "tags": { "top": "-25px", "left": "0px" },
                "cta": { "top": "-45px", "left": "230px" },
                "svgWave": { "top": "0px", "left": "0px" },
                "textContainer": { "top": "0px", "left": "0px" },
                "backdrop": { "top": "0px", "left": "0px" },
                "filter": { "top": "0px", "left": "0px" },
                "frontdrop": { "top": "0px", "left": "0px" },
                "backbanner": { "top": "0px", "left": "0px" },
                "pathOne": { "top": "0px", "left": "0px" },
                "pathTwo": { "top": "0px", "left": "0px" },
                "logo-title": { "top": "0px", "left": "0px" }
            },
            "colors": {
                "logoIcon": "#000000",
                "image": "#FFFFFF",
                "headline": "#000000",
                "text": "#000000",
                "tags": "#000000",
                "cta": "#FFFFFF",
                "svgWave": "#000000",
                "textContainer": "#FFFFFF",
                "backdrop": "#FFFFFF",
                "filter": "#FFFFFF",
                "frontdrop": "#FFFFFF",
                "backbanner": "#FFFFFF",
                "pathOne": "#000000",
                "pathTwo": "#000000",
                "logo-title": "#000000"
            },
            "opacities": {
                "logoIcon": 1,
                "image": 1,
                "headline": 1,
                "text": 1,
                "tags": 1,
                "cta": 1,
                "svgWave": 1,
                "textContainer": 1,
                "backdrop": 1,
                "filter": 1,
                "frontdrop": 1,
                "backbanner": 1,
                "pathOne": 1,
                "pathTwo": 1,
                "logo-title": 1
            },
            "rotations": {
                "logoIcon": 0,
                "image": 0,
                "headline": 0,
                "text": 0,
                "tags": 0,
                "cta": 0,
                "svgWave": 0,
                "textContainer": 0,
                "backdrop": 0,
                "filter": 0,
                "frontdrop": 0,
                "backbanner": 0,
                "pathOne": 0,
                "pathTwo": 0,
                "logo-title": 0
            },
            "filters": {
                "logoIcon": "none",
                "image": "none",
                "headline": "none",
                "text": "none",
                "tags": "none",
                "cta": "none",
                "svgWave": "none",
                "textContainer": "none",
                "backdrop": "none",
                "filter": "none",
                "frontdrop": "none",
                "backbanner": "none",
                "pathOne": "none",
                "pathTwo": "none",
                "logo-title": "none"
            }
        }
    }, {
        "id": "establishing-shot",
        "name": "Establishing shot",
        "description": "this is a description for the settings template",
        "img": "/img/establishing-shot.gif",
        "width": 480,
        "height": 120,
        "date": "2022-01-01",
        "author": "john doe",

        "elements": {
            "logoIcon": true,
            "image": true,
            "headline": true,
            "text": false,
            "tags": true,
            "cta": true,
            "svgWave": true,
            "textContainer": true,
            "backdrop": false,
            "filter": false,
            "backbanner": false
        },
        "layout": {
            "logoLayout": "flex-row",
            "ctaStyle": "circle",
            "imageOpacity": "1",
            "svgOneOpacity": "1",
            "svgTwoOpacity": "1",
            "logoRotation": 0,
            "backgroundImage": false,
            "imageSize": "27%",
            "titleSize": "1.2rem",
            "bodySize": "1rem",
            "switchPosition": false,
            "imageZIndex": 29,
            "textLength": 0,
            "zIndex": {
                "backdropimage": 10
            },
            "scales": {
                "backdropimage": 0.9900000000000001
            },
            "positions": {
                "logo": {
                    "top": "0px",
                    "left": "-5px"
                },
                "headline": {
                    "top": "30px",
                    "left": "0px"
                },
                "image": {
                    "top": "0px",
                    "left": "125px"
                },
                "cta": {
                    "top": "-45px",
                    "left": "230px"
                },
                "tags": {
                    "top": "-25px",
                    "left": "0px"
                }
            }
        }

    },
    {
        "id": "full-shot",
        "name": "Full shot",
        "description": "this is a description for the settings template",
        "width": 480,
        "height": 120,
        "date": "2022-01-01",
        "author": "https://boords.com/blog/16-types-of-camera-shots-and-angles-with-gifs",

        "elements": {
            "logoIcon": true,
            "image": true,
            "headline": true,
            "text": false,
            "tags": true,
            "cta": true,
            "svgWave": true,
            "textContainer": true,
            "backdrop": false,
            "filter": false,
            "backbanner": false
        },
        "layout": {
            "logoLayout": "flex-row",
            "ctaStyle": "circle",
            "imageOpacity": "1",
            "svgOneOpacity": "1",
            "svgTwoOpacity": "1",
            "logoRotation": 0,
            "backgroundImage": false,
            "imageSize": "27%",
            "titleSize": "1.2rem",
            "bodySize": "1rem",
            "switchPosition": false,
            "imageZIndex": 29,
            "textLength": 0,
            "zIndex": {
                "backdropimage": 10
            },
            "scales": {
                "backdropimage": 0.9900000000000001
            },
            "positions": {
                "logo": {
                    "top": "0px",
                    "left": "-5px"
                },
                "headline": {
                    "top": "30px",
                    "left": "0px"
                },
                "image": {
                    "top": "0px",
                    "left": "125px"
                },
                "cta": {
                    "top": "-45px",
                    "left": "230px"
                },
                "tags": {
                    "top": "-25px",
                    "left": "0px"
                }
            }
        }

    }
]

const campaigns__this = [
    {
        "title": "how to inhace your business",
        "description": "this is a description",
        "img": "/img/leads.png",
        "parentUrl": "/blog/leads",
        "tags": [
            "#leads",
            "#business"
        ],
        "category": "business",
        "date": "2022-01-01",
        "author": "john doe",
        "type": "blog",
        "audio": {
            "url": "/audio/01-pod-cast.aac",
            "duration": "04:50"
        },
        "logo": {
            "icon": "fa-brands fa-octopus-deploy",
            "firstWord": "octopus",
            "secondWord": "energy"
        },
        "slides": [
            {
                "timestamp": "00:00",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Podcast Starts",
                "text": [
                    "Welcome back to another episode of Marketing Insights, the podcast where we explore the latest trends, challenges, and opportunities in the world of marketing and business growth. I'm your host, Mike Sanshase, and today, we have a special guest with us, Sherif Butt, who has over 10 years of experience in the field. Welcome, Sherif!"
                ],
                "tags": "#MarketingInsights #PodcastIntro",
                "img": "/img/clock.webp",
                "filter": "/img/filter-32499109_7963948.png",
                "backdrop": "/img/backdrop-studio-inside-04.png",
                "frontdrop": "/img/frontdrop-studio-inside_04_n.png",
                "imgDescription": "A 3D sketch style drawing of a podcast studio viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The podcast studio should appear modern and abstract, set against a strictly white background.",
                "cta": "Stay Tuned",
                "animation": {
                    "isLooped": false,
                    "isEntryAnimated": true,
                    "isExitAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "00:10",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Guest Introduction",
                "text": [
                    "Thanks, Mike! It's great to be here."
                ],
                "tags": "#MarketingInsights #GuestIntro",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a guest speaker viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The guest speaker should appear modern and abstract, set against a strictly white background.",
                "cta": "Meet Sherif",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left-some-to-right"
                }
            },
            {
                "timestamp": "00:15",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Lead Generation Hesitation",
                "text": [
                    "Today, we're diving into a topic that many businesses grapple with: Why Businesses Hesitate to Implement Lead Generation. Sherif, you've worked with numerous businesses over the years. Why do you think there's so much hesitation around lead generation?"
                ],
                "tags": "#LeadGeneration #Marketing",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business team discussing strategies viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business team should appear modern and abstract, set against a strictly white background.",
                "cta": "Discover More",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left-to-right"
                }
            },
            {
                "timestamp": "00:30",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Misconceptions",
                "text": [
                    "That's a great question, Mike. There are several reasons businesses hesitate. One of the biggest misconceptions is that lead generation is overly complex and requires a significant amount of time and resources to be effective. While it's true that it requires a well-thought-out strategy and consistent effort, it doesn't have to be overwhelming."
                ],
                "tags": "#LeadGeneration #Misconceptions",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a confused businessperson viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The businessperson should appear modern and abstract, set against a strictly white background.",
                "cta": "Learn More",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "00:50",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Immediate Results",
                "text": [
                    "That makes sense. So, what would you say to businesses that believe lead generation doesn't yield immediate results?"
                ],
                "tags": "#LeadGeneration #Results",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a graph showing rapid results viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The graph should appear modern and abstract, set against a strictly white background.",
                "cta": "See Results",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "01:00",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Effective Strategies",
                "text": [
                    "It's important to understand that the effectiveness of lead generation can vary based on the approach and the industry. Some strategies might take time to build momentum, but others, like targeted online ads or email campaigns, can start showing results relatively quickly. The key is to set realistic expectations and have a solid plan."
                ],
                "tags": "#LeadGeneration #Strategies",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a strategic plan viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The strategic plan should appear modern and abstract, set against a strictly white background.",
                "cta": "Plan Now",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "01:20",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Audience Understanding",
                "text": [
                    "Absolutely. Now, let's talk about some of the challenges businesses face when implementing lead generation. What are some of the common obstacles?"
                ],
                "tags": "#LeadGeneration #Challenges",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business meeting viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business meeting should appear modern and abstract, set against a strictly white background.",
                "cta": "Face Challenges",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "01:30",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Common Obstacles",
                "text": [
                    "One major challenge is the lack of understanding of the target audience. Effective lead generation relies on knowing who your potential customers are, what they need, and how to reach them. Without this understanding, efforts can be misdirected, leading to frustration and wasted resources."
                ],
                "tags": "#LeadGeneration #Obstacles",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a frustrated businessperson viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The businessperson should appear modern and abstract, set against a strictly white background.",
                "cta": "Overcome Obstacles",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "01:50",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Fear of the Unknown",
                "text": [
                    "And what about the fear of the unknown? I've heard that many businesses simply don't know where to start."
                ],
                "tags": "#LeadGeneration #Fear",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a confused business team viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business team should appear modern and abstract, set against a strictly white background.",
                "cta": "Start Here",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "02:00",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Expert Guidance",
                "text": [
                    "That's a significant barrier, Mike. Many businesses lack the in-house expertise and are unsure about outsourcing this critical function. However, partnering with experienced lead generation professionals or agencies can provide the necessary guidance and support to get started on the right foot."
                ],
                "tags": "#LeadGeneration #ExpertGuidance",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business consultation viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business consultation should appear modern and abstract, set against a strictly white background.",
                "cta": "Get Support",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "02:20",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Practical Solutions",
                "text": [
                    "Great points, Sherif. So, what are some practical solutions to overcome these barriers and successfully implement lead generation?"
                ],
                "tags": "#LeadGeneration #Solutions",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business meeting discussing solutions viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business meeting should appear modern and abstract, set against a strictly white background.",
                "cta": "Find Solutions",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "02:30",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Education and Training",
                "text": [
                    "First, education and training are key. Businesses should invest time in learning about lead generation strategies, tools, and best practices. There are numerous online courses, webinars, and resources available that can help demystify the process."
                ],
                "tags": "#LeadGeneration #Education",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business training session viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The training session should appear modern and abstract, set against a strictly white background.",
                "cta": "Learn More",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "02:50",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Start Small",
                "text": [
                    "Starting small and scaling up can also be effective, right?"
                ],
                "tags": "#LeadGeneration #StartSmall",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a small business team working on a project viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The small business team should appear modern and abstract, set against a strictly white background.",
                "cta": "Begin Now",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "03:00",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Effective Strategies",
                "text": [
                    "Exactly, Mike. Begin with a simple lead generation campaign to test the waters. Use the insights gained from this initial effort to refine your strategy and gradually expand your efforts."
                ],
                "tags": "#LeadGeneration #EffectiveStrategies",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business team planning strategies viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business team should appear modern and abstract, set against a strictly white background.",
                "cta": "Plan Now",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "03:20",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Leverage Technology",
                "text": [
                    "And technology plays a big role too, I assume?"
                ],
                "tags": "#LeadGeneration #Technology",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of technology tools viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The technology tools should appear modern and abstract, set against a strictly white background.",
                "cta": "Use Tech",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "03:30",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Tech for Optimization",
                "text": [
                    "Absolutely. There are many lead generation tools and platforms designed to streamline the process. From CRM systems to email marketing software, these tools can help automate and optimize lead generation efforts."
                ],
                "tags": "#LeadGeneration #Optimization",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of CRM and email marketing tools viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The tools should appear modern and abstract, set against a strictly white background.",
                "cta": "Optimize Now",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "03:50",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Expert Partnership",
                "text": [
                    "What about partnering with experts? How can that help?"
                ],
                "tags": "#LeadGeneration #ExpertPartnership",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business partnership viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business partnership should appear modern and abstract, set against a strictly white background.",
                "cta": "Partner Up",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "04:00",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Get Expert Help",
                "text": [
                    "Partnering with experts, whether it's a consultancy, a marketing agency, or hiring an experienced professional in-house, can make a significant difference. They bring the expertise and experience needed to navigate the complexities of lead generation and ensure successful implementation."
                ],
                "tags": "#LeadGeneration #ExpertHelp",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business expert providing guidance viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business expert should appear modern and abstract, set against a strictly white background.",
                "cta": "Get Help",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "04:20",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Conclusion",
                "text": [
                    "Thanks for those insights, Sherif. In conclusion, while businesses may hesitate to implement lead generation due to misconceptions and challenges, the benefits far outweigh the initial hurdles. By educating themselves, starting small, leveraging technology, and seeking expert guidance, businesses can overcome these barriers and unlock the full potential of lead generation."
                ],
                "tags": "#LeadGeneration #Conclusion",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business team celebrating success viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business team should appear modern and abstract, set against a strictly white background.",
                "cta": "Get Started",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "04:40",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Thank You",
                "text": [
                    "Exactly, Mike. Lead generation can truly transform a business when done right."
                ],
                "tags": "#LeadGeneration #ThankYou",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a thank you message viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The thank you message should appear modern and abstract, set against a strictly white background.",
                "cta": "Thank You",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            },
            {
                "timestamp": "04:50",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Final Words",
                "text": [
                    "Thank you for joining us today, Sherif. For our listeners who want to learn more about lead generation, be sure to visit Sherif's website at test.loyalleads.co.uk. And don't forget to subscribe to our podcast for more insights and tips on marketing and business growth. Until next time, I'm Mike Sanshase, and this has been Marketing Insights."
                ],
                "tags": "#LeadGeneration #FinalWords",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business handshake viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business handshake should appear modern and abstract, set against a strictly white background.",
                "cta": "Subscribe",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                }
            }
        ]
    }
  ]
// now in testing
const campaigns = [
    {
        "title": "how to inhace your business",
        "description": "this is a description",
        "img": "/img/leads.png",
        "parentUrl": "/blog/leads",
        "tags": [
            "#leads",
            "#business"
        ],
        "category": "business",
        "date": "2022-01-01",
        "author": "john doe",
        "type": "blog",
        "audio": {
            "url": "/audio/01-pod-cast.aac",
            "duration": "04:50"
        },
        "logo": {
            "icon": "fa-brands fa-octopus-deploy",
            "firstWord": "octopus",
            "secondWord": "energy"
        },
        "slides": [
            {
                "timestamp": "00:00",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Podcast Starts",
                "text": [
                    "Welcome back to another episode of Marketing Insights, the podcast where we explore the latest trends, challenges, and opportunities in the world of marketing and business growth. I'm your host, Mike Sanshase, and today, we have a special guest with us, Sherif Butt, who has over 10 years of experience in the field. Welcome, Sherif!"
                ],
                "tags": "#MarketingInsights #PodcastIntro",
                "img": "/img/clock.webp",
                "filter": "/img/filter-32499109_7963948.png",
                "backdrop": "/img/backdrop-studio-inside-04.png",
                "frontdrop": "/img/frontdrop-studio-inside_04_n.png",
                "imgDescription": "A 3D sketch style drawing of a podcast studio viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The podcast studio should appear modern and abstract, set against a strictly white background.",
                "cta": "Stay Tuned",
                "animation": {
                    "isLooped": false,
                    "isEntryAnimated": true,
                    "isExitAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "custom",
                    "custom": {
                        "id": "default",
                        "name": "Default",
                        "description": "Default template with all possible settings",
                        "img": "/img/default-template.gif",
                        "width": 480,
                        "height": 120,
                        "date": "2023-07-29",
                        "author": "System",
                        "elements": {
                            "logoIcon": true,
                            "image": true,
                            "headline": true,
                            "text": true,
                            "tags": true,
                            "cta": true,
                            "svgWave": true,
                            "textContainer": true,
                            "backdrop": true,
                            "filter": true,
                            "frontdrop": true,
                            "backbanner": true,
                            "pathOne": true,
                            "pathTwo": true,
                            "logo-title": true
                        },
                        "layout": {
                            "logoLayout": "flex-row",
                            "ctaStyle": "default",
                            "imageOpacity": "1",
                            "svgOneOpacity": "1",
                            "svgTwoOpacity": "1",
                            "logoRotation": 0,
                            "backgroundImage": false,
                            "imageSize": "27%",
                            "titleSize": "1.2rem",
                            "bodySize": "1rem",
                            "switchPosition": false,
                            "imageZIndex": 29,
                            "textLength": 0,
                            "zIndex": {
                                "logoIcon": 10,
                                "image": 20,
                                "headline": 30,
                                "text": 40,
                                "tags": 50,
                                "cta": 60,
                                "svgWave": 5,
                                "textContainer": 15,
                                "backdrop": 1,
                                "filter": 2,
                                "frontdrop": 3,
                                "backbanner": 0,
                                "pathOne": 6,
                                "pathTwo": 7,
                                "logo-title": 11
                            },
                            "scales": {
                                "logoIcon": 1,
                                "image": 1,
                                "headline": 1,
                                "text": 1,
                                "tags": 1,
                                "cta": 1,
                                "svgWave": 1,
                                "textContainer": 1,
                                "backdrop": 1,
                                "filter": 1,
                                "frontdrop": 1,
                                "backbanner": 1,
                                "pathOne": 1,
                                "pathTwo": 1,
                                "logo-title": 1
                            },
                            "positions": {
                                "logoIcon": { "top": "0px", "left": "0px" },
                                "image": { "top": "0px", "left": "125px" },
                                "headline": { "top": "30px", "left": "0px" },
                                "text": { "top": "60px", "left": "0px" },
                                "tags": { "top": "-25px", "left": "0px" },
                                "cta": { "top": "-45px", "left": "230px" },
                                "svgWave": { "top": "0px", "left": "0px" },
                                "textContainer": { "top": "0px", "left": "0px" },
                                "backdrop": { "top": "0px", "left": "0px" },
                                "filter": { "top": "0px", "left": "0px" },
                                "frontdrop": { "top": "0px", "left": "0px" },
                                "backbanner": { "top": "0px", "left": "0px" },
                                "pathOne": { "top": "0px", "left": "0px" },
                                "pathTwo": { "top": "0px", "left": "0px" },
                                "logo-title": { "top": "0px", "left": "0px" }
                            },
                            "colors": {
                                "logoIcon": "#000000",
                                "image": "#FFFFFF",
                                "headline": "#000000",
                                "text": "#000000",
                                "tags": "#000000",
                                "cta": "#FFFFFF",
                                "svgWave": "#000000",
                                "textContainer": "#FFFFFF",
                                "backdrop": "#FFFFFF",
                                "filter": "#FFFFFF",
                                "frontdrop": "#FFFFFF",
                                "backbanner": "#FFFFFF",
                                "pathOne": "#000000",
                                "pathTwo": "#000000",
                                "logo-title": "#000000"
                            },
                            "opacities": {
                                "logoIcon": 1,
                                "image": 1,
                                "headline": 1,
                                "text": 1,
                                "tags": 1,
                                "cta": 1,
                                "svgWave": 1,
                                "textContainer": 1,
                                "backdrop": 1,
                                "filter": 1,
                                "frontdrop": 1,
                                "backbanner": 1,
                                "pathOne": 1,
                                "pathTwo": 1,
                                "logo-title": 1
                            },
                            "rotations": {
                                "logoIcon": 0,
                                "image": 0,
                                "headline": 0,
                                "text": 0,
                                "tags": 0,
                                "cta": 0,
                                "svgWave": 0,
                                "textContainer": 0,
                                "backdrop": 0,
                                "filter": 0,
                                "frontdrop": 0,
                                "backbanner": 0,
                                "pathOne": 0,
                                "pathTwo": 0,
                                "logo-title": 0
                            },
                            "filters": {
                                "logoIcon": "none",
                                "image": "none",
                                "headline": "none",
                                "text": "none",
                                "tags": "none",
                                "cta": "none",
                                "svgWave": "none",
                                "textContainer": "none",
                                "backdrop": "none",
                                "filter": "none",
                                "frontdrop": "none",
                                "backbanner": "none",
                                "pathOne": "none",
                                "pathTwo": "none",
                                "logo-title": "none"
                            }
                        }
                    }
                }
            },
            {
                "timestamp": "00:10",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Guest Introduction",
                "text": [
                    "Thanks, Mike! It's great to be here."
                ],
                "tags": "#MarketingInsights #GuestIntro",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a guest speaker viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The guest speaker should appear modern and abstract, set against a strictly white background.",
                "cta": "Meet Sherif",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left-some-to-right"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "00:15",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Lead Generation Hesitation",
                "text": [
                    "Today, we're diving into a topic that many businesses grapple with: Why Businesses Hesitate to Implement Lead Generation. Sherif, you've worked with numerous businesses over the years. Why do you think there's so much hesitation around lead generation?"
                ],
                "tags": "#LeadGeneration #Marketing",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business team discussing strategies viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business team should appear modern and abstract, set against a strictly white background.",
                "cta": "Discover More",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left-to-right"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "00:30",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Misconceptions",
                "text": [
                    "That's a great question, Mike. There are several reasons businesses hesitate. One of the biggest misconceptions is that lead generation is overly complex and requires a significant amount of time and resources to be effective. While it's true that it requires a well-thought-out strategy and consistent effort, it doesn't have to be overwhelming."
                ],
                "tags": "#LeadGeneration #Misconceptions",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a confused businessperson viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The businessperson should appear modern and abstract, set against a strictly white background.",
                "cta": "Learn More",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "00:50",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Immediate Results",
                "text": [
                    "That makes sense. So, what would you say to businesses that believe lead generation doesn't yield immediate results?"
                ],
                "tags": "#LeadGeneration #Results",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a graph showing rapid results viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The graph should appear modern and abstract, set against a strictly white background.",
                "cta": "See Results",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "01:00",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Effective Strategies",
                "text": [
                    "It's important to understand that the effectiveness of lead generation can vary based on the approach and the industry. Some strategies might take time to build momentum, but others, like targeted online ads or email campaigns, can start showing results relatively quickly. The key is to set realistic expectations and have a solid plan."
                ],
                "tags": "#LeadGeneration #Strategies",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a strategic plan viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The strategic plan should appear modern and abstract, set against a strictly white background.",
                "cta": "Plan Now",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "01:20",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Audience Understanding",
                "text": [
                    "Absolutely. Now, let's talk about some of the challenges businesses face when implementing lead generation. What are some of the common obstacles?"
                ],
                "tags": "#LeadGeneration #Challenges",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business meeting viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business meeting should appear modern and abstract, set against a strictly white background.",
                "cta": "Face Challenges",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "01:30",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Common Obstacles",
                "text": [
                    "One major challenge is the lack of understanding of the target audience. Effective lead generation relies on knowing who your potential customers are, what they need, and how to reach them. Without this understanding, efforts can be misdirected, leading to frustration and wasted resources."
                ],
                "tags": "#LeadGeneration #Obstacles",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a frustrated businessperson viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The businessperson should appear modern and abstract, set against a strictly white background.",
                "cta": "Overcome Obstacles",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "01:50",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Fear of the Unknown",
                "text": [
                    "And what about the fear of the unknown? I've heard that many businesses simply don't know where to start."
                ],
                "tags": "#LeadGeneration #Fear",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a confused business team viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business team should appear modern and abstract, set against a strictly white background.",
                "cta": "Start Here",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "02:00",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Expert Guidance",
                "text": [
                    "That's a significant barrier, Mike. Many businesses lack the in-house expertise and are unsure about outsourcing this critical function. However, partnering with experienced lead generation professionals or agencies can provide the necessary guidance and support to get started on the right foot."
                ],
                "tags": "#LeadGeneration #ExpertGuidance",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business consultation viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business consultation should appear modern and abstract, set against a strictly white background.",
                "cta": "Get Support",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "02:20",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Practical Solutions",
                "text": [
                    "Great points, Sherif. So, what are some practical solutions to overcome these barriers and successfully implement lead generation?"
                ],
                "tags": "#LeadGeneration #Solutions",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business meeting discussing solutions viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business meeting should appear modern and abstract, set against a strictly white background.",
                "cta": "Find Solutions",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "02:30",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Education and Training",
                "text": [
                    "First, education and training are key. Businesses should invest time in learning about lead generation strategies, tools, and best practices. There are numerous online courses, webinars, and resources available that can help demystify the process."
                ],
                "tags": "#LeadGeneration #Education",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business training session viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The training session should appear modern and abstract, set against a strictly white background.",
                "cta": "Learn More",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "02:50",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Start Small",
                "text": [
                    "Starting small and scaling up can also be effective, right?"
                ],
                "tags": "#LeadGeneration #StartSmall",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a small business team working on a project viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The small business team should appear modern and abstract, set against a strictly white background.",
                "cta": "Begin Now",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "steelyard",
                    "custom": {}
                }
            },
            {
                "timestamp": "03:00",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Effective Strategies",
                "text": [
                    "Exactly, Mike. Begin with a simple lead generation campaign to test the waters. Use the insights gained from this initial effort to refine your strategy and gradually expand your efforts."
                ],
                "tags": "#LeadGeneration #EffectiveStrategies",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business team planning strategies viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business team should appear modern and abstract, set against a strictly white background.",
                "cta": "Plan Now",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "03:20",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Leverage Technology",
                "text": [
                    "And technology plays a big role too, I assume?"
                ],
                "tags": "#LeadGeneration #Technology",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of technology tools viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The technology tools should appear modern and abstract, set against a strictly white background.",
                "cta": "Use Tech",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "03:30",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Tech for Optimization",
                "text": [
                    "Absolutely. There are many lead generation tools and platforms designed to streamline the process. From CRM systems to email marketing software, these tools can help automate and optimize lead generation efforts."
                ],
                "tags": "#LeadGeneration #Optimization",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of CRM and email marketing tools viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The tools should appear modern and abstract, set against a strictly white background.",
                "cta": "Optimize Now",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "03:50",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Expert Partnership",
                "text": [
                    "What about partnering with experts? How can that help?"
                ],
                "tags": "#LeadGeneration #ExpertPartnership",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business partnership viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business partnership should appear modern and abstract, set against a strictly white background.",
                "cta": "Partner Up",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "04:00",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Get Expert Help",
                "text": [
                    "Partnering with experts, whether it's a consultancy, a marketing agency, or hiring an experienced professional in-house, can make a significant difference. They bring the expertise and experience needed to navigate the complexities of lead generation and ensure successful implementation."
                ],
                "tags": "#LeadGeneration #ExpertHelp",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business expert providing guidance viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business expert should appear modern and abstract, set against a strictly white background.",
                "cta": "Get Help",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "04:20",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Conclusion",
                "text": [
                    "Thanks for those insights, Sherif. In conclusion, while businesses may hesitate to implement lead generation due to misconceptions and challenges, the benefits far outweigh the initial hurdles. By educating themselves, starting small, leveraging technology, and seeking expert guidance, businesses can overcome these barriers and unlock the full potential of lead generation."
                ],
                "tags": "#LeadGeneration #Conclusion",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business team celebrating success viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business team should appear modern and abstract, set against a strictly white background.",
                "cta": "Get Started",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "04:40",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Thank You",
                "text": [
                    "Exactly, Mike. Lead generation can truly transform a business when done right."
                ],
                "tags": "#LeadGeneration #ThankYou",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a thank you message viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The thank you message should appear modern and abstract, set against a strictly white background.",
                "cta": "Thank You",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            },
            {
                "timestamp": "04:50",
                "audio": "/audio/01-pod-cast.aac",
                "logo": {
                    "icon": "fa-brands fa-octopus-deploy",
                    "firstWord": "octopus",
                    "secondWord": "energy"
                },
                "headline": "Final Words",
                "text": [
                    "Thank you for joining us today, Sherif. For our listeners who want to learn more about lead generation, be sure to visit Sherif's website at test.loyalleads.co.uk. And don't forget to subscribe to our podcast for more insights and tips on marketing and business growth. Until next time, I'm Mike Sanshase, and this has been Marketing Insights."
                ],
                "tags": "#LeadGeneration #FinalWords",
                "img": "/img/episode_start.webp",
                "filter": "/img/filter-comic-3.jpg",
                "backdrop": "/img/backdrop-studio-inside-03.png",
                "frontdrop": "/img/frontdrop-studio-inside_03.png",
                "imgDescription": "A 3D sketch style drawing of a business handshake viewed from a slightly elevated angle, showing the top and one side. The design is minimalistic, featuring clean lines with two accents: black and #ffd84d (bright yellow). The business handshake should appear modern and abstract, set against a strictly white background.",
                "cta": "Subscribe",
                "animation": {
                    "isLooped": false,
                    "isExitAnimated": true,
                    "isEntryAnimated": true,
                    "template": "slide-from-left"
                },
                "settings": {
                    "depthOfField": 20,
                    "scale": 1,
                    "horizontalBend": 0,
                    "verticalBend": 0,
                    "temperature": 19,
                    "template": "default",
                    "custom": {}
                }
            }
        ]
    }
]



const bannerSettings = [

    {
        "size": "480x120",
        "settings": {
            "elements": {
                "logoIcon": true,
                "image": true,
                "headline": true,
                "text": false,
                "tags": true,
                "cta": true,
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
            },
            "layout": {
                "logoLayout": "flex-row",
                "ctaStyle": "circle",
                "imageOpacity": "1",
                "svgOneOpacity": "1",
                "svgTwoOpacity": "1",
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "27%",
                "titleSize": "1.2rem",
                "bodySize": "1rem",
                "switchPosition": false,
                "imageZIndex": 29,
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
                "text": false,
                "tags": true,
                "cta": true,
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
            },
            "layout": {
                "logoLayout": "flex-col",
                "ctaStyle": "circle",
                "imageOpacity": 1,
                "svgOneOpacity": "1",
                "svgTwoOpacity": "1",
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "53%",
                "titleSize": "1.4rem",
                "bodySize": "1rem",
                "switchPosition": true,
                "imageZIndex": 9,
                "textLength": 2
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
                "text": false,
                "tags": true,
                "cta": true,
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
            },
            "layout": {
                "logoLayout": "flex-row",
                "ctaStyle": "circle",
                "imageOpacity": 1,
                "svgOneOpacity": "1",
                "svgTwoOpacity": 1,
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "100%",
                "titleSize": "1.6rem",
                "bodySize": "0.9rem",
                "switchPosition": false,
                "imageZIndex": 9,
                "textLength": 0
            }
        }
    },
    {
        "size": "300x250-text",
        "settings": {
            "elements": {
                "logoIcon": true,
                "image": true,
                "headline": true,
                "text": false,
                "tags": true,
                "cta": true,
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
            },
            "layout": {
                "logoLayout": "flex-row",
                "ctaStyle": "circle",
                "imageOpacity": 1,
                "svgOneOpacity": "1",
                "svgTwoOpacity": "1",
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "0%",
                "titleSize": "1.3rem",
                "bodySize": "0.9rem",
                "switchPosition": false,
                "imageZIndex": 30,
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
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
            },
            "layout": {
                "logoLayout": "flex-row",
                "ctaStyle": "circle",
                "imageOpacity": 1,
                "svgOneOpacity": "1",
                "svgTwoOpacity": 1,
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "15%",
                "titleSize": "1.2rem",
                "bodySize": "1rem",
                "switchPosition": false,
                "imageZIndex": 30,
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
                "text": false,
                "tags": true,
                "cta": true,
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
            },
            "layout": {
                "logoLayout": "flex-row",
                "ctaStyle": "default",
                "imageOpacity": 1,
                "svgOneOpacity": 0.53,
                "svgTwoOpacity": 1,
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "43%",
                "titleSize": "2.9rem",
                "bodySize": "1.25rem",
                "switchPosition": false,
                "imageZIndex": 16,
                "textLength": 0,
                "zIndex": {
                    "image": 24
                }
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
                "text": false,
                "tags": true,
                "cta": true,
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
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
                "imageZIndex": 30,
                "textLength": 0,
                "zIndex": {
                    "image": 20
                }
            }
        }
    },
    {
        "size": "1080x1080",
        "settings": {
            "elements": {
                "logoIcon": true,
                "image": true,
                "headline": true,
                "text": false,
                "tags": true,
                "cta": true,
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
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
                "titleSize": "4.9rem",
                "bodySize": "1.25rem",
                "switchPosition": false,
                "imageZIndex": 30,
                "textLength": 0,
                "positions": {
                    "path": "translate(-10, -30)",
                    "svg": {
                        "top": "-5px",
                        "left": ""
                    },
                    "ad": {
                        "top": "",
                        "left": "20px"
                    },
                    "text": {
                        "top": "-45px",
                        "left": ""
                    },
                    "textcontainer": {
                        "top": "875px",
                        "left": "100px"
                    },
                    "headline": {
                        "top": "-75px",
                        "left": "175px"
                    },
                    "cta": {
                        "top": "105px",
                        "left": "300px"
                    },
                    "image": {
                        "top": "150px",
                        "left": "240px"
                    }
                }
            }
        }
    },
    {
        "size": "1080x1920",
        "settings": {
            "elements": {
                "logoIcon": true,
                "image": true,
                "headline": true,
                "text": false,
                "tags": true,
                "cta": true,
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
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
                "titleSize": "4.9rem",
                "bodySize": "1.25rem",
                "switchPosition": false,
                "imageZIndex": 30,
                "textLength": 0,
                "positions": {
                    "path": "translate(-10, -30)",
                    "svg": {
                        "top": "-5px",
                        "left": ""
                    },
                    "ad": {
                        "top": "",
                        "left": "20px"
                    },
                    "text": {
                        "top": "-45px",
                        "left": ""
                    }
                }
            }
        }
    }
    ,
    {
        "size": "300x250",
        "settings": {
            "elements": {
                "logoIcon": true,
                "image": true,
                "headline": true,
                "text": false,
                "tags": true,
                "cta": true,
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
            },
            "layout": {
                "logoLayout": "flex-col",
                "ctaStyle": "default",
                "imageOpacity": 1,
                "svgOneOpacity": "1",
                "svgTwoOpacity": "1",
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "53%",
                "titleSize": "1.4rem",
                "bodySize": "1rem",
                "switchPosition": true,
                "imageZIndex": 9,
                "textLength": 2
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
                "text": false,
                "tags": true,
                "cta": true,
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
            },
            "layout": {
                "logoLayout": "flex-row",
                "ctaStyle": "circle",
                "imageOpacity": 1,
                "svgOneOpacity": "1",
                "svgTwoOpacity": 1,
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "100%",
                "titleSize": "1.6rem",
                "bodySize": "0.9rem",
                "switchPosition": false,
                "imageZIndex": 9,
                "textLength": 0
            }
        }
    },
    {
        "size": "300x250-text",
        "settings": {
            "elements": {
                "logoIcon": true,
                "image": true,
                "headline": true,
                "text": false,
                "tags": true,
                "cta": true,
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
            },
            "layout": {
                "logoLayout": "flex-row",
                "ctaStyle": "default",
                "imageOpacity": 1,
                "svgOneOpacity": "1",
                "svgTwoOpacity": "1",
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "0%",
                "titleSize": "1.3rem",
                "bodySize": "0.9rem",
                "switchPosition": false,
                "imageZIndex": 30,
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
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
            },
            "layout": {
                "logoLayout": "flex-row",
                "ctaStyle": "circle",
                "imageOpacity": 1,
                "svgOneOpacity": "1",
                "svgTwoOpacity": 1,
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "15%",
                "titleSize": "1.2rem",
                "bodySize": "1rem",
                "switchPosition": false,
                "imageZIndex": 30,
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
                "text": false,
                "tags": true,
                "cta": true,
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
            },
            "layout": {
                "logoLayout": "flex-row",
                "ctaStyle": "default",
                "imageOpacity": 1,
                "svgOneOpacity": 0.53,
                "svgTwoOpacity": 1,
                "logoRotation": 0,
                "backgroundImage": false,
                "imageSize": "43%",
                "titleSize": "2.9rem",
                "bodySize": "1.25rem",
                "switchPosition": false,
                "imageZIndex": 16,
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
                "text": false,
                "tags": true,
                "cta": true,
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
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
                "imageZIndex": 30,
                "textLength": 0
            }
        }
    },
    {
        "size": "1080x1080",
        "settings": {
            "elements": {
                "logoIcon": true,
                "image": true,
                "headline": true,
                "text": false,
                "tags": true,
                "cta": true,
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
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
                "titleSize": "4.9rem",
                "bodySize": "1.25rem",
                "switchPosition": false,
                "imageZIndex": 30,
                "textLength": 0,
                "positions": {
                    "path": "translate(-10, -30)",
                    "svg": {
                        "top": "-5px",
                        "left": ""
                    },
                    "ad": {
                        "top": "",
                        "left": "20px"
                    },
                    "text": {
                        "top": "-45px",
                        "left": ""
                    }
                }
            }
        }
    },
    {
        "size": "1080x1920",
        "settings": {
            "elements": {
                "logoIcon": true,
                "image": true,
                "headline": true,
                "text": false,
                "tags": true,
                "cta": true,
                "svgWave": true,
                "textContainer": true,
                "backdrop": false,
                "filter": false,
                "backbanner": false
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
                "titleSize": "4.9rem",
                "bodySize": "1.25rem",
                "switchPosition": false,
                "imageZIndex": 30,
                "textLength": 0,
                "positions": {
                    "path": "translate(-10, -30)",
                    "svg": {
                        "top": "-5px",
                        "left": ""
                    },
                    "ad": {
                        "top": "",
                        "left": "20px"
                    },
                    "text": {
                        "top": "-45px",
                        "left": ""
                    }
                }
            }
        }
    }
]

const filters = [
    "/img/filter-comic.png",
    "/img/filter-34294033_dotted_background.png",
    "/img/filter-10308569_18448119.png",
    "/img/filter-32499109_7963948.png",
    "/img/filter-flat-design-black-white-halftone.png",

]