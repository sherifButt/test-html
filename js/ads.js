let _currentAdIndex = 0;
let _currentImageIndex = 0;
let selectedElement = null;
let autoPlayInterval = null;
let currentAudioSrc = '';
let movementMultiplier = 30;
let autoPlayTimeout = null;
let startTime = null;
let audioStarted = false;
let pausedTime = 0;
let pauseStartTime = null;
let totalDuration = 0;
let isMoveMarkerActive = false;
let isShiftKeyDown = false;
let isDragging = false;
let draggedMarker = null;
let dragStartX = 0;
let originalMarkerPosition = 0;

// Important snapping issue:
// bringing back moving slide to time line location 
// fixing timeline length issue
// time line zoom
// zoom scroller



let zoomLevel = 1;
const maxZoom = 5;
const minZoom = 0.2;
let zoomCenter = 0;

// add scroller below the timeline
let scrollContainerWidth = 0;

// gapping scroll bar and moving it
// enhancing gapping scroll bar accuracy
// show marker exact time on draping
let originalCounterValue = '';

// time line to jump to marker location when clicked
// update slides object
let currentCampaignIndex = 0;

// fix jumbig issue
// fix jumping issue
let isAutoPlayActive = false;

// update animationTemplates array object
const sizes = ["480x120", "300x250", "160x600", "300x250-text", "728x90", "1200x628", "1200x628-2", "1080x1080", "720x1280"];

let currentImageType = 'main';

let currentEditingSettingsTemplateId = null;
let isEditingSettingsTemplate = false;


let uiSettings = {
    isSlideSettings: false,
    isAnimationsEnabled: false // Global variable to track animation state

    // Add other UI settings here as needed
};

let editingTemplateId = null;

// enhance elements edit locaion and sclging




// implanting campaign object
let slides = campaigns[currentCampaignIndex].slides.map(ad => {
    return {
        ...ad,
        logo: campaigns[currentCampaignIndex].logo,
        audio: campaigns[currentCampaignIndex].audio.url
    }
});

let campaign = campaigns[currentCampaignIndex];
delete campaign.slides;

function getSlideSettings(size) {
    if (uiSettings.isSlideSettings) {
      if (!storedSlides[currentAdIndex].settings) {
        initializeSlideSettings();
      }
      if (storedSlides[currentAdIndex].settings && storedSlides[currentAdIndex].settings.size && storedSlides[currentAdIndex].settings.size[size]) {
        return storedSlides[currentAdIndex].settings.size[size];
      }
      return initializeSlideSettings(size);
    } else {
      return storedBannerSettings.find(setting => setting.size === size).settings;
    }
  }

  function initializeSlideSettings(size) {
    if (!storedSlides[currentAdIndex].settings) {
      storedSlides[currentAdIndex].settings = { size: {} };
    }
    if (!storedSlides[currentAdIndex].settings.size[size]) {
      const globalSettings = storedBannerSettings.find(setting => setting.size === size).settings;
      storedSlides[currentAdIndex].settings.size[size] = JSON.parse(JSON.stringify(globalSettings));
    }
    return storedSlides[currentAdIndex].settings.size[size];
  }

// Load settings from local storage or use default
const storedBannerSettings = JSON.parse(localStorage.getItem('bannerSettings')) || bannerSettings;
const storedSlides = JSON.parse(localStorage.getItem('slides')) || slides;
const storedImages = JSON.parse(localStorage.getItem('images')) || images;
const storedFilters = JSON.parse(localStorage.getItem('filters')) || filters;
const storedCampaigns = JSON.parse(localStorage.getItem('campaigns')) || campaigns;
const storedCampaign = JSON.parse(localStorage.getItem('campaign')) || campaign;
const storedCurrentCampaignIndex = JSON.parse(localStorage.getItem('currentCampaignIndex')) || currentCampaignIndex;
let currentAdIndex = JSON.parse(localStorage.getItem('currentAdIndex')) || 0;
let currentImageIndex = JSON.parse(localStorage.getItem('currentImageIndex')) || 0;

if (!Array.isArray(storedSlides) || storedSlides.length === 0) {
    console.error('storedSlides is not properly initialized');
    // Initialize with a default slide
    storedSlides = [{
        timestamp: 0,
        cta: 'Default CTA',
        // Add other default properties as needed
    }];
}

if (currentAdIndex === undefined || currentAdIndex < 0 || currentAdIndex >= storedSlides.length) {
    console.error('currentAdIndex is invalid');
    currentAdIndex = 0;
}

// const sizes = ["480x120", "300x250", "160x600", "300x250-text", "728x90", "1200x628", "1200x628-2", "1080x1080", "720x1280"];

function toggleSlideSettings() {
    uiSettings.isSlideSettings = !uiSettings.isSlideSettings;
    saveUISettings();

    if (uiSettings.isSlideSettings) {
        // Entering slide settings mode
        storedSlides.forEach(slide => {
            if (!slide.settings || !slide.settings.size) {
                slide.settings = { size: {} };
            }

            sizes.forEach(size => {
                const bannerSettings = storedBannerSettings.find(setting => setting.size === size);
                if (bannerSettings) {
                    if (!slide.settings.size[size]) {
                        if (!slide.settingsTemplate || slide.settingsTemplate === 'custom') {
                            slide.settings.size[size] = JSON.parse(JSON.stringify(bannerSettings.settings));
                        } else {
                            const template = settingsTemplates[slide.settingsTemplate];
                            if (template && template.size && template.size[size]) {
                                slide.settings.size[size] = JSON.parse(JSON.stringify(template.size[size]));
                            } else {
                                console.warn(`Template ${slide.settingsTemplate} or size ${size} not found for slide`);
                                // Fallback to default template if available
                                if (settingsTemplates.default && settingsTemplates.default.size[size]) {
                                    slide.settings.size[size] = JSON.parse(JSON.stringify(settingsTemplates.default.size[size]));
                                } else {
                                    console.warn(`Default template or size ${size} not found, using banner settings`);
                                    slide.settings.size[size] = JSON.parse(JSON.stringify(bannerSettings.settings));
                                }
                            }
                        }
                    }
                } else {
                    console.warn(`Banner settings for size ${size} not found`);
                }
            });
        });

        // Save the updated slides
        localStorage.setItem('slides', JSON.stringify(storedSlides));
        console.log('Slides populated with settings for all sizes');
    }

    // Apply settings for the currently selected size
    const currentSize = getSelectedBanner();
    const settings = getSlideSettings(currentSize);
    console.log('Current settings:', settings);
    console.log('Image size:', settings.layout?.imageSize);
    console.log('Text container size:', settings.layout?.textContainerSize);

    applyAllSavedSettings(currentSize);

    // After applying settings, log the actual sizes
    const image = document.getElementById(`image-${currentSize}`);
    const textContainer = document.getElementById(`textcontainer-${currentSize}`);
    if (image && textContainer) {
        console.log('Applied image size:', image.style.width);
        console.log('Applied text container size:', textContainer.style.width, textContainer.style.height);
    } else {
        console.warn(`Image or text container element not found for size ${currentSize}`);
    }

    updateCheckboxStates(currentSize);
    updateElementsList();
}

// Function to merge pre-set properties with current settings
function mergePresetWithCurrentSettings(size) {
    const bannerSetting = storedBannerSettings.find(setting => setting.size === size);
    if (!bannerSetting.settings.layout) {
        bannerSetting.settings.layout = {};
    }

    const elements = [
        'logo-icon', 'logo-title', 'image', 'headline', 'text', 'tags', 'cta',
        'path-one', 'path-two', 'textcontainer', 'backdrop', 'filter', 'frontdrop', 'backbanner'
    ];

    elements.forEach(elementType => {
        const element = document.getElementById(`${elementType}-${size}`);
        if (element) {
            const computedStyle = window.getComputedStyle(element);

            if (!bannerSetting.settings.layout[elementType]) {
                bannerSetting.settings.layout[elementType] = {};
            }

            // Merge computed style properties with existing settings
            Object.assign(bannerSetting.settings.layout[elementType], {
                position: computedStyle.position,
                top: computedStyle.top,
                left: computedStyle.left,
                width: computedStyle.width,
                height: computedStyle.height,
                fontSize: computedStyle.fontSize,
                zIndex: computedStyle.zIndex,
                opacity: computedStyle.opacity,
                transform: computedStyle.transform,
                display: computedStyle.display
            });
        }
    });

    saveSettings();
}

// Update the initialization code
document.addEventListener('DOMContentLoaded', () => {
    // ... (existing initialization code)

    sizes.forEach(size => {
        applyAllSavedSettings(size);
        mergePresetWithCurrentSettings(size);
    });

    // ... (rest of the existing initialization code)
});


function saveCurrentSlideSettings(size) {
    if (uiSettings.isSlideSettings) {
        const currentSettings = getSlideSettings(size);

        // Update currentSettings with any changes made
        const image = document.getElementById(`image-${size}`);
        const textContainer = document.getElementById(`textcontainer-${size}`);

        if (!currentSettings.layout) currentSettings.layout = {};
        currentSettings.layout.imageSize = image.style.width;
        currentSettings.layout.textContainerSize = {
            width: textContainer.style.width,
            height: textContainer.style.height
        };

        // ... update other settings ...

        storedSlides[currentAdIndex].settings = currentSettings;
        localStorage.setItem('slides', JSON.stringify(storedSlides));
    }
}


// Function to save UI settings to localStorage
function saveUISettings() {
    localStorage.setItem('uiSettings', JSON.stringify(uiSettings));
}

// Function to load UI settings from localStorage
function loadUISettings() {
    const savedSettings = localStorage.getItem('uiSettings');
    if (savedSettings) {
        uiSettings = JSON.parse(savedSettings);
    }
    // Ensure both settings are set, defaulting to false if not present
    if (uiSettings.isSlideSettings === undefined) {
        uiSettings.isSlideSettings = false;
    }
    if (uiSettings.isAnimationsEnabled === undefined) {
        uiSettings.isAnimationsEnabled = false;
    }
}

function applyUISettings() {
    // Apply animation settings
    applyAnimationState();

    // Update animation toggle UI
    const animationToggle = document.getElementById('animationToggle');
    if (animationToggle) {
        animationToggle.checked = uiSettings.isAnimationsEnabled;
    }

    // Apply other UI settings as needed
    // ...

    console.log('UI Settings applied:', uiSettings);
}

function getSelectedBanner() {
    const size = document.getElementById('bannerSelect').value;
    if (!size) {
        console.warn('No banner selected');
        return null;
    }
    return size;
}


// Add this function to apply all saved settings for a specific banner size
function applyAllSavedSettings(size) {
    let settings = getSlideSettings(size);

    if (!settings) {
        console.error(`No settings found for size: ${size}`);
        return;
    }

    const layoutSettings = settings.layout || {};
    const elementSettings = settings.elements || {};

    // Define all elements, including the text container
    const elements = {
        'logo-icon': 'logoIcon',
        'logo-title': 'logoTitle',
        'image': 'image',
        'headline': 'headline',
        'text': 'text',
        'tags': 'tags',
        'cta': 'cta',
        'textcontainer': 'textContainer',
        'backdrop': 'backdrop',
        'filter': 'filter',
        'frontdrop': 'frontdrop',
        'backbanner': 'backbanner',
        'path-one': 'pathOne',
        'path-two': 'pathTwo'
    };

    //Apply positions and other properties for all elements
    Object.entries(elements).forEach(([elementId, settingKey]) => {
        const element = document.getElementById(`${elementId}-${size}`);
        if (element) {
            // Apply visibility
            if (elementSettings[settingKey] !== undefined) {
                element.style.display = elementSettings[settingKey] ? 'block' : 'none';
            }

            // Apply position and other properties
            if (layoutSettings[settingKey]) {
                const elementSettings = layoutSettings[settingKey];
                if (elementSettings.position) element.style.position = elementSettings.position;
                if (elementSettings.top) element.style.top = elementSettings.top;
                if (elementSettings.left) element.style.left = elementSettings.left;
                if (elementSettings.width) element.style.width = elementSettings.width;
                if (elementSettings.height) element.style.height = elementSettings.height;
                if (elementSettings.fontSize) element.style.fontSize = elementSettings.fontSize;
                if (elementSettings.zIndex) element.style.zIndex = elementSettings.zIndex;
                if (elementSettings.opacity) element.style.opacity = elementSettings.opacity;
                if (elementSettings.transform) element.style.transform = elementSettings.transform;
                if (elementSettings.display) element.style.display = elementSettings.display;
                if (elementSettings.backgroundColor) element.style.backgroundColor = elementSettings.backgroundColor;
                if (elementSettings.fill) element.setAttribute('fill', elementSettings.fill);
                if (elementSettings.fillOpacity) element.setAttribute('fill-opacity', elementSettings.fillOpacity);
                if (elementSettings.stroke) element.setAttribute('stroke', elementSettings.stroke);
                if (elementSettings.strokeWidth) element.setAttribute('stroke-width', elementSettings.strokeWidth);
                if (elementSettings.strokeOpacity) element.setAttribute('stroke-opacity', elementSettings.strokeOpacity);
                if (elementSettings.filter) element.style.filter = elementSettings.filter;

            }
        }
    });


    // Apply image size
    const image = document.getElementById(`image-${size}`);
    if (image && settings.layout && settings.layout.imageSize) {
        image.style.setProperty('width', settings.layout.imageSize, 'important');
        image.style.setProperty('height', 'auto', 'important');  // Maintain aspect ratio
    }

    // Apply text container size
    const textContainer = document.getElementById(`textcontainer-${size}`);
    if (textContainer && settings.layout && settings.layout.textContainerSize) {
        textContainer.style.setProperty('width', settings.layout.textContainerSize.width, 'important');
        textContainer.style.setProperty('height', settings.layout.textContainerSize.height, 'important');



    }

    // Apply other settings
    if (settings.layout) {
        // Apply positions
        if (settings.layout.positions) {
            Object.entries(settings.layout.positions).forEach(([elementType, position]) => {
                const element = document.getElementById(`${elementType}-${size}`);
                if (element) {
                    element.style.setProperty('position', 'absolute', 'important');
                    element.style.setProperty('top', position.top, 'important');
                    element.style.setProperty('left', position.left, 'important');
                }
            });
        }

        // Apply font sizes
        if (settings.layout.titleSize) {
            const headline = document.getElementById(`headline-${size}`);
            if (headline) headline.style.setProperty('font-size', settings.layout.titleSize, 'important');
        }
        if (settings.layout.bodySize) {
            const text = document.getElementById(`text-${size}`);
            if (text) text.style.setProperty('font-size', settings.layout.bodySize, 'important');
        }

        if (!settings) {
            console.error(`No settings found for size: ${size}`);
            return;
        }

        const layoutSettings = settings.layout || {};
        const elementSettings = settings.elements || {};

        // Apply cta > or text
        const cta = document.getElementById(`cta-${size}`);
        if (cta && layoutSettings.ctaStyle) {
            const currentSlide = storedSlides[currentAdIndex] || {};
            if (layoutSettings.ctaStyle === 'circle') {
                cta.innerText = '>';
                cta.style.padding = '5px 12px';
                cta.style.borderRadius = '100%';
            } else {
                cta.innerText = currentSlide.cta || 'CTA';
                cta.style.padding = '5px 12px';
                cta.style.borderRadius = '4px';
            }
        }

        // Apply element visibility
        Object.entries(elementSettings).forEach(([element, isVisible]) => {
            const el = document.getElementById(`${element}-${size}`);
            if (el) {
                el.style.display = isVisible ? 'block' : 'none';
            }
        });

        // Apply positions
        if (layoutSettings.positions) {
            Object.entries(layoutSettings.positions).forEach(([elementType, position]) => {
                const element = document.getElementById(`${elementType}-${size}`);
                if (element) {
                    if (element.tagName.toLowerCase() === 'path') {
                        element.setAttribute('transform', position);
                    } else {
                        element.style.position = 'absolute';
                        element.style.top = position.top;
                        element.style.left = position.left;
                    }
                }
            });
        }

        // Apply rotations
        if (layoutSettings.rotations) {
            Object.entries(layoutSettings.rotations).forEach(([elementType, rotation]) => {
                const element = document.getElementById(`${elementType}-${size}`);
                if (element) {
                    element.style.transform = `rotate(${rotation}deg)`;
                }
            });
        }

        // Apply scales
        if (layoutSettings.scales) {
            Object.entries(layoutSettings.scales).forEach(([elementType, scale]) => {
                const element = document.getElementById(`${elementType}-${size}`);
                if (element) {
                    element.style.transform = `scale(${scale})`;
                }
            });
        }

        // Apply opacities
        if (layoutSettings.opacities) {
            Object.entries(layoutSettings.opacities).forEach(([elementType, opacity]) => {
                const element = document.getElementById(`${elementType}-${size}`);
                if (elementType === 'backdrop') {
                    const backdropImage = document.getElementById(`backdropimage-${size}`);
                    if (backdropImage) {
                        backdropImage.style.opacity = opacity;
                    }
                } else if (elementType === 'frontdrop') {
                    const frontdropImage = document.getElementById(`frontdropimage-${size}`);
                    if (frontdropImage) {
                        frontdropImage.style.opacity = opacity;
                    }
                } else if (elementType === 'filter') {
                    const filterImage = document.getElementById(`filterimage-${size}`);
                    if (filterImage) {
                        filterImage.style.opacity = opacity;
                    }
                } else if (element) {
                    element.style.opacity = opacity;
                }
            });
        }

        // Apply colors
        if (layoutSettings.colors) {
            Object.entries(layoutSettings.colors).forEach(([elementType, color]) => {
                const element = document.getElementById(`${elementType}-${size}`);
                if (element) {
                    if (elementType === 'backbanner') {
                        element.style.backgroundColor = color;
                    } else if (elementType.startsWith('path')) {
                        element.setAttribute('fill', color);
                    } else {
                        element.style.color = color;
                    }
                }
            });
        }

        // Apply z-index
        if (layoutSettings.zIndex) {
            Object.entries(layoutSettings.zIndex).forEach(([elementType, zIndex]) => {
                const element = document.getElementById(`${elementType}-${size}`);
                if (element) {
                    element.style.zIndex = zIndex;
                }
            });
        }

        // Apply other layout settings
        const image = document.getElementById(`image-${size}`);
        if (image && layoutSettings.imageSize) {
            image.style.width = layoutSettings.imageSize;
        }

        const headline = document.getElementById(`headline-${size}`);
        if (headline && layoutSettings.titleSize) {
            headline.style.fontSize = layoutSettings.titleSize;
        }

        const text = document.getElementById(`text-${size}`);
        if (text && layoutSettings.bodySize) {
            text.style.fontSize = layoutSettings.bodySize;
        }

        const logoIcon = document.getElementById(`logo-icon-${size}`);
        if (logoIcon && layoutSettings.logoRotation !== undefined) {
            logoIcon.style.transform = `rotate(${layoutSettings.logoRotation}deg)`;
        }

        if (layoutSettings.backgroundImage !== undefined) {
            toggleBackground();
        }

        // Apply settings for new elements
        const backgroundBanner = document.getElementById(`backbanner-${size}`);
        if (backgroundBanner && layoutSettings.backgroundBannerStyle) {
            Object.assign(backgroundBanner.style, layoutSettings.backgroundBannerStyle);
        }

        // Apply element visibility
        if (settings.elements) {
            Object.entries(settings.elements).forEach(([element, isVisible]) => {
                const el = document.getElementById(`${element}-${size}`);
                if (el) {
                    el.style.setProperty('display', isVisible ? 'block' : 'none', 'important');
                }
            });
        }
    }
}

// settingsToggle.addEventListener('change', function () {
// uiSettings.isSlideSettings = this.checked;
// saveUISettings();
// const size = getSelectedBanner();
// if (size) {
//     applyAllSavedSettings(size);
//     updateCheckboxStates(size);
//     updateElementsList();
// }
// });

function changeElementBlur(value) {
    if (!selectedElement) return;
    const size = getSelectedBanner();
    const elementType = selectedElement.id.split('-')[0];
    let settings = getSlideSettings(size);

    const blurValue = `blur(${value}px)`;

    if (elementType === 'backdrop') {
        const backdropImage = document.getElementById(`backdropimage-${size}`);
        if (backdropImage) {
            backdropImage.style.filter = blurValue;
        }
    } else if (elementType === 'frontdrop') {
        const frontdropImage = document.getElementById(`frontdropimage-${size}`);
        if (frontdropImage) {
            frontdropImage.style.filter = blurValue;
        }
    } else if (elementType === 'filter') {
        const filterImage = document.getElementById(`filterimage-${size}`);
        if (filterImage) {
            filterImage.style.filter = blurValue;
        }
    } else {
        selectedElement.style.filter = blurValue;
    }

    if (!settings.layout.filters) settings.layout.filters = {};
    settings.layout.filters[elementType] = blurValue;

    saveSettings();
}



function updateElementsList() {
    const size = getSelectedBanner();
    const elementsList = document.getElementById('elements-list');

    console.log('Selected banner size:', size);
    console.log('storedBannerSettings:', storedBannerSettings);

    const settingForSize = storedBannerSettings.find(setting => setting.size === size);

    if (!settingForSize) {
        console.error(`No settings found for banner size: ${size}`);
        return;
    }

    console.log('Settings for selected size:', settingForSize);

    const settings = settingForSize.settings.layout;

    if (!settings) {
        console.error(`No layout settings found for banner size: ${size}`);
        return;
    }

    elementsList.innerHTML = '';
    // Define elements to display
    const elements = [
        { id: `logo-icon-${size}`, name: 'Logo' },
        { id: `logo-title-${size}`, name: 'Logo Title' },
        { id: `image-${size}`, name: 'Image' },
        { id: `headline-${size}`, name: 'Headline' },
        { id: `textcontainer-${size}`, name: 'TextContainer' },
        { id: `text-${size}`, name: 'Text' },
        { id: `tags-${size}`, name: 'Tags' },
        { id: `cta-${size}`, name: 'CTA' },
        { id: `path-one-${size}`, name: 'SVG Wave 1' },
        { id: `path-two-${size}`, name: 'SVG Wave 2' },
        { id: `background-${size}`, name: 'Background' },
        { id: `backdrop-${size}`, name: 'Backdrop' },
        { id: `backdropimage-${size}`, name: 'Backdropimage' },
        { id: `frontdrop-${size}`, name: 'Frontdrop' },
        { id: `frontdropimage-${size}`, name: 'Frontdropimage' },
        { id: `filter-${size}`, name: 'Filter' },
        { id: `filterimage-${size}`, name: 'Filterimage' },
        { id: `backbanner-${size}`, name: 'backbanner' }
    ];

    // Add buttons for each element
    elements.forEach(element => {
        const el = document.getElementById(element.id);
        if (el && (el.style.display !== 'none' || element.name.startsWith('SVG Wave'))) {
            const button = document.createElement('button');
            button.textContent = element.name;
            button.classList.add('px-3', 'py-2', 'rounded', 'mr-2', 'mb-2', 'bg-gray-300', 'hover:bg-gray-400');
            button.onclick = () => selectElement(element.id);
            elementsList.appendChild(button);
            if (settings.zIndex && settings.zIndex[element.name.toLowerCase()]) {
                el.style.zIndex = settings.zIndex[element.name.toLowerCase()];
            }
        }
    });
}

function selectElement(elementId) {
    const clickedElement = document.getElementById(elementId);
    //  console.log('Clicked element:', clickedElement);
    if (selectedElement) {
        const currentZIndex = parseInt(window.getComputedStyle(selectedElement).zIndex) || 0;
        const colorPicker = document.getElementById('element-color');
        if (selectedElement.tagName.toLowerCase() === 'path') {
            colorPicker.value = selectedElement.getAttribute('fill') || '#000000';
        } else {
            const computedColor = window.getComputedStyle(selectedElement).color;
            colorPicker.value = rgbToHex(computedColor);
        }

        // Set blur slider value
        const blurSlider = document.getElementById('element-blur');
        const currentFilter = window.getComputedStyle(selectedElement).filter;
        const blurMatch = currentFilter.match(/blur\((\d+)px\)/);
        blurSlider.value = blurMatch ? blurMatch[1] : 0;
    }
    //  console.log('Selected element:', selectedElement);
    if (selectedElement === clickedElement) {
        deselectElement();
    } else {
        deselectElement();
        selectedElement = clickedElement;
        highlightSelectedElement();
        updateElementButton(elementId, true);

        const opacitySlider = document.getElementById('element-opacity');
        if (elementId.startsWith('path-')) {
            opacitySlider.value = selectedElement.getAttribute('fill-opacity') || 1;
        } else {
            opacitySlider.value = selectedElement.style.opacity || 1;
        }

        const currentZIndex = parseInt(window.getComputedStyle(selectedElement).zIndex) || 0;
        console.log(`Current z-index of ${elementId}: ${currentZIndex}`);
    }
}

function rgbToHex(rgb) {
    if (rgb.startsWith('#')) return rgb;
    const [r, g, b] = rgb.match(/\d+/g);
    return "#" + ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1);
}

function deselectElement() {
    if (selectedElement) {
        selectedElement.classList.remove('ring-2', 'ring-blue-500');
        updateElementButton(selectedElement.id, false);
        selectedElement = null;
    }
}

function updateElementButton(elementId, isActive) {
    const buttons = document.querySelectorAll('#elements-list button');
    buttons.forEach(button => {
        const buttonText = button.textContent.toLowerCase();
        const elementType = elementId.split('-')[0];

        if (elementType === 'path') {
            // Handle SVG path buttons
            const pathNumber = elementId.split('-')[1]; // 'one' or 'two'
            const numbers = ['zero', 'one', 'two', 'three'];

            console.log(buttonText, ' - ', pathNumber);
            if (buttonText === `svg wave ${numbers.indexOf(pathNumber)}`) {
                if (isActive) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            } else {
                button.classList.remove('active');
            }
        } else {
            // Handle other element buttons
            if (buttonText === elementType) {
                if (isActive) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            } else {
                button.classList.remove('active');
            }
        }
    });
}

function highlightSelectedElement() {
    if (selectedElement) {
        selectedElement.classList.add('ring-2', 'ring-blue-500');
    }
}

function changeZIndex(direction) {
    if (!selectedElement) return;

    const size = getSelectedBanner();
    const elementType = selectedElement.id.split('-')[0];
    const currentZIndex = parseInt(window.getComputedStyle(selectedElement).zIndex) || 0;
    const newZIndex = direction === 'up' ? currentZIndex + 10 : Math.max(0, currentZIndex - 10);

    selectedElement.style.zIndex = newZIndex;

    updateSetting(size, 'layout', 'zIndex', elementType, newZIndex);
}

function changeElementColor(color) {
    console.log('Changing color to:', color);
    if (!selectedElement) return;
    console.log('Selected element:', selectedElement);

    const size = getSelectedBanner();
    const bannerSetting = storedBannerSettings.find(setting => setting.size === size);

    if (!bannerSetting || !bannerSetting.settings.layout) {
        console.error(`Settings not found for banner size: ${size}`);
        return;
    }

    const settings = bannerSetting.settings.layout;

    if (!settings.colors) {
        settings.colors = {};
    }

    const elementType = selectedElement.id.split('-')[0];
    console.log('elementType:-->', elementType);

    if (elementType === 'path-one' || elementType === 'path-two') {
        selectedElement.setAttribute('fill', color);
        selectedElement.classList.remove('path-one', 'path-two');
        settings.colors[elementType.replace('-', '')] = color; // Convert 'path-one' to 'pathOne'
    } else if (elementType.split('-')[0] === 'backbanner') {
        console.log("backbanner")
        selectedElement.style.backgroundColor = color;
        settings.colors[elementType] = color;
    } else {
        selectedElement.style.color = color;
        settings.colors[elementType] = color;
    }

    saveSettings();
}



function updateSetting(size, category, subcategory, key, value) {
    const settings = getSlideSettings(size);
    if (!settings[category]) settings[category] = {};
    settings[category][key] = value;
    saveSettings();
  }

function getSetting(size, category, subcategory, key) {
    const setting = storedBannerSettings.find(s => s.size === size);
    if (setting && setting.settings[category] && setting.settings[category][subcategory]) {
        return setting.settings[category][subcategory][key];
    }
    return null; // or a default value
}


function changeBackgroundColor(color) {
    const size = getSelectedBanner();
    const container = document.getElementById(`ad-container-${size}`);
    container.style.backgroundColor = color;

    saveBackgroundColor(color);
}

function saveElementColor(color) {
    const size = getSelectedBanner();
    const settings = getSlideSettings(size).layout;

    if (!settings.colors) {
        settings.colors = {};
    }

    const elementType = selectedElement.id.split('-')[0];
    settings.colors[elementType] = color;

    saveSettings();
}


function saveBackgroundColor(color) {
    const size = getSelectedBanner();
    const settings = getSlideSettings(size).layout;

    if (!settings.colors) {
        settings.colors = {};
    }

    settings.colors.background = color;

    saveSettings();
}

function resetColors() {
    const size = getSelectedBanner();
    const settings = getSlideSettings(size).layout;

    // Reset background color
    const container = document.getElementById(`ad-container-${size}`);
    container.style.backgroundColor = '';

    // Reset element colors
    const elements = container.querySelectorAll('*');
    elements.forEach(element => {
        if (element.tagName.toLowerCase() === 'path') {
            element.removeAttribute('fill');
        } else {
            element.style.color = '';
        }
    });

    // Clear saved colors
    if (settings.colors) {
        delete settings.colors;
    }

    // Reset color inputs
    document.getElementById('element-color').value = '#000000';
    document.getElementById('background-color').value = '#ffffff';

    saveSettings();
}

function applyStoredColors() {
    const size = getSelectedBanner();
    const bannerSetting = storedBannerSettings.find(setting => setting.size === size);

    if (!bannerSetting || !bannerSetting.settings.layout) {
        console.error(`Settings not found for banner size: ${size}`);
        return;
    }

    const settings = bannerSetting.settings.layout;

    if (settings.colors) {
        // Apply background color
        if (settings.colors.background) {
            const container = document.getElementById(`ad-container-${size}`);
            container.style.backgroundColor = settings.colors.background;
            document.getElementById('background-color').value = settings.colors.background;
        }

        // Apply element colors
        Object.entries(settings.colors).forEach(([elementType, color]) => {
            const elementId = elementType.startsWith('path') ? elementType.replace(/([A-Z])/g, '-$1').toLowerCase() : elementType.split('-')[0]
            const element = document.getElementById(`${elementId.replace('path', 'path-')}-${size}`);
            console.log("--+", elementId.slice('path'), element)
            if (element) {
                console.log("--->", elementType)
                if (elementType === 'pathone' || elementType === 'pathtwo') {
                    element.setAttribute('fill', color);
                    if (elementType === 'pathone') {
                        element.classList.remove('path-one');
                    }
                    if (elementType === 'pathtwo') {
                        element.classList.remove('path-two');
                    }
                } else if (elementType.split('-')[0] === 'backbanner') {
                    element.style.backgroundColor = color;
                } else {
                    element.style.color = color;
                }
            }
        });
    }
}

// Update the moveElement function
function moveElement(direction, step = 5) {
    if (!selectedElement) return;

    const size = getSelectedBanner();
    if (!size) {
        console.warn('No banner selected');
        return;
    }

    const elementType = selectedElement.id.split('-')[0];

    // Find the settings object, accounting for slide-specific settings
    let settings = getSlideSettings(size);

    // Ensure layout settings exist
    if (!settings.layout) {
        settings.layout = {};
    }

    if (selectedElement.tagName.toLowerCase() === 'path') {
        // SVG path handling
        const currentTransform = selectedElement.getAttribute('transform') || '';
        let currentX = 0;
        let currentY = 0;
        const match = currentTransform.match(/translate\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/);
        if (match) {
            currentX = parseFloat(match[1]);
            currentY = parseFloat(match[2]);
        }
        switch (direction) {
            case 'up': currentY -= step; break;
            case 'down': currentY += step; break;
            case 'left': currentX -= step; break;
            case 'right': currentX += step; break;
        }
        const newTransform = `translate(${currentX}, ${currentY})`;
        selectedElement.setAttribute('transform', newTransform);
        if (!settings.layout.positions) settings.layout.positions = {};
        settings.layout.positions[elementType] = newTransform;
    } else {
        // Non-SVG element handling
        const computedStyle = window.getComputedStyle(selectedElement);
        let currentTop = parseInt(selectedElement.style.top) || parseInt(computedStyle.top) || 0;
        let currentLeft = parseInt(selectedElement.style.left) || parseInt(computedStyle.left) || 0;

        switch (direction) {
            case 'up': currentTop -= step; break;
            case 'down': currentTop += step; break;
            case 'left': currentLeft -= step; break;
            case 'right': currentLeft += step; break;
        }

        selectedElement.style.position = 'absolute';
        selectedElement.style.top = `${currentTop}px`;
        selectedElement.style.left = `${currentLeft}px`;

        if (!settings.layout.positions) settings.layout.positions = {};
        settings.layout.positions[elementType] = { top: `${currentTop}px`, left: `${currentLeft}px` };
    }

    saveSettings();

    console.log(`Moved ${elementType} ${direction} by ${step}px`);
}


function getElementSettings(size) {
    if (uiSettings.isSlideSettings && storedSlides[currentAdIndex] && storedSlides[currentAdIndex].settings) {
        return storedSlides[currentAdIndex].settings;
    } else {
        const bannerSetting = storedBannerSettings.find(setting => setting.size === size);
        if (!bannerSetting || !bannerSetting.settings) {
            console.error(`No settings found for banner size: ${size}`);
            return null;
        }
        return bannerSetting.settings;
    }
}

function someElementFunction(params) {
    if (!selectedElement) return;

    const size = getSelectedBanner();
    if (!size) {
        console.warn('No banner selected');
        return;
    }

    const settings = getElementSettings(size);
    if (!settings) return;

    // Ensure necessary nested objects exist
    if (!settings.layout) settings.layout = {};
    if (!settings.layout.someProperty) settings.layout.someProperty = {};

    // Rest of your function logic here
    // ...

    saveSettings();
}


// Update the changeZIndex function to increase/decrease by a larger step if Shift is pressed
function changeZIndex(direction) {
    if (!selectedElement) return;
    const size = getSelectedBanner();
    const elementType = selectedElement.id.split('-')[0];
    let settings = getSlideSettings(size);

    const currentZIndex = parseInt(window.getComputedStyle(selectedElement).zIndex) || 0;
    const newZIndex = direction === 'up' ? currentZIndex + 10 : Math.max(0, currentZIndex - 10);

    selectedElement.style.zIndex = newZIndex;

    if (!settings.layout.zIndex) settings.layout.zIndex = {};
    settings.layout.zIndex[elementType] = newZIndex;

    saveSettings();
}

// Update the rotateElement function
function rotateElement(direction) {
    if (!selectedElement) return;
    const size = getSelectedBanner();
    const elementType = selectedElement.id.split('-')[0];
    let settings = getSlideSettings(size);

    const currentRotation = selectedElement.style.transform ?
        parseInt(selectedElement.style.transform.replace(/[^\d-]/g, '')) : 0;
    const newRotation = direction === 'left' ? currentRotation - 15 : currentRotation + 15;
    selectedElement.style.transform = `rotate(${newRotation}deg)`;

    if (!settings.layout.rotations) settings.layout.rotations = {};
    settings.layout.rotations[elementType] = newRotation;

    saveSettings();
}

// do the same with rotateElment to mirrorElemnt below



// Update the mirrorElement function
function mirrorElement() {
    if (!selectedElement) return;
    const size = getSelectedBanner();
    const elementType = selectedElement.id.split('-')[0];
    let settings = getSlideSettings(size);

    const currentScale = selectedElement.style.transform && selectedElement.style.transform.includes('scale')
        ? parseInt(selectedElement.style.transform.split('scale(')[1])
        : 1;
    const newScale = -currentScale;
    selectedElement.style.transform = `scale(${newScale}, 1)`;

    // Save the new scale
    if (!settings.layout.scales) settings.layout.scales = {};
    settings.layout.scales[elementType] = newScale;

    saveSettings();
}

// Update the resizeElement function
function resizeElement(direction) {
    if (!selectedElement) return;

    const size = getSelectedBanner();
    if (!size) {
        console.warn('No banner selected');
        return;
    }

    const elementType = selectedElement.id.split('-')[0];

    // Find the settings object, accounting for slide-specific settings
    let settings = getSlideSettings(size);

    // Ensure layout settings exist
    if (!settings.layout) {
        settings.layout = {};
    }

    // Get current scale
    const currentScale = selectedElement.style.transform && selectedElement.style.transform.includes('scale')
        ? parseFloat(selectedElement.style.transform.split('scale(')[1])
        : 1;

    // Calculate new scale
    const newScale = direction === 'up' ? currentScale * 1.1 : currentScale * 0.9;

    // Apply new scale
    selectedElement.style.transform = `scale(${newScale})`;

    // Save the new scale
    if (!settings.layout.scales) {
        settings.layout.scales = {};
    }
    settings.layout.scales[elementType] = newScale;

    // Save settings
    saveSettings();

    console.log(`Resized ${elementType} to scale: ${newScale}`);
}

// Update the changeElementOpacity function
function changeElementOpacity(value) {
    if (!selectedElement) return;
    const size = getSelectedBanner();
    const elementType = selectedElement.id.split('-')[0];
    let settings = getSlideSettings(size);

    if (selectedElement.id.startsWith('path-')) {
        selectedElement.setAttribute('fill-opacity', value);
        const svgNumber = selectedElement.id.includes('one') ? 'One' : 'Two';
        if (!settings.layout.opacities) settings.layout.opacities = {};
        settings.layout.opacities[`svg${svgNumber}Opacity`] = value;
    } else {
        selectedElement.style.opacity = value;
        if (!settings.layout.opacities) settings.layout.opacities = {};
        settings.layout.opacities[elementType] = value;
    }

    saveSettings();
}


// Update the applyElementPositions function
function applyElementPositions() {
    const size = getSelectedBanner();
    let settings = getSlideSettings(size);


    if (settings.layout.positions) {
        Object.entries(settings.layout.positions).forEach(([elementType, position]) => {
            const element = document.getElementById(`${elementType}-${size}`);
            if (element) {
                if (element.tagName.toLowerCase() === 'path') {
                    element.setAttribute('transform', position);
                } else {
                    element.style.position = 'absolute';
                    element.style.top = position.top;
                    element.style.left = position.left;
                }
            }
        });
    }

    if (settings.layout.rotations) {
        Object.entries(settings.layout.rotations).forEach(([elementType, rotation]) => {
            const element = document.getElementById(`${elementType}-${size}`);
            if (element) {
                element.style.transform = `rotate(${rotation}deg)`;
            }
        });
    }

    if (settings.layout.scales) {
        Object.entries(settings.layout.scales).forEach(([elementType, scale]) => {
            const element = document.getElementById(`${elementType}-${size}`);
            if (element) {
                element.style.transform = `scale(${scale})`;
            }
        });
    }

    if (settings.layout.opacities) {
        Object.entries(settings.layout.opacities).forEach(([elementType, opacity]) => {
            const element = document.getElementById(`${elementType}-${size}`);
            if (element) {
                if (elementType.startsWith('svg')) {
                    element.setAttribute('fill-opacity', opacity);
                } else {
                    element.style.opacity = opacity;
                }
            }
        });
    }

    applyStoredColors();
}

function resetElement() {
    if (!selectedElement) return;

    const size = getSelectedBanner();
    const elementType = selectedElement.id.split('-')[0];
    const settings = getSlideSettings(size).layout;

    // Reset position
    selectedElement.style.top = '';
    selectedElement.style.left = '';
    selectedElement.style.position = '';
    if (settings.positions) delete settings.positions[elementType];

    // Reset transform (rotation and scale)
    selectedElement.style.transform = '';
    if (settings.rotations) delete settings.rotations[elementType];
    if (settings.scales) delete settings.scales[elementType];

    // Reset opacity
    if (selectedElement.id.startsWith('path-')) {
        selectedElement.setAttribute('fill-opacity', '1');
        selectedElement.classList.remove('path-one', 'path-two');
        const svgNumber = selectedElement.id.includes('one') ? 'One' : 'Two';
        if (settings.opacities) settings.opacities[`svg${svgNumber}Opacity`] = 1;
    } else {
        selectedElement.style.opacity = '';
        if (settings.opacities) delete settings.opacities[elementType];
    }

    // Reset z-index
    selectedElement.style.zIndex = '';
    if (settings.zIndex) delete settings.zIndex[elementType];

    // Reset color
    if (elementType === 'path-one' || elementType === 'path-two') {
        selectedElement.removeAttribute('fill');
        if (settings.colors) delete settings.colors[elementType.replace('-', '')];
    } else {
        selectedElement.style.color = '';
        if (settings.colors) delete settings.colors[elementType];
    }

    document.getElementById('element-opacity').value = 1;
    highlightSelectedElement();

    saveSettings();

    console.log(`Element reset: ${selectedElement.id}`);
}

function updateCheckboxStates(size) {
    let settings = getSlideSettings(size).elements;
    
    const elements = {
        'logo-icon': 'logoIcon',
        'image': 'image',
        'headline': 'headline',
        'text': 'text',
        'tags': 'tags',
        'cta': 'cta',
        'svg-wave': 'svgWave',
        'textcontainer': 'textContainer',
        'backdrop': 'backdrop',
        'filter': 'filter',
        'frontdrop': 'frontdrop',
        'backbanner': 'backbanner'

    };

    Object.keys(elements).forEach(element => {
        const checkbox = document.getElementById(`toggle-${element}`);
        if (checkbox) {
            checkbox.checked = settings[elements[element]];
        }
        const el = document.getElementById(`${element}-${size}`);
        if (el) {
            el.style.display = settings[elements[element]] ? 'block' : 'none';
        }
    });

    const backgroundCheckbox = document.getElementById('toggle-background');
    if (backgroundCheckbox) {
        backgroundCheckbox.checked = settings.backgroundImage;
    }
    const container = document.getElementById(`ad-container-${size}`);
    const image = document.getElementById(`image-${size}`);
    if (container && image) {
        if (settings.backgroundImage) {
            container.style.backgroundImage = `url(${image.src})`;
            container.style.backgroundSize = 'cover';
            container.style.backgroundPosition = 'center';
            image.style.display = 'none';
        } else {
            container.style.backgroundImage = '';
            image.style.display = settings.image ? 'block' : 'none';
        }
    }
}

function selectBanner(size) {
    const selectedBanner = document.getElementById(`ad-container-${size}`);
    document.getElementById('bannerSelect').value = size;
    if (selectedBanner.classList.contains('border-blue-500')) {
        selectedBanner.classList.remove('border-blue-500', 'shadow-xl', 'ring-4', 'ring-blue-300');
        document.getElementById('bannerSelect').value = '';
    } else {
        document.querySelectorAll('.border-blue-500').forEach(el => el.classList.remove('border-blue-500', 'shadow-xl', 'ring-4', 'ring-blue-300'));
        selectedBanner.classList.add('border-blue-500', 'shadow-xl', 'ring-4', 'ring-blue-300');
    }

    applyAllSavedSettings(size);
    updateSliderValues(size);
    updateCheckboxStates(size);
    updateElementsList();
    updateVisibilityChecklist(size);

    selectedElement = null;
    highlightSelectedElement();
    deselectElement();
}



function updateSliderValues(size) {
    const settings = getSlideSettings(size).layout;
    if (settings) {
        if (settings.opacities) {
            if (settings.opacities.svgOneOpacity !== undefined) {
                const sliderOne = document.getElementById('svg-one-opacity');
                if (sliderOne) {
                    sliderOne.value = settings.opacities.svgOneOpacity;
                }
            }
            if (settings.opacities.svgTwoOpacity !== undefined) {
                const sliderTwo = document.getElementById('svg-two-opacity');
                if (sliderTwo) {
                    sliderTwo.value = settings.opacities.svgTwoOpacity;
                }
            }
        }
        if (settings.imageOpacity !== undefined) {
            const imageOpacitySlider = document.getElementById('image-opacity');
            if (imageOpacitySlider) {
                imageOpacitySlider.value = settings.imageOpacity;
            }
        }
        if (settings.titleSize) {
            const titleSizeSlider = document.getElementById('title-size');
            if (titleSizeSlider) {
                titleSizeSlider.value = settings.titleSize.replace('rem', '');
            }
        }
        if (settings.bodySize) {
            const bodySizeSlider = document.getElementById('body-size');
            if (bodySizeSlider) {
                bodySizeSlider.value = settings.bodySize.replace('rem', '');
            }
        }
        if (settings.imageSize) {
            const imageSizeSlider = document.getElementById('image-size');
            if (imageSizeSlider) {
                imageSizeSlider.value = settings.imageSize.replace('%', '');
            }
        }
        if (settings.logoRotation !== undefined) {
            const logoIcon = document.getElementById(`logo-icon-${size}`);
            if (logoIcon) {
                logoIcon.style.transform = `rotate(${settings.logoRotation}deg)`;
            }
        }
    }
}


function saveSettings() {
    const size = getSelectedBanner();
    console.log('Saving settings for size:', size);

    if (!size) {
        console.error('No banner size selected. Cannot save settings.');
        alert('Please select a banner size before saving.');
        return;
    }

    if (uiSettings.isSlideSettings) {
        if (!storedSlides[currentAdIndex]) {
            console.error('Current slide index is invalid:', currentAdIndex);
            return;
        }

        if (!storedSlides[currentAdIndex].settings) {
            storedSlides[currentAdIndex].settings = { size: {} };
        }

        if (!storedSlides[currentAdIndex].settings.size) {
            storedSlides[currentAdIndex].settings.size = {};
        }

        if (!storedSlides[currentAdIndex].settings.size[size]) {
            console.warn(`No settings found for size ${size}. Initializing with default settings.`);
            const defaultSettings = {
                elements: {},
                layout: {}
            };
            storedSlides[currentAdIndex].settings.size[size] = defaultSettings;
        }

        localStorage.setItem('slides', JSON.stringify(storedSlides));
    } else {
        let bannerSetting = storedBannerSettings.find(setting => setting.size === size);
        if (!bannerSetting) {
            console.warn(`No banner settings found for size ${size}. Adding default settings.`);
            bannerSetting = {
                size: size,
                settings: {
                    elements: {},
                    layout: {}
                }
            };
            storedBannerSettings.push(bannerSetting);
        }

        if (!bannerSetting.settings) {
            bannerSetting.settings = {
                elements: {},
                layout: {}
            };
        }

        localStorage.setItem('bannerSettings', JSON.stringify(storedBannerSettings));
    }

    // Save other settings as before
    localStorage.setItem('images', JSON.stringify(storedImages));
    localStorage.setItem('filters', JSON.stringify(storedFilters));
    localStorage.setItem('campaigns', JSON.stringify(storedCampaigns));
    localStorage.setItem('campaign', JSON.stringify(storedCampaign));
    localStorage.setItem('currentCampaignIndex', JSON.stringify(currentCampaignIndex));
    localStorage.setItem('currentAdIndex', JSON.stringify(currentAdIndex));
    localStorage.setItem('currentImageIndex', JSON.stringify(currentImageIndex));

    console.log('Settings saved successfully');
}

function toggleElement(element) {
    const size = getSelectedBanner();
    if (!size) {
        console.warn('No banner selected');
        return;
    }
    let el = document.getElementById(`${element}-${size}`);
    if (!el) return;

    const isVisible = el.style.display !== 'none';
    el.style.display = isVisible ? 'none' : 'block';

    let settings=getSlideSettings(size).elements;

    const elementKey = {
        'logo-icon': 'logoIcon',
        'svg-wave': 'svgWave',
        'image': 'image',
        'headline': 'headline',
        'text': 'text',
        'tags': 'tags',
        'cta': 'cta',
        'textcontainer': 'textContainer',
        'frontdrop': 'frontdrop',
        'backdrop': 'backdrop',
        'filter': 'filter',
        'backbanner': 'backbanner'
    }[element] || element;

    settings[elementKey] = !isVisible;

    console.log(`Toggled ${element}:`, !isVisible); // Debug log

    saveSettings();
    updateElementsList();
}

function updateSpecialElementVisibility(element, size) {
    const container = document.getElementById(`${element}-${size}`);
    const image = document.getElementById(`${element}image-${size}`);
    if (container && image) {
        const isVisible = container.style.display !== 'none';
        container.style.display = isVisible ? 'block' : 'none';
        image.style.display = isVisible ? 'block' : 'none';
    }
}

function updateVisibilityChecklist(size) {
    const settings = getSlideSettings(size).elements;

    const elements = {
        'logo-icon': 'logoIcon',
        'image': 'image',
        'headline': 'headline',
        'text': 'text',
        'tags': 'tags',
        'cta': 'cta',
        'svg-wave': 'svgWave',
        'textcontainer': 'textContainer',
        'backdrop': 'backdrop',
        'filter': 'filter',
        'frontdrop': 'frontdrop',
        'backbanner': 'backbanner'
    };

    Object.entries(elements).forEach(([elementId, settingKey]) => {
        const checkbox = document.getElementById(`toggle-${elementId}`);
        if (checkbox) {
            checkbox.checked = settings[settingKey];
        }
    });

    // Handle background toggle separately
    const backgroundCheckbox = document.getElementById('toggle-background');
    if (backgroundCheckbox) {
        backgroundCheckbox.checked = settings.backgroundImage;
    }
}


async function downloslidesettings() {
    await convertAllTimestampsToMinutes();
    const settingsToDownload = {
        slides: storedSlides,
        bannerSettings: storedBannerSettings,
        images: storedImages
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settingsToDownload));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "settings.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    await convertAllTimestampsToMilliseconds();
}

async function uploslidesettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
            const content = readerEvent.target.result;
            const parsed = JSON.parse(content);
            if (parsed.slides && parsed.bannerSettings && parsed.images) {
                localStorage.setItem('slides', JSON.stringify(parsed.slides));
                localStorage.setItem('bannerSettings', JSON.stringify(parsed.bannerSettings));
                localStorage.setItem('images', JSON.stringify(parsed.images));
                location.reload(); // reload to apply the new settings
            } else {
                alert("Invalid settings file");
            }
        }
    }
    input.click();
}

function toggleLogoLayout() {
    const size = getSelectedBanner();
    const logoIcon = document.getElementById(`logo-icon-${size}`);
    const settings = getSlideSettings(size).layout;
    if (logoIcon.classList.contains('flex-row')) {
        logoIcon.classList.remove('flex-row');
        logoIcon.classList.add('flex-col');
        settings.logoLayout = 'flex-col';
    } else {
        logoIcon.classList.remove('flex-col');
        logoIcon.classList.add('flex-row');
        settings.logoLayout = 'flex-row';
    }
    saveSettings();
}

function rotateLogo() {
    const size = getSelectedBanner();
    const container = document.getElementById(`logo-icon-${size}`);
    const currentRotation = container.style.transform || 'rotate(0deg)';
    const newRotation = currentRotation === 'rotate(0deg)' ? 'rotate(90deg)' : 'rotate(0deg)';
    container.style.transform = newRotation;
    const settings = getSlideSettings(size).layout;
    settings.logoRotation = newRotation === 'rotate(0deg)' ? 0 : 90;

    // Swap width and height and rotate 90 degrees and height to auto
    const width = container.style.width;
    container.style.width = container.style.height;
    container.style.height = width;

    // swap width to original value when rotating back
    if (newRotation === 'rotate(0deg)') {
        container.style.height = width;
        container.style.width = '84px';
        container.style.marginTop = '0px';
    } else {
        container.style.height = '32px';
        container.style.width = '20px';
        container.style.marginTop = size === '160x600' || size === '480x120' || size === '300x250-text' || size === '300x250' || size === '728x90'
            ? '-93px' : '0px';
    }
    saveSettings();
}

function updateLogoRotation() {
    const size = getSelectedBanner();
    const rotation = document.getElementById('logo-rotation').value;
    const logoIcon = document.getElementById(`logo-icon-${size}`);
    if (logoIcon) {
        logoIcon.style.transform = `rotate(${rotation}deg)`;
    }
    const settings = getSlideSettings(size).layout;
    settings.logoRotation = rotation;
    saveSettings();
}

function updateTextLength() {
    const size = getSelectedBanner();
    const textElement = document.getElementById(`text-${size}`);
    const settings = getSlideSettings(size).layout;
    const adTextArray = storedSlides[currentAdIndex].text;

    // Cycle through text lengths
    settings.textLength = (settings.textLength + 1) % adTextArray.length;
    textElement.innerText = adTextArray[settings.textLength];
    saveSettings();
}


function updateLogo(size) {
    const logoIcon = document.getElementById(`logo-icon-${size}`);
    const logo = storedSlides[currentAdIndex].logo;
    let iconHtml = '';
    if (logo.icon.startsWith('img/')) {
        iconHtml = `<img src="${logo.icon}" alt="Logo" style="width: 24px; height: 24px;">`;
    } else {
        iconHtml = `<i class="fa ${logo.icon} mr-1" aria-hidden="true"></i>`;
    }
    logoIcon.innerHTML = `
        <div class="flex items-center scale-95 ${logoIcon.classList.contains('flex-col') ? 'flex-col' : 'flex-row'}">
            ${iconHtml}
            <a href="https://octopus.energy" class="${logoIcon.classList.contains('flex-col') ? 'text-center' : ''}">
                <span style="font-weight:700;">${logo.firstWord}</span>${logo.secondWord}
            </a>
        </div>
    `;
}

function changeElementZIndex(elementType, action) {
    const size = getSelectedBanner();
    if (!size) {
        console.warn('No banner selected');
        return;
    }

    const elementMap = {
        'logo-icon': 'logoIcon',
        'svg-wave': 'svgWave',
        'path-one': 'pathOne',
        'path-two': 'pathTwo',
        'image': 'image',
        'headline': 'headline',
        'text': 'text',
        'tags': 'tags',
        'cta': 'cta',
        'background': 'backgroundImage',
        'logo-title': 'logoTitle',
        'textcontainer': 'textContainer',
        'backdrop': 'backdrop',
        'filter': 'filter',
        'frontdrop': 'frontdrop',
        'backbanner': 'backbanner'
    };

    const elementId = `${elementType}-${size}`;
    const element = document.getElementById(elementId);

    if (!element) {
        console.warn(`Element not found: ${elementId}`);
        return;
    }

    let zIndex = parseInt(window.getComputedStyle(element).zIndex, 10);
    zIndex = isNaN(zIndex) ? 10 : zIndex;

    if (action === 'increase') {
        zIndex += 10;
    } else if (action === 'decrease') {
        zIndex = Math.max(1, zIndex - 10);
    } else {
        console.warn('Invalid action. Use "increase" or "decrease".');
        return;
    }

    element.style.zIndex = zIndex;

    const settings = getSlideSettings(size).layout;
    const settingKey = `${elementMap[elementType]}ZIndex`;
    settings[settingKey] = zIndex;
    saveSettings();

    console.log(`${action === 'increase' ? 'Increased' : 'Decreased'} z-index for ${elementType} to ${zIndex}`);
}

// TODO: delete this 2 functions

// Functions to control image z-index
function increaseImageZIndex() {
    const size = getSelectedBanner();
    const image = document.getElementById(`image-${size}`);

    if (!image) {
        console.warn(`Image element not found for size: ${size}`);
        return;
    }

    let zIndex = parseInt(window.getComputedStyle(image).zIndex, 10);
    zIndex = isNaN(zIndex) ? 10 : zIndex + 10;
    image.style.zIndex = zIndex;

    const settings = getSlideSettings(size).layout;
    settings.imageZIndex = zIndex;
    saveSettings();

    console.log(`Increased z-index for ${size} image to ${zIndex}`);
}



function decreaseImageZIndex() {
    const size = getSelectedBanner();
    const image = document.getElementById(`image-${size}`);

    if (!image) {
        console.warn(`Image element not found for size: ${size}`);
        return;
    }

    let zIndex = parseInt(window.getComputedStyle(image).zIndex, 10);
    zIndex = isNaN(zIndex) ? 10 : Math.max(1, zIndex - 10);
    image.style.zIndex = zIndex;

    const settings = getSlideSettings(size).layout;
    settings.imageZIndex = zIndex;
    saveSettings();

    console.log(`Decreased z-index for ${size} image to ${zIndex}`);
}

function updateTitleSize() {
    const size = getSelectedBanner();
    const titleSize = document.getElementById('title-size').value + 'rem';
    const headline = document.getElementById(`headline-${size}`);
    if (headline) {
        headline.style.fontSize = titleSize;
        headline.style.lineHeight = titleSize;
    }
    const settings = getSlideSettings(size).layout;
    settings.titleSize = titleSize;
    saveSettings();
}

function updateBodySize() {
    const size = getSelectedBanner();
    const bodySize = document.getElementById('body-size').value + 'rem';
    const text = document.getElementById(`text-${size}`);
    if (text) {
        text.style.fontSize = bodySize;
    }
    const settings = getSlideSettings(size).layout;
    settings.bodySize = bodySize;
    saveSettings();
}

function updateImageSize() {
    const size = getSelectedBanner();
    const imageSize = document.getElementById('image-size').value + '%';
    const image = document.getElementById(`image-${size}`);
    if (image) {
        image.style.width = imageSize;
    }
    const settings = getSlideSettings(size).layout;
    settings.imageSize = imageSize;
    saveSettings();
}

function updateTextLength() {
    const size = getSelectedBanner();
    const textElement = document.getElementById(`text-${size}`);
    const settings = getSlideSettings(size).layout;
    const adTextArray = storedSlides[currentAdIndex].text;

    // Cycle through text lengths
    settings.textLength = (settings.textLength + 1) % adTextArray.length;
    textElement.innerText = adTextArray[settings.textLength];
    saveSettings();
}

function updateImages() {
    sizes.forEach(size => {
        document.getElementById(`image-${size}`).src = storedImages[currentImageIndex];
    });
}

function playFirstAudioAndRunSlides() {
    const audioPlayer = document.getElementById('audioPlayer');
    const playButton = document.getElementById('playAudioButton');
    const timelineSlider = document.getElementById('timelineSlider');

    if (audioStarted && !audioPlayer.paused) {
        // Pause functionality
        pauseAutoPlay();
        playButton.innerHTML = '<i class="fas fa-play w-10"></i>';
        playButton.classList.remove('active');
        isAutoPlayActive = false;
    } else {
        // Play functionality
        if (!audioStarted) {
            const firstAdAudioSrc = storedSlides[0].audio;
            if (firstAdAudioSrc) {
                audioPlayer.src = firstAdAudioSrc;
                audioPlayer.load(); // Force the audio to load
            }
        }

        // Set audio time based on slider position
        const sliderTime = parseInt(timelineSlider.value) / 1000; // Convert to seconds
        audioPlayer.currentTime = sliderTime;

        // Update startTime and find the correct current index
        startTime = Date.now() - (sliderTime * 1000);
        currentAdIndex = findAdIndexForTime(sliderTime * 1000);

        audioPlayer.play().then(() => {
            audioStarted = true;
            startAutoPlay();
            startCounter();
            playButton.innerHTML = '<i class="fas fa-pause w-10"></i>';
            playButton.classList.add('active');
            isAutoPlayActive = true;
            updateTimelineMarkers(); // Update markers when playback starts
        }).catch(error => {
            console.log('Audio play error:', error);
            audioPlayer.pause();
            isAutoPlayActive = false;
        });
    }
}

// Helper function to find the correct ad index for a given time
function findAdIndexForTime(time) {
    let index = 0;
    while (index < storedSlides.length - 1 && getCurrentAdTimestamp(index + 1) <= time) {
        index++;
    }
    return index;
}

function goBack(seconds) {
    const audioPlayer = document.getElementById('audioPlayer');
    const newTime = Math.max(0, audioPlayer.currentTime - seconds);
    adjustPlaybackTime(newTime);
}

function goForward(seconds) {
    const audioPlayer = document.getElementById('audioPlayer');
    const newTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + seconds);
    adjustPlaybackTime(newTime);
}

function adjustPlaybackTime(newTimeInSeconds) {
    const audioPlayer = document.getElementById('audioPlayer');

    // Set the new audio time
    audioPlayer.currentTime = newTimeInSeconds;

    // Calculate the new timestamp in milliseconds
    const newTimestamp = newTimeInSeconds * 1000;

    // Update the startTime to reflect the new position
    startTime = Date.now() - newTimestamp;

    // Find the correct ad index for the new time
    let newIndex = 0;
    while (newIndex < storedSlides.length - 1 && getCurrentAdTimestamp(newIndex + 1) <= newTimestamp) {
        newIndex++;
    }

    // Update current index and slides if necessary
    if (newIndex !== currentAdIndex) {
        currentAdIndex = newIndex;
        updateSlides();
    }

    // Clear existing timeout and schedule next ad
    if (autoPlayTimeout) {
        clearTimeout(autoPlayTimeout);
    }
    scheduleNextAd();

    // Update counter and slider
    updateCounter();
    updateSliderPosition();
}


function pauseAutoPlay() {
    if (autoPlayTimeout) {
        clearTimeout(autoPlayTimeout);
        autoPlayTimeout = null;
    }
    audioPlayer.pause();
    stopCounter();
    pauseStartTime = Date.now();
    isAutoPlayActive = false;
}

function startAutoPlay() {
    if (pauseStartTime !== null) {
        pausedTime += Date.now() - pauseStartTime;
        pauseStartTime = null;
    }
    isAutoPlayActive = true;
    if (!autoPlayTimeout) {
        scheduleNextAd();
    }
}

function stopAutoPlay() {
    const audioPlayer = document.getElementById('audioPlayer');
    const stopButton = document.getElementById('stopAudioButton');
    if (autoPlayTimeout) {
        clearTimeout(autoPlayTimeout);
        autoPlayTimeout = null;
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        if (stopButton) {
            stopButton.classList.remove('active');
        }
    }
    stopCounter();
    isAutoPlayActive = false;
}

function restartAutoPlay() {
    const audioPlayer = document.getElementById('audioPlayer');
    const playButton = document.getElementById('playAudioButton');
    const timelineSlider = document.getElementById('timelineSlider');

    // Stop current playback
    if (autoPlayTimeout) {
        clearTimeout(autoPlayTimeout);
        autoPlayTimeout = null;
    }
    stopCounter();

    // Reset all variables
    currentAdIndex = 0;
    startTime = Date.now();
    pausedTime = 0;
    pauseStartTime = null;

    // Reset audio
    audioPlayer.currentTime = 0;
    audioPlayer.pause();

    // Update UI
    updateSlides();
    updateCounter();
    timelineSlider.value = 0;

    // Start playback
    audioPlayer.play().then(() => {
        audioStarted = true;
        startAutoPlay();
        startCounter();
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        playButton.classList.add('active');
    }).catch(error => {
        console.log('Audio play error:', error);
        audioPlayer.pause();
    });
}

function getCurrentAdTimestamp(index) {
    if (index < 0 || index >= storedSlides.length) {
        console.error(`Invalid index: ${index}. storedSlides length: ${storedSlides.length}`);
        return 0; // Return 0 or some default value
    }
    const timestamp = storedSlides[index].timestamp;
    return timestamp !== undefined ? timestamp : 0; // Return 0 if timestamp is undefined
}

function updateCounter() {
    const audioPlayer = document.getElementById('audioPlayer');
    const currentTime = audioPlayer.currentTime * 1000; // Convert to milliseconds
    document.getElementById('timeCounter').innerText = formatTimestamp(currentTime);
    updateSliderPosition();
    updateTimelineMarkers(); // Update markers continuously during playback
}

function scheduleNextAd() {
    const audioPlayer = document.getElementById('audioPlayer');
    const currentTime = audioPlayer.currentTime * 1000; // Convert to milliseconds

    if (currentTime >= totalDuration) {
        // Audio has ended, stop scheduling
        return;
    }

    if (currentAdIndex < storedSlides.length - 1) {
        const nextAdIndex = currentAdIndex + 1;
        const nextAdTime = getCurrentAdTimestamp(nextAdIndex);

        const delay = nextAdTime - currentTime;

        if (isAutoPlayActive) {
            const currentAd = storedSlides[currentAdIndex];
            const currentAnimation = currentAd.animation || {};
            const currentTemplate = animationTemplates.find(t => t.id === currentAnimation.template);
            const exitDuration = currentTemplate ? currentTemplate.exit.settings.duration + currentTemplate.exit.settings.delay : 0;

            autoPlayTimeout = setTimeout(() => {
                handleExitAnimations(() => {
                    currentAdIndex = nextAdIndex;
                    updateSlides();
                    scheduleNextAd();
                });
            }, Math.max(delay - exitDuration, 0));
        }
    } else {
        // We're past the last ad, so just update the slider position
        autoPlayTimeout = setTimeout(() => {
            updateSliderPosition();
            scheduleNextAd(); // Keep calling this to continue updating the slider
        }, 1000); // Update every second
    }
}

// function toggleMoveMarker() {
//     const moveMarkerButton = document.getElementById('moveMarkerButton');
//     isMoveMarkerActive = !isMoveMarkerActive;

//     if (isMoveMarkerActive) {
//         moveMarkerButton.classList.add('active', 'bg-blue-500', 'text-white');
//         moveMarkerButton.classList.remove('bg-gray-300');
//     } else {
//         moveMarkerButton.classList.remove('active', 'bg-blue-500', 'text-white');
//         moveMarkerButton.classList.add('bg-gray-300');
//     }
// }

function toggleMoveMarker(index) {
    isMoveMarkerActive = !isMoveMarkerActive;
    const moveMarkerButton = document.getElementById('moveMarkerButton');
    const markers = document.querySelectorAll('#timelineMarkers > div');

    if (isMoveMarkerActive) {
        moveMarkerButton.classList.add('active', 'bg-blue-500', 'text-white');
        moveMarkerButton.classList.remove('bg-gray-300');
    } else {
        moveMarkerButton.classList.remove('active', 'bg-blue-500', 'text-white');
        moveMarkerButton.classList.add('bg-gray-300');
    }

    markers.forEach((marker, i) => {
        const moveButton = marker.querySelector('.fa-arrows-alt').parentElement;
        if (i === index) {
            if (isMoveMarkerActive) {
                moveButton.classList.add('active');
                moveButton.classList.remove('bg-white');
                moveButton.querySelector('i').classList.add('text-white');
            } else {
                moveButton.classList.remove('active');
                moveButton.classList.add('bg-white');
                moveButton.querySelector('i').classList.remove('text-white');
            }
        } else {
            moveButton.classList.remove('active');
            moveButton.classList.add('bg-white');
            moveButton.querySelector('i').classList.remove('text-white');
        }
    });
}

function zoomTimeline(direction) {
    const timelineSlider = document.getElementById('timelineSlider');
    const currentTime = parseInt(timelineSlider.value);
    zoomCenter = currentTime;

    const startZoom = zoomLevel;
    let endZoom;

    if (direction === 'in' && zoomLevel < maxZoom) {
        endZoom = Math.min(zoomLevel * 1.5, maxZoom);
    } else if (direction === 'out' && zoomLevel > minZoom) {
        endZoom = Math.max(zoomLevel / 1.5, minZoom);
    } else {
        return; // No zoom change needed
    }

    animateZoom(startZoom, endZoom, 300); // 300ms animation duration
}

function resetTimelineZoom() {
    zoomCenter = totalDuration / 2;
    animateZoom(zoomLevel, 1, 300); // Animate back to zoom level 1
}

function updateTimelineZoom() {
    const timelineSlider = document.getElementById('timelineSlider');

    // Ensure zoomLevel is valid
    if (!isFinite(zoomLevel) || zoomLevel <= 0) {
        console.warn('Invalid zoom level, resetting to 1:', zoomLevel);
        zoomLevel = 1;
    }

    // Calculate new start and end times
    const visibleDuration = totalDuration / zoomLevel;
    let startTime = Math.max(0, zoomCenter - visibleDuration / 2);
    let endTime = Math.min(totalDuration, startTime + visibleDuration);

    // Adjust start time if end time exceeds total duration
    if (endTime > totalDuration) {
        startTime = Math.max(0, totalDuration - visibleDuration);
        endTime = totalDuration;
    }

    // Update slider range
    timelineSlider.min = startTime;
    timelineSlider.max = endTime;

    console.log('Timeline zoom updated:', { startTime, endTime, totalDuration, zoomLevel, zoomCenter });

    // Ensure current time is within visible range
    const currentTime = parseFloat(timelineSlider.value);
    if (currentTime < startTime || currentTime > endTime) {
        timelineSlider.value = Math.min(Math.max(currentTime, startTime), endTime);
    }

    updateTimelineMarkers();
    updateSliderPosition();
    updateZoomIndicator();
    updateScroller();
}

function initializeScroller() {
    const scrollContainer = document.getElementById('scrollContainer');
    const scrollIndicator = document.getElementById('scrollIndicator');
    let isScrolling = false;
    let startX;
    let scrollLeft;

    scrollIndicator.addEventListener('mousedown', (e) => {
        isScrolling = true;
        startX = e.pageX - scrollIndicator.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
        scrollIndicator.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * (totalDuration / scrollContainerWidth);
        const newCenter = Math.max(0, Math.min(totalDuration, zoomCenter + walk));
        zoomCenter = newCenter;
        updateTimelineZoom();
    });

    document.addEventListener('mouseup', () => {
        isScrolling = false;
        scrollIndicator.style.cursor = 'grab';
    });

    // Add click event listeners for the sides of the scroller
    scrollContainer.addEventListener('click', (e) => {
        const clickX = e.pageX - scrollContainer.offsetLeft;
        const scrollerWidth = scrollContainer.offsetWidth;
        const indicatorWidth = scrollIndicator.offsetWidth;

        // Check if the click is on the left or right side of the scroller
        if (clickX < indicatorWidth || clickX > scrollerWidth - indicatorWidth) {
            const shiftAmount = totalDuration * 0.1; // Shift by 10% of total duration
            const direction = clickX < indicatorWidth ? -1 : 1;
            const newCenter = Math.max(0, Math.min(totalDuration, zoomCenter + shiftAmount * direction));
            zoomCenter = newCenter;
            updateTimelineZoom();
        }
    });
}

function updateTimelineFromScroller() {
    const scrollContainer = document.getElementById('scrollContainer');
    const scrollContent = document.getElementById('scrollContent');

    const scrollPercentage = scrollContainer.scrollLeft / (scrollContent.offsetWidth - scrollContainer.offsetWidth);
    const newCenter = scrollPercentage * totalDuration;

    zoomCenter = newCenter;
    updateTimelineZoom();
}

function initializeEnhancedTimeline() {
    initializeScroller();
    updateTimelineZoom();
}


function updateZoomIndicator() {
    const zoomIndicator = document.getElementById('zoomIndicator');
    zoomIndicator.textContent = `Zoom: ${zoomLevel.toFixed(1)}x`;
}

function updateScroller() {
    const scrollContainer = document.getElementById('scrollContainer');
    const scrollContent = document.getElementById('scrollContent');
    const scrollIndicator = document.getElementById('scrollIndicator');

    scrollContainerWidth = scrollContainer.offsetWidth;
    const contentWidth = scrollContainerWidth * zoomLevel;
    scrollContent.style.width = `${contentWidth}px`;

    const indicatorWidth = (scrollContainerWidth / contentWidth) * 100;
    const indicatorLeft = (zoomCenter / totalDuration) * (100 - indicatorWidth);

    scrollIndicator.style.width = `${indicatorWidth}%`;
    scrollIndicator.style.left = `${indicatorLeft}%`;
}

function initializeTimeline() {
    const timelineSlider = document.getElementById('timelineSlider');
    const timelineMarkers = document.getElementById('timelineMarkers');
    const audioPlayer = document.getElementById('audioPlayer');

    // Calculate total duration based on the last ad timestamp or audio duration, whichever is greater
    const lastAdTimestamp = Math.max(...storedSlides.map(ad => ad.timestamp));
    const audioDuration = isFinite(audioPlayer.duration) ? audioPlayer.duration * 1000 : 0;
    const campaignDuration = isFinite(storedCampaign.audio.duration) ? storedCampaign.audio.duration : 0;

    totalDuration = Math.max(lastAdTimestamp, audioDuration, campaignDuration);

    // Ensure totalDuration is a valid, finite number
    if (!isFinite(totalDuration) || totalDuration <= 0) {
        console.warn('Invalid total duration, using default:', totalDuration);
        totalDuration = 60000; // Default to 1 minute if we can't determine a valid duration
    }

    console.log(`Last ad timestamp: ${lastAdTimestamp}, Audio duration: ${audioDuration}, Campaign duration: ${campaignDuration}`);
    console.log(`Total duration set to: ${totalDuration}`);

    // Set initial slider values
    timelineSlider.min = 0;
    timelineSlider.max = totalDuration;
    timelineSlider.value = 0;

    // Clear existing markers
    timelineMarkers.innerHTML = '';

    // Create draggable markers
    storedSlides.forEach((ad, index) => {
        createDraggableMarker(index, ad.timestamp);
    });

    updateSlideNavigationButtons();
    updateTimelineMarkers();
    updateTimelineZoom(); // This will apply the current zoom level

    console.log(`Timeline initialized. Total duration: ${formatTimestamp(totalDuration)}`);

    timelineSlider.addEventListener('input', handleSliderChange);
}

function onAudioLoaded() {
    const audioPlayer = document.getElementById('audioPlayer');
    console.log('Audio loaded. Duration:', audioPlayer.duration);
    console.log('Is duration finite?', isFinite(audioPlayer.duration));
    console.log('Campaign audio duration:', storedCampaign.audio.duration);
    console.log('Is campaign duration finite?', isFinite(storedCampaign.audio.duration));
    initializeTimeline();
    updateSlides();
}

async function convertAllTimestampsToMilliseconds() {
    storedSlides.forEach(ad => {
        if (typeof ad.timestamp === 'string') {
            const [minutes, seconds] = ad.timestamp.split(':').map(Number);
            ad.timestamp = Number(ad.timestamp.split(':')[0]) * 60 * 1000 + Number(ad.timestamp.split(':')[1]) * 1000;
        }
    });
    if (typeof storedCampaign.audio.duration === 'string') {
        const [minutes, seconds] = storedCampaign.audio.duration.split(':').map(Number);
        storedCampaign.audio.duration = Number(storedCampaign.audio.duration.split(':')[0]) * 60 * 1000 + Number(storedCampaign.audio.duration.split(':')[1]) * 1000;
    }

    saveSettings();
    console.log('All timestamps converted to milliseconds');
}

async function convertAllTimestampsToMinutes() {
    storedSlides.forEach(ad => {
        if (typeof ad.timestamp === 'number') {
            const minutes = Math.floor(ad.timestamp / 60000);
            const seconds = Math.floor((ad.timestamp % 60000) / 1000);
            ad.timestamp = `${padZero(minutes)}:${padZero(seconds)}`;
        }
    });
    if (typeof storedCampaign.audio.duration === 'number') {
        const minutes = Math.floor(storedCampaign.audio.duration / 60000);
        const seconds = Math.floor((storedCampaign.audio.duration % 60000) / 1000);
        storedCampaign.audio.duration = `${padZero(minutes)}:${padZero(seconds)}`;
    }
    saveSettings();
    console.log('All timestamps converted back to minutes');
}


function handleMarkerClick(event, index) {
    if (isMoveMarkerActive || isShiftKeyDown) {
        moveSlideTimestamp(index);
    } else {
        const timestamp = getCurrentAdTimestamp(index);
        jumpToTime(timestamp);
    }
}



function moveSlideTimestamp(index) {
    const timelineSlider = document.getElementById('timelineSlider');
    const currentTime = parseInt(timelineSlider.value);

    storedSlides[index].timestamp = currentTime; // Store as milliseconds

    updateMarkerPosition(index, currentTime);
    saveSettings();

    console.log(`Slide ${index} timestamp moved to ${formatTimestamp(currentTime)}`);
}

function updateMarkerPosition(index, newTime) {
    const timelineMarkers = document.getElementById('timelineMarkers');
    const marker = timelineMarkers.children[index];
    const markerPosition = (newTime / totalDuration) * 100;
    marker.style.left = `${markerPosition}%`;
    marker.title = formatTimestamp(newTime);
}

function formatTimestamp(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    // add milliseconds rounded to the nearest hundredth
    const millisecondsString = (milliseconds % 1000).toFixed(0).padStart(3, '0');
    return `${padZero(minutes)}:${padZero(seconds)}:${millisecondsString}`;
}

function handleSliderChange() {
    const sliderValue = parseInt(this.value);
    const audioPlayer = document.getElementById('audioPlayer');

    // Update audio player time
    audioPlayer.currentTime = sliderValue / 1000; // Convert to seconds

    // Update startTime
    startTime = Date.now() - sliderValue;

    // Find the correct ad index for the new time
    currentAdIndex = findAdIndexForTime(sliderValue);

    // Update slides
    updateSlides();

    // Update counter
    updateCounter();

    // Clear existing timeout and schedule next ad
    if (autoPlayTimeout) {
        clearTimeout(autoPlayTimeout);
    }
    scheduleNextAd();
}

function jumpToTime(timestamp) {
    const audioPlayer = document.getElementById('audioPlayer');
    const timelineSlider = document.getElementById('timelineSlider');

    // Ensure timestamp is within the current visible range
    const visibleStart = parseInt(timelineSlider.min);
    const visibleEnd = parseInt(timelineSlider.max);

    if (timestamp < visibleStart || timestamp > visibleEnd) {
        // If the timestamp is outside the visible range, center the timeline on it
        zoomCenter = timestamp;
        updateTimelineZoom();
    }

    // Set audio player time
    audioPlayer.currentTime = timestamp / 1000;

    // Update other elements
    updateSliderPosition();
    currentAdIndex = findAdIndexForTime(timestamp);
    updateSlides();
    updateCounter();

    // Clear existing timeout and schedule next ad
    if (autoPlayTimeout) {
        clearTimeout(autoPlayTimeout);
    }
    scheduleNextAd();
}

function updateSliderPosition() {
    const timelineSlider = document.getElementById('timelineSlider');
    const audioPlayer = document.getElementById('audioPlayer');
    const currentTime = audioPlayer.currentTime * 1000; // Convert to milliseconds

    // Ensure min and max are set and are finite numbers
    let visibleStart = parseFloat(timelineSlider.min);
    let visibleEnd = parseFloat(timelineSlider.max);

    if (!isFinite(visibleStart) || !isFinite(visibleEnd)) {
        console.warn('Slider min/max not set properly. Using default values.');
        visibleStart = 0;
        visibleEnd = totalDuration;
        timelineSlider.min = visibleStart;
        timelineSlider.max = visibleEnd;
    }

    const visibleDuration = visibleEnd - visibleStart;

    // Debug logging
    console.log('Current Time:', currentTime);
    console.log('Visible Start:', visibleStart);
    console.log('Visible End:', visibleEnd);
    console.log('Visible Duration:', visibleDuration);
    console.log('Total Duration:', totalDuration);

    if (!isFinite(currentTime) || visibleDuration <= 0) {
        console.error('Invalid values for slider position calculation');
        return; // Exit the function to prevent further errors
    }

    const sliderPosition = ((currentTime - visibleStart) / visibleDuration) * 100;

    // Ensure sliderPosition is within bounds
    const boundedSliderPosition = Math.max(0, Math.min(100, sliderPosition));

    timelineSlider.value = currentTime;

    console.log(`Updating slider position: ${boundedSliderPosition.toFixed(2)}% (${currentTime.toFixed(3)}ms / ${visibleDuration}ms)`);
}

function updateSlideNavigationButtons() {
    const prevButton = document.getElementById('prevSlideButton');
    const currentButton = document.getElementById('currentSlideButton');
    const nextButton = document.getElementById('nextSlideButton');

    const prevIndex = Math.max(0, currentAdIndex - 1);
    const nextIndex = Math.min(storedSlides.length - 1, currentAdIndex + 1);

    prevButton.innerHTML = '<i class="fas fa-backward-step"></i> ' + storedSlides[prevIndex].headline;
    currentButton.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> ' + storedSlides[currentAdIndex].headline;
    nextButton.innerHTML = storedSlides[nextIndex].headline + ' <i class="fas fa-forward-step"></i>';

    prevButton.onclick = () => handleExitAnimations(() => jumpToAd(prevIndex))
    currentButton.onclick = () => jumpToAd(currentAdIndex);
    nextButton.onclick = () => handleExitAnimations(() => jumpToAd(nextIndex));
}

function updateTimelineMarkers() {
    const timelineSlider = document.getElementById('timelineSlider');
    const timelineMarkers = document.getElementById('timelineMarkers');
    const visibleStart = parseFloat(timelineSlider.min);
    const visibleEnd = parseFloat(timelineSlider.max);
    const visibleDuration = visibleEnd - visibleStart;

    const markers = timelineMarkers.children;
    for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];
        const markerTime = parseInt(marker.getAttribute('data-time'));

        if (markerTime >= visibleStart && markerTime <= visibleEnd) {
            const markerPosition = ((markerTime - visibleStart) / visibleDuration) * 100;
            marker.style.left = `${markerPosition}%`;
            marker.style.display = 'block';

            // Highlight the current marker
            if (i === currentAdIndex) {
                marker.classList.add('current-marker');
            } else {
                marker.classList.remove('current-marker');
            }
        } else {
            marker.style.display = 'none';
        }
    }
}

function createDraggableMarker(index, timestamp) {
    const timelineMarkers = document.getElementById('timelineMarkers');
    const markerPosition = (timestamp / totalDuration) * 100;
    const marker = document.createElement('div');
    marker.className = 'absolute w-2.5 h-2.5 bg-blue-500 rounded-full cursor-pointer transform -translate-x-1/2 group';
    marker.style.left = `${markerPosition}%`;
    marker.style.top = '-10px';
    marker.title = formatTimestamp(timestamp);
    marker.setAttribute('data-index', index);
    marker.setAttribute('data-time', timestamp);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'absolute bottom-1 left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:flex space-x-1  flex gap-1';

    const moveButton = createMarkerButton('fa-arrows-alt', 'text-yellow-500', () => toggleMoveMarker(index));
    const editButton = createMarkerButton('fa-edit', 'text-blue-500', () => editMarker(index));
    const deleteButton = createMarkerButton('fa-trash', 'text-red-500', () => deleteMarker(index));

    buttonsContainer.appendChild(moveButton);
    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);

    marker.appendChild(buttonsContainer);

    marker.addEventListener('mousedown', handleMarkerInteraction);
    marker.addEventListener('touchstart', handleMarkerInteraction, { passive: false });

    timelineMarkers.appendChild(marker);

    console.log(`Marker created at position: ${markerPosition}%`);
}

function createMarkerButton(iconClass, colorClass, onClickHandler) {
    const button = document.createElement('button');
    button.className = `cursor-pointer px-2 mb-3 ${colorClass} rounded`;
    button.innerHTML = `<i class="fas ${iconClass} text-xs "></i>`;
    button.onclick = (e) => {
        e.stopPropagation();
        onClickHandler();
    };
    return button;
}

function handleMarkerInteraction(e) {
    e.preventDefault();
    const marker = e.target.closest('div[data-index]');
    const index = parseInt(marker.getAttribute('data-index'));

    if (isMoveMarkerActive) {
        moveSlideToCurrentTime(index);
    } else {
        startDragging(e);
    }
}

function moveSlideToCurrentTime(index) {
    const timelineSlider = document.getElementById('timelineSlider');
    const currentTime = parseInt(timelineSlider.value);

    storedSlides[index].timestamp = currentTime;

    // Update the marker position
    updateMarkerPosition(index, currentTime);

    // Sort storedSlides based on new timestamps
    storedSlides.sort((a, b) => a.timestamp - b.timestamp);

    // Update currentAdIndex
    currentAdIndex = storedSlides.findIndex(ad => ad.timestamp === currentTime);

    // Save changes and update UI
    saveSettings();
    initializeTimeline();
    updateSlides();

    console.log(`Slide ${index} moved to ${formatTimestamp(currentTime)}`);

    // Deactivate move mode
    toggleMoveMarker(index);
}

function startDragging(e) {
    isDragging = true;
    draggedMarker = e.target;
    const timelineRect = document.getElementById('timelineSlider').getBoundingClientRect();
    dragStartX = (e.clientX || e.touches[0].clientX) - timelineRect.left;
    originalMarkerPosition = parseFloat(draggedMarker.style.left);

    // Store the original counter value
    originalCounterValue = document.getElementById('timeCounter').innerText;

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);
}

function ensureAudioLoaded(callback) {
    const audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer.readyState >= 2) {  // HAVE_CURRENT_DATA or higher
        callback();
    } else {
        audioPlayer.addEventListener('loadedmetadata', callback);
    }
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();

    const timelineSlider = document.getElementById('timelineSlider');
    const timelineRect = timelineSlider.getBoundingClientRect();
    const currentX = (e.clientX || e.touches[0].clientX) - timelineRect.left;
    const deltaX = currentX - dragStartX;

    const visibleDuration = parseInt(timelineSlider.max) - parseInt(timelineSlider.min);
    const pixelsPerMs = timelineRect.width / visibleDuration;

    // Apply a damping factor to slow down the movement
    const dampingFactor = .5 / zoomLevel;
    const timeDelta = (deltaX / pixelsPerMs) * dampingFactor;

    const originalTime = parseInt(draggedMarker.getAttribute('data-time'));
    let newTime = Math.max(parseInt(timelineSlider.min), Math.min(parseInt(timelineSlider.max), originalTime + timeDelta))


    let newPosition = ((newTime - parseInt(timelineSlider.min)) / visibleDuration) * 100;
    newPosition = Math.max(0, Math.min(100, newPosition));

    draggedMarker.style.left = `${newPosition}%`;
    draggedMarker.title = formatTimestamp(newTime);
    draggedMarker.setAttribute('data-time', newTime);

    // Update the counter with the exact time in milliseconds
    updateCounterDuringDrag(newTime);

    // Update dragStartX to create a smoother dragging experience
    dragStartX = currentX;
}

function stopDragging() {
    if (!isDragging || !draggedMarker) return;

    const index = parseInt(draggedMarker.getAttribute('data-index'));
    const newTimestamp = parseInt(draggedMarker.getAttribute('data-time'));

    // Check if index is valid
    if (index >= 0 && index < storedSlides.length) {
        // Update the timestamp in storedSlides
        storedSlides[index].timestamp = newTimestamp;

        // Sort storedSlides based on new timestamps
        storedSlides.sort((a, b) => a.timestamp - b.timestamp);

        // Update currentAdIndex
        currentAdIndex = storedSlides.findIndex(ad => ad.timestamp === newTimestamp);

        // Revert the counter to its original value
        const timeCounter = document.getElementById('timeCounter');
        if (timeCounter) {
            timeCounter.innerText = originalCounterValue;
        }

        // Save changes and update UI
        saveSettings();
        initializeTimeline();
        updateSlides();
    } else {
        console.error(`Invalid index: ${index}. storedSlides length: ${storedSlides.length}`);
    }

    isDragging = false;
    draggedMarker = null;

    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDragging);
    document.removeEventListener('touchend', stopDragging);
}

function updateCounterDuringDrag(time) {
    const timeCounter = document.getElementById('timeCounter');
    timeCounter.innerText = `${formatTimestamp(time)}`;
}

function deleteMarker(index) {
    if (confirm('Are you sure you want to delete this slide?')) {
        storedSlides.splice(index, 1);
        saveSettings();
        initializeTimeline();
        updateSlides();
    }
}

function editMarker(index) {
    currentAdIndex = index;
    openEditModal();
}

function animateZoom(startZoom, endZoom, duration) {
    const startTime = Date.now();

    function step() {
        const currentTime = Date.now();
        const progress = Math.min((currentTime - startTime) / duration, 1);

        zoomLevel = startZoom + (endZoom - startZoom) * progress;
        updateTimelineZoom();

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

function addSlideAtCurrentTime() {
    const audioPlayer = document.getElementById('audioPlayer');
    const currentTime = Math.floor(audioPlayer.currentTime * 1000); // Convert to milliseconds

    // Find the index where the new slide should be inserted
    let insertIndex = 0;
    while (insertIndex < storedSlides.length && getCurrentAdTimestamp(insertIndex) < currentTime) {
        insertIndex++;
    }

    // Copy data from the previous slide (or the next slide if it's the first one)
    const sourceIndex = insertIndex > 0 ? insertIndex - 1 : Math.min(insertIndex, storedSlides.length - 1);
    const newSlide = JSON.parse(JSON.stringify(storedSlides[sourceIndex]));

    // Ensure the new slide has a settings property
    if (!newSlide.settings) {
        const size = getSelectedBanner();
        if (!size) {
            console.error('No banner selected');
            return;
        }

        const bannerSetting = storedBannerSettings.find(setting => setting.size === size);
        if (!bannerSetting || !bannerSetting.settings) {
            console.error(`No settings found for banner size: ${size}`);
            return;
        }

        newSlide.settings = JSON.parse(JSON.stringify(bannerSetting.settings));
    }

    // Update the timestamp of the new slide
    newSlide.timestamp = currentTime;

    // Insert the new slide
    storedSlides.splice(insertIndex, 0, newSlide);

    // Update currentAdIndex to point to the new slide
    currentAdIndex = insertIndex;

    // Save changes to localStorage
    localStorage.setItem('slides', JSON.stringify(storedSlides));

    // Update the UI
    updateSlides();
    initializeTimeline();

    // Open edit modal for the new slide
    openEditModal();

    console.log('New slide added and saved:', newSlide);
}

function updateTimelineWithNewMarker() {
    const timelineMarkers = document.getElementById('timelineMarkers');
    const newMarker = document.createElement('div');
    const markerPosition = (getCurrentAdTimestamp(currentAdIndex) / totalDuration) * 100;

    newMarker.className = 'absolute w-2.5 h-2.5 bg-green-500 rounded-full cursor-pointer transform -translate-x-1/2';
    newMarker.style.left = `${markerPosition}%`;
    newMarker.style.top = '-10px';
    newMarker.title = formatTimestamp(getCurrentAdTimestamp(currentAdIndex));
    newMarker.onclick = (event) => handleMarkerClick(event, currentAdIndex);

    timelineMarkers.appendChild(newMarker);

    // Highlight the new marker
    setTimeout(() => {
        newMarker.classList.remove('bg-green-500');
        newMarker.classList.add('bg-red-500');
    }, 1000);
}

function updateSlides() {
    if (currentAdIndex < 0 || currentAdIndex >= storedSlides.length) {
        console.error(`Invalid currentAdIndex: ${currentAdIndex}. storedSlides length: ${storedSlides.length}`);
        return; // Exit the function if the index is invalid
    }
    sizes.forEach(size => {
        const elements = {
            pathOne: document.getElementById(`path-one-${size}`),
            pathTwo: document.getElementById(`path-two-${size}`),
            headline: document.getElementById(`headline-${size}`),
            text: document.getElementById(`text-${size}`),
            tags: document.getElementById(`tags-${size}`),
            cta: document.getElementById(`cta-${size}`),
            image: document.getElementById(`image-${size}`),
            logoIcon: document.getElementById(`logo-icon-${size}`),
            logoTitle: document.getElementById(`logo-title-${size}`),
            textContainer: document.getElementById(`textcontainer-${size}`),
            backdrop: document.getElementById(`backdrop-${size}`),
            backdropImage: document.getElementById(`backdropimage-${size}`),
            filter: document.getElementById(`filter-${size}`),
            filterImage: document.getElementById(`filterimage-${size}`),
            frontdrop: document.getElementById(`frontdrop-${size}`),
            frontdropImage: document.getElementById(`frontdropimage-${size}`),
            backbanner: document.getElementById(`backbanner-${size}`),
            svgWave: document.getElementById(`svg-wave-${size}`)
        };

        const ad = storedSlides[currentAdIndex];
        let settings = getSlideSettings(size);
        // Apply all saved settings for the current slide/banner
        applyAllSavedSettings(size);

        const animation = ad.animation || {};

        // Update content
        if (elements.headline) elements.headline.innerText = ad.headline || '';
        if (elements.text) {
            const textContent = Array.isArray(ad.text) ? ad.text : [ad.text];
            const textIndex = settings && settings.layout && typeof settings.layout.textLength === 'number'
                ? settings.layout.textLength
                : 0;
            elements.text.innerText = textContent[textIndex] || textContent[0] || '';
        }
        if (elements.tags) elements.tags.innerText = ad.tags || '';
        if (elements.cta) {
            const ctaStyle = settings && settings.layout ? settings.layout.ctaStyle : 'default';
            elements.cta.innerText = ctaStyle === 'circle' ? '>' : (ad.cta || 'CTA');
            elements.cta.style.padding = '5px 12px';
            elements.cta.style.borderRadius = ctaStyle === 'circle' ? '100%' : '4px';
        }

        updateLogo(size);

        // Update images
        if (ad.img) updateMainImage(ad.img);
        if (ad.backdrop) updateBackdropImage(ad.backdrop);
        if (ad.frontdrop) updateFrontdropImage(ad.frontdrop);
        if (ad.filter) updateFilterImage(ad.filter);

        // Apply backbanner color
        if (ad.backbanner && elements.backbanner) {
            elements.backbanner.style.backgroundColor = ad.backbanner;
        }



        // Apply visibility settings
        Object.entries(elements).forEach(([key, element]) => {
            if (element && settings.elements && settings.elements[key] !== undefined) {
                const isVisible = settings.elements[key];
                console.log(`${key} visibility:`, isVisible); // check visibility
                if (key === 'pathOne' || key === 'pathTwo') {
                    if (elements.svgWave) {
                        elements.svgWave.style.display = isVisible ? 'block' : 'none';
                    }
                } else {
                    element.style.display = isVisible ? 'block' : 'none';
                }
            }
        });

        // // Special handling for frontdrop, backdrop, and filter
        // ['frontdrop', 'backdrop', 'filter'].forEach(element => {
        //     const container = elements[element];
        //     const image = elements[`${element}Image`];
        //     if (container && image) {
        //         const isVisible = settings.elements[element];
        //         container.style.display = isVisible ? 'block' : 'none';
        //         image.style.display = isVisible ? 'block' : 'none';
        //     }
        // });


        // Apply entry animations
        // Apply entry animations
        if (animation.isEntryAnimated && uiSettings.isAnimationsEnabled) {
            const template = animation.template === 'custom' ? animation.custom : animationTemplates.find(t => t.id === animation.template);
            if (template) {
                const { settings: animationSettings, elements: animationElements } = template.entry;
                Object.entries(animationElements).forEach(([key, animationClass]) => {
                    const element = elements[key];
                    if (element && !['frontdropImage', 'backdropImage', 'filterImage'].includes(key)) {
                        // Remove only animation-related classes
                        removeAnimationClasses(element);
                        // Apply new animation
                        applyAnimation(element, animationClass, animationSettings);
                    }
                });
            }
        }
    });

    // Update the visibility checklist for the currently selected banner
    const selectedBanner = getSelectedBanner();
    if (selectedBanner) {
        updateVisibilityChecklist(selectedBanner);
    }

    updateSlideNavigationButtons();
    updateTimelineMarkers();
    updateElementsList();
}

function removeAnimationClasses(element) {
    const animationClasses = [
        'animate__animated',
        'animate__fadeIn', 'animate__fadeOut',
        'animate__slideInLeft', 'animate__slideOutLeft',
        'animate__slideInRight', 'animate__slideOutRight',
        'animate__slideInUp', 'animate__slideOutUp',
        'animate__slideInDown', 'animate__slideOutDown',
        // Add any other animation classes you use
    ];

    element.classList.remove(...animationClasses);
}

function applyAnimation(element, animationClass, settings) {
    if (element && animationClass) {
        // Remove existing animation classes
        const animationClasses = Object.values(animationTemplates).reduce((acc, template) => {
            const entryClasses = Object.values(template.entry.elements);
            const exitClasses = Object.values(template.exit.elements);
            return [...acc, ...entryClasses, ...exitClasses];
        }, []);
        element.classList.remove(...animationClasses);

        if (uiSettings.isAnimationsEnabled) {
            // Set animation properties
            element.style.animationDuration = `${settings.duration}ms`;
            element.style.animationDelay = `${settings.delay}ms`;
            element.style.animationTimingFunction = settings.easing;

            // Force a reflow
            void element.offsetWidth;

            // Add the animation class
            element.classList.add(animationClass);
        } else {
            // If animations are disabled, just set the final state immediately
            element.style.opacity = '1';
            element.style.transform = 'none';
        }
    }
}


// Function to toggle animations
function toggleAnimations() {
    const toggleSwitch = document.getElementById('animationToggle');
    uiSettings.isAnimationsEnabled = toggleSwitch.checked;

    console.log(`Animations ${uiSettings.isAnimationsEnabled ? 'enabled' : 'disabled'}`);
    // Save the new setting
    saveUISettings()
    // Apply the new setting
    applyUISettings();
}

// Function to apply animation state to all elements
function applyAnimationState() {
    const allElements = document.querySelectorAll('[id^="ad-container-"] *');
    allElements.forEach(element => {
        if (uiSettings.isAnimationsEnabled) {
            element.style.transition = ''; // Reset to default
        } else {
            element.style.transition = 'none'; // Disable transitions
        }
    });
}

document.getElementById('settingsToggle').addEventListener('change', function () {
    const size = getSelectedBanner();
    if (size) {
        applyAllSavedSettings(size);
    }
});

function handleExitAnimations(callback) {

    const animationPromises = [];

    sizes.forEach(size => {
        const elements = {
            pathOne: document.getElementById(`path-one-${size}`),
            pathTwo: document.getElementById(`path-two-${size}`),
            headline: document.getElementById(`headline-${size}`),
            text: document.getElementById(`text-${size}`),
            tags: document.getElementById(`tags-${size}`),
            cta: document.getElementById(`cta-${size}`),
            image: document.getElementById(`image-${size}`),
            logoIcon: document.getElementById(`logo-icon-${size}`),
            logoTitle: document.getElementById(`logo-title-${size}`),
            textContainer: document.getElementById(`textcontainer-${size}`),
            backdrop: document.getElementById(`backdrop-${size}`),
            frontdrop: document.getElementById(`frontdrop-${size}`),
            filter: document.getElementById(`filter-${size}`),
            backbanner: document.getElementById(`backbanner-${size}`)

        };

        const ad = storedSlides[currentAdIndex];
        const animation = ad.animation || {};

        if (animation.isExitAnimated) {
            const template = animation.template === 'custom' ? animation.custom : animationTemplates.find(t => t.id === animation.template);
            if (template) {
                const { settings, elements: animationElements } = template.exit;
                Object.entries(elements).forEach(([key, element]) => {
                    if (element && animationElements[key]) {
                        const promise = new Promise(resolve => {
                            applyAnimation(element, animationElements[key], settings);
                            setTimeout(resolve, settings.duration + settings.delay);
                        });
                        animationPromises.push(promise);
                    }
                });
            }
        }
    });

    Promise.all(animationPromises).then(callback);
}

let counterInterval = null;

function startCounter() {
    if (!counterInterval) {
        updateCounter(); // Update immediately
        counterInterval = setInterval(updateCounter, 100); // Update every 100ms for smoother display
    }
}

function stopCounter() {
    clearInterval(counterInterval);
    counterInterval = null;
}



function padZero(num, places = 2) {
    return String(num).padStart(places, '0');
}

function nextAd() {
    if (currentAdIndex < storedSlides.length - 1) {
        handleExitAnimations(() => {
            currentAdIndex++;
            jumpToAd(currentAdIndex);
        });
    } else {
        console.log("Already at the last slide");
    }
    saveSettings();
}

function previousAd() {
    if (currentAdIndex > 0) {
        handleExitAnimations(() => {
            currentAdIndex--;
            jumpToAd(currentAdIndex);
        });
    } else {
        console.log("Already at the first slide");
    }
    saveSettings();
}

function jumpToAd(index) {
    if (index < 0 || index >= storedSlides.length) {
        console.error(`Invalid index: ${index}. storedSlides length: ${storedSlides.length}`);
        return; // Exit the function if the index is invalid
    }
    const audioPlayer = document.getElementById('audioPlayer');
    const timestamp = getCurrentAdTimestamp(index);

    jumpToTime(timestamp);

    // Update the startTime to reflect the new position
    startTime = Date.now() - timestamp;
    pausedTime = 0;

    // Update audio position
    audioPlayer.currentTime = timestamp / 1000; // Convert to seconds

    // Update slides
    currentAdIndex = index;
    updateSlides();

    const size = getSelectedBanner();
    if (size) {
        applyAllSavedSettings(size);
        updateCheckboxStates(size);
        updateVisibilityChecklist(size);
    }

    // Update the visibility checklist
    const selectedBanner = getSelectedBanner();
    if (selectedBanner) {
        updateVisibilityChecklist(selectedBanner);
    }

    saveSettings();

    // Clear existing timeout and schedule next ad
    if (autoPlayTimeout) {
        clearTimeout(autoPlayTimeout);
    }
    scheduleNextAd();

    // Update counter
    updateCounter();
}

function previousImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateImages();
    }
    saveSettings();
}

function nextImage() {
    if (currentImageIndex < storedImages.length - 1) {
        currentImageIndex++;
        updateImages();
    }
    saveSettings();
}

function resizeImage(action) {
    const size = getSelectedBanner();
    const image = document.getElementById(`image-${size}`);
    let width = image.clientWidth;
    if (action === 'increase') {
        width += 10;
    } else {
        width -= 10;
    }
    image.style.width = `${width}px`;
    const settings = getSlideSettings(size).layout;
    settings.imageSize = `${width}px`;
    saveSettings();
}

function resizeTitle(action) {
    const size = getSelectedBanner();
    const title = document.getElementById(`headline-${size}`);
    let fontSize = parseFloat(window.getComputedStyle(title, null).getPropertyValue('font-size'));
    if (action === 'increase') {
        fontSize += 2;
    } else {
        fontSize -= 2;
    }
    title.style.fontSize = `${fontSize}px`;
    const settings = getSlideSettings(size).layout;
    settings.titleSize = `${fontSize}px`;
    saveSettings();
}

function resizeBody(action) {
    const size = getSelectedBanner();
    const body = document.getElementById(`text-${size}`);
    let fontSize = parseFloat(window.getComputedStyle(body, null).getPropertyValue('font-size'));
    if (action === 'increase') {
        fontSize += 2;
    } else {
        fontSize -= 2;
    }
    body.style.fontSize = `${fontSize}px`;
    const settings = getSlideSettings(size).layout;
    settings.bodySize = `${fontSize}px`;
    saveSettings();
}

function toggleBackground() {
    const size = getSelectedBanner();
    if (!size) {
        // console.error('No banner selected');
        return;
    }
    const container = document.getElementById(`ad-container-${size}`);
    const image = document.getElementById(`image-${size}`);
    const settings = getSlideSettings(size).layout;
    if (document.getElementById('toggle-background').checked) {
        container.style.backgroundImage = `url(${image.src})`;
        container.style.backgroundSize = 'cover';
        container.style.backgroundPosition = 'center';
        image.style.display = 'none';
        settings.backgroundImage = true;
    } else {
        container.style.backgroundImage = '';
        image.style.display = 'block';
        settings.backgroundImage = false;
    }
    // setOpacity();
    saveSettings();
}

function switchPosition() {
    const size = getSelectedBanner();
    const container = document.getElementById(`ad-container-${size}`);
    const logoIcon = document.getElementById(`logo-icon-${size}`);
    const logoTitle = document.getElementById(`logo-title-${size}`);
    const image = document.getElementById(`image-${size}`);
    const settings = getSlideSettings(size).layout;

    if (size === '300x250') {
        if (logoTitle && container.contains(logoTitle) && container.contains(image)) {
            const parentDiv = logoTitle.parentElement;
            if (parentDiv.nextElementSibling === image) {
                container.insertBefore(image, parentDiv);
            } else {
                container.insertBefore(parentDiv, image);
            }
        }
    } else {
        if (logoIcon && container.contains(logoIcon) && container.contains(image)) {
            if (logoIcon.nextElementSibling === image) {
                container.insertBefore(image, logoIcon);
            } else {
                container.insertBefore(logoIcon, image);
            }
        }
    }
    saveSettings();
}

function toggleCtaStyle() {
    const size = getSelectedBanner();
    const cta = document.getElementById(`cta-${size}`);
    let settings = getSlideSettings(size);

    if (!settings.layout) {
        settings.layout = {};
    }

    if (cta.innerText === '>') {
        cta.innerText = storedSlides[currentAdIndex].cta;
        cta.style.padding = '5px 12px';
        cta.style.borderRadius = '4px';
        settings.layout.ctaStyle = 'default';
    } else {
        cta.innerText = '>';
        cta.style.padding = '5px 12px';
        cta.style.borderRadius = '100%';
        settings.layout.ctaStyle = 'circle';
    }

    // Save the current CTA text to the slide settings
    if (uiSettings.isSlideSettings) {
        storedSlides[currentAdIndex].cta = cta.innerText;
    }

    saveSettings();
    console.log(`CTA style toggled to ${settings.layout.ctaStyle} for ${size}`);
}

function toggleTextLength() {
    const size = getSelectedBanner();
    const textElement = document.getElementById(`text-${size}`);
    const currentText = textElement.innerText;
    const adTextArray = storedSlides[currentAdIndex].text;
    if (adTextArray.length > 1) {
        const currentAdIndex = adTextArray.indexOf(currentText);
        const nextIndex = currentAdIndex === adTextArray.length - 1 ? 0 : currentAdIndex + 1;
        textElement.innerText = adTextArray[nextIndex];
    }
    saveSettings();
}

function highlightSelectedBanner() {
    const size = getSelectedBanner();
    document.querySelectorAll('.border-blue-500').forEach(el => el.classList.remove('border-blue-500', 'shadow-xl'));
    const selectedBanner = document.getElementById(`ad-container-${size}`);
    if (selectedBanner) {
        selectedBanner.classList.add('border-blue-500', 'shadow-xl');
        updateSliderValues(size);
        updateCheckboxStates(size);
    }
}

function downloadAllBannersAsZip() {
    const sizes = [
        { size: '160x600', dimensions: '160x600' },
        { size: '480x120', dimensions: '480x120' },
        { size: '300x250', dimensions: '300x250' },
        { size: '300x250-text', dimensions: '300x250' },
        { size: '728x90', dimensions: '728x90' },
        { size: '1200x628', dimensions: '1200x628' },
        { size: '1200x628-2', dimensions: '1200x628' },
        { size: '1080x1080', dimensions: '1080x1080' },
        { size: '720x1280', dimensions: '720x1280' }
    ];

    const zip = new JSZip();
    const imgFolder = zip.folder("images");

    const promises = sizes.map(({ size }) => {
        const container = document.getElementById(`ad-container-${size}`);
        if (container) {
            return html2canvas(container, {
                backgroundColor: null,
                useCORS: true,
                allowTaint: true
            }).then(canvas => {
                return new Promise((resolve) => {
                    canvas.toBlob(blob => {
                        imgFolder.file(`banner_${size}.jpg`, blob);
                        resolve();
                    }, 'image/jpeg');
                });
            });
        }
        return Promise.resolve();
    });

    Promise.all(promises).then(() => {
        zip.generateAsync({ type: "blob" }).then(content => {
            saveAs(content, "banners.zip");
        });
    });
}

function convertImageToBase64(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

async function downloadSlides() {
    await convertAllTimestampsToMinutes();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storedSlides));
    await convertAllTimestampsToMilliseconds();
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "slides.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}



function uploadSlides() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
            const content = readerEvent.target.result;
            const parsed = JSON.parse(content);
            localStorage.setItem('slides', JSON.stringify(parsed));
            location.reload(); // reload to apply the new settings
        }
    }
    input.click();
}

async function downloadCampaign() {
    const campaign = { ...storedCampaign, slides: storedSlides };
    await convertAllTimestampsToMinutes();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(campaign));
    await convertAllTimestampsToMilliseconds();
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "campaign.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function uploadCampaign() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
            const content = readerEvent.target.result;
            const parsed = JSON.parse(content);
            // delete parsed.slides;
            localStorage.setItem('campaign', JSON.stringify(parsed));
            localStorage.setItem('slides', JSON.stringify(parsed.slides));
            location.reload(); // reload to apply the new settings
        }
    }
    input.click();
}

async function downloadCampaigns() {
    try {
        // Ensure all timestamps are in the correct format before downloading
        await convertAllTimestampsToMinutes();

        // Prepare the campaigns data
        const campaignsData = {
            campaigns: storedCampaigns,
            currentCampaignIndex: currentCampaignIndex
        };

        // Convert the campaigns data to a JSON string
        const jsonString = JSON.stringify(campaignsData, null, 2);

        // Create a Blob with the JSON data
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Create a temporary URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element and trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'campaigns.json';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Release the temporary URL
        URL.revokeObjectURL(url);

        console.log('Campaigns downloaded successfully');

        // Convert timestamps back to milliseconds for internal use
        await convertAllTimestampsToMilliseconds();
    } catch (error) {
        console.error('Error downloading campaigns:', error);
        alert('An error occurred while downloading campaigns. Please try again.');
    }
}

// Function to download settings
function downloadSettings() {
    const settings = {
        bannerSettings: storedBannerSettings,
        // Add any other settings you want to include
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "banner_settings.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Function to upload settings
function uploadSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
            try {
                const content = readerEvent.target.result;
                const parsedSettings = JSON.parse(content);
                if (parsedSettings.bannerSettings) {
                    // Update existing storedBannerSettings instead of reassigning
                    updateStoredBannerSettings(parsedSettings.bannerSettings);
                    localStorage.setItem('bannerSettings', JSON.stringify(storedBannerSettings));
                    // Apply the uploaded settings
                    applyUploadedSettings();
                    alert('Settings uploaded successfully!');
                } else {
                    throw new Error('Invalid settings file');
                }
            } catch (error) {
                console.error('Error parsing settings:', error);
                alert('Error uploading settings. Please make sure the file is a valid JSON.');
            }
        }
    }
    input.click();
}

// Function to update storedBannerSettings
function updateStoredBannerSettings(newSettings) {
    // Clear the existing array
    storedBannerSettings.length = 0;
    // Push all new settings into the existing array
    storedBannerSettings.push(...newSettings);
}

// Function to apply the uploaded settings
function applyUploadedSettings() {
    // Iterate through all banner sizes and apply settings
    storedBannerSettings.forEach(bannerSetting => {
        applyAllSavedSettings(bannerSetting.size);
    });

    // Update UI elements
    const selectedBanner = getSelectedBanner();
    if (selectedBanner) {
        updateSliderValues(selectedBanner);
        updateCheckboxStates(selectedBanner);
        updateVisibilityChecklist(selectedBanner);
    }
    updateElementsList();

    // Redraw the current banner
    updateSlides();
}



function downloadImages() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storedImages));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "images.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function updateImageUrls() {
    const inputs = document.getElementsByClassName('imageUrlInput');
    const urlPromises = [];

    Array.from(inputs).forEach(input => {
        if (input.value) {
            urlPromises.push(new Promise((resolve) => {
                getBase64Image(input.value, (base64Image) => {
                    resolve(base64Image);
                });
            }));
        }
    });

    Promise.all(urlPromises).then(base64Images => {
        storedImages.length = 0; // clear existing images
        storedImages.push(...base64Images);
        saveSettings();
        updateImages();
    });
}


function getBase64Image(url, callback) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL('image/png');
        callback(dataURL);
    };
    img.src = url;
}

function addImageUrlInputField() {
    const container = document.getElementById('imageUrlsContainer');
    const inputCount = container.getElementsByClassName('imageUrlInput').length;
    const newInputField = document.createElement('div');
    newInputField.classList.add('flex', 'items-center', 'mb-2');
    newInputField.innerHTML = `
        <label for="imageUrl-${inputCount}" class="mr-2">Image URL ${inputCount + 1}:</label>
        <input type="text" id="imageUrl-${inputCount}" class="imageUrlInput flex-grow px-2 py-1 border rounded" value="">
        <button onclick="deleteImageUrlInputField(${inputCount})" class="ml-2 text-red-500"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(newInputField);
}



function updateStoredImages() {
    const inputs = document.getElementsByClassName('imageUrlInput');
    const newImages = [];
    Array.from(inputs).forEach(input => {
        if (input.value) {
            newImages.push(input.value);
        }
    });
    localStorage.setItem('images', JSON.stringify(newImages));
    location.reload(); // Reload to update the images
}

function deleteImageUrlInputField(index) {
    const container = document.getElementById('imageUrlsContainer');
    const inputField = document.getElementById(`imageUrl-${index}`).parentElement;
    container.removeChild(inputField);
    updateStoredImages();
}

function updateImageUrls() {
    const inputs = document.getElementsByClassName('imageUrlInput');
    const urlPromises = [];

    Array.from(inputs).forEach(input => {
        if (input.value) {
            urlPromises.push(new Promise((resolve) => {
                getBase64Image(input.value, (base64Image) => {
                    resolve(base64Image);
                });
            }));
        }
    });

    Promise.all(urlPromises).then(base64Images => {
        storedImages.length = 0; // clear existing images
        storedImages.push(...base64Images);
        saveSettings();
        updateImages();
    });
}

function openBackdropGallery() {
    currentImageType = 'backdrop';
    openImageGallery('backdrop');
}

function openFrontdropGallery() {
    currentImageType = 'frontdrop';
    openImageGallery('frontdrop');
}

function openFilterGallery() {
    currentImageType = 'filter';
    openImageGallery('filter');
}

function openImageGallery(type = 'main') {
    currentImageType = type; // Store the current image type being selected
    const modal = document.getElementById('imageGalleryModal');
    const grid = document.getElementById('imageGalleryGrid');
    grid.innerHTML = ''; // Clear existing images

    const imageSource = storedImages;

    const filteredImages = imageSource.filter(imageUrl => {
        const fileName = imageUrl.split('/').pop().toLowerCase();
        switch (type) {
            case 'backdrop':
                return fileName.includes('backdrop');
            case 'frontdrop':
                return fileName.includes('frontdrop');
            case 'filter':
                return fileName.includes('filter');
            case 'main':
            default:
                // Exclude backdrop, frontdrop, and filter images for 'main' and any unrecognized type
                return !['backdrop', 'frontdrop', 'filter'].some(t => fileName.includes(t));
        }
    });

    filteredImages.forEach((imageUrl, index) => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'relative cursor-pointer hover:opacity-75';

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `Image ${index + 1}`;
        img.className = 'w-32 object-cover';

        const fileName = imageUrl.split('/').pop();
        const fileNameElement = document.createElement('p');
        fileNameElement.className = 'text-xs text-center';
        fileNameElement.textContent = fileName;

        imgContainer.appendChild(img);
        imgContainer.appendChild(fileNameElement);
        imgContainer.onclick = () => selectGalleryImage(imageUrl);

        grid.appendChild(imgContainer);
    });

    modal.classList.remove('hidden');
}

function closeImageGallery() {
    const modal = document.getElementById('imageGalleryModal');
    modal.classList.add('hidden');
}

function selectGalleryImage(imageUrl) {
    const currentSlide = storedSlides[currentAdIndex];

    switch (currentImageType) {
        case 'main':
            currentSlide.img = imageUrl;
            updateImagePreview('mainImagePreview', 'mainImageName', imageUrl);
            updateMainImage(imageUrl);
            break;
        case 'backdrop':
            currentSlide.backdrop = imageUrl;
            updateImagePreview('backdropImagePreview', 'backdropImageName', imageUrl);
            updateBackdropImage(imageUrl);
            break;
        case 'frontdrop':
            currentSlide.frontdrop = imageUrl;
            updateImagePreview('frontdropImagePreview', 'frontdropImageName', imageUrl);
            updateFrontdropImage(imageUrl);
            break;
        case 'filter':
            currentSlide.filter = imageUrl;
            updateImagePreview('filterImagePreview', 'filterImageName', imageUrl);
            updateFilterImage(imageUrl);
            break;
    }

    saveSettings();
    closeImageGallery();
    currentImageType = 'main';
}

function updateMainImage(imageUrl) {
    sizes.forEach(size => {
        const img = document.getElementById(`image-${size}`);
        if (img) {
            img.src = imageUrl;
        }
    });
}

function updateBackdropImage(imageUrl) {
    sizes.forEach(size => {
        const img = document.getElementById(`backdropimage-${size}`);
        if (img) {
            img.src = imageUrl;
        }
    });
}

function updateFrontdropImage(imageUrl) {
    sizes.forEach(size => {
        const img = document.getElementById(`frontdropimage-${size}`);
        if (img) {
            img.src = imageUrl;
        }
    });
}

function updateFilterImage(imageUrl) {
    sizes.forEach(size => {
        const img = document.getElementById(`filterimage-${size}`);
        if (img) {
            img.src = imageUrl;
        }
    });
}

document.getElementById('openGalleryButton').addEventListener('click', () => {
    currentImageType = 'main';
    openImageGallery('main');
});

function openEditModal() {
    const modal = document.getElementById('editSlideModal');
    if (!modal) {
        console.error('Edit slide modal not found');
        return;
    }

    const form = document.getElementById('editSlideForm');
    if (!form) {
        console.error('Edit slide form not found');
        return;
    }

    const currentSlide = storedSlides[currentAdIndex];
    const currentSize = getSelectedBanner();
    console.log('Opening edit modal for size:', currentSize);

    const settingsTemplateSelect = document.getElementById('editSettingsTemplate');

    if (settingsTemplateSelect) {
        if (currentSlide.settingsTemplate) {
            settingsTemplateSelect.value = currentSlide.settingsTemplate;
        } else {
            settingsTemplateSelect.value = '';
        }

        handleSettingsTemplateSelection();
    } else {
        console.warn('Settings template select element not found');
    }

    // Load slide-specific settings if they exist
    if (currentSlide.settings && currentSlide.settings.size && currentSlide.settings.size[currentSize]) {
        console.log('Applying slide-specific settings for size:', currentSize);
        applyAllSavedSettings(currentSize);
    } else {
        console.log('No slide-specific settings found for size:', currentSize, 'Using banner settings');
        const bannerSetting = storedBannerSettings.find(setting => setting.size === currentSize);
        if (bannerSetting) {
            applySettings(bannerSetting.settings);
        } else {
            console.warn('No banner settings found for size:', currentSize);
        }
    }

    // Helper function to safely set form field values
    const setFieldValue = (fieldName, value) => {
        const field = form[fieldName];
        if (field) {
            field.value = value;
        } else {
            console.warn(`Field ${fieldName} not found in the form`);
        }
    };

    // Populate form fields
    setFieldValue('timestamp', currentSlide.timestamp);
    setFieldValue('audio', currentSlide.audio);

    if (currentSlide.logo) {
        setFieldValue('logoIcon', currentSlide.logo.icon);
        setFieldValue('logoFirstWord', currentSlide.logo.firstWord);
        setFieldValue('logoSecondWord', currentSlide.logo.secondWord);
    }

    setFieldValue('headline', currentSlide.headline);
    setFieldValue('text', currentSlide.text.join('\n'));
    setFieldValue('tags', currentSlide.tags);
    setFieldValue('cta', currentSlide.cta);

    // Set animation toggle states
    const isLoopedToggle = document.getElementById('isLooped');
    const isExitAnimatedToggle = document.getElementById('isExitAnimated');
    const isEntryAnimatedToggle = document.getElementById('isEntryAnimated');

    if (isLoopedToggle) isLoopedToggle.checked = currentSlide.animation?.isLooped ?? false;
    if (isExitAnimatedToggle) isExitAnimatedToggle.checked = currentSlide.animation?.isExitAnimated ?? true;
    if (isEntryAnimatedToggle) isEntryAnimatedToggle.checked = currentSlide.animation?.isEntryAnimated ?? true;
    
    // Populate animation template
    const animationTemplateSelect = document.getElementById('editAnimationTemplate');
    const customAnimationFields = document.getElementById('customAnimationFields');
    const editAnimations = document.getElementById('editAnimations');
    const saveAsNewTemplateBtn = document.getElementById('saveAsNewTemplateBtn');
    const updateTemplateBtn = document.getElementById('updateTemplateBtn');
    const editTemplateBtn = document.getElementById('editTemplateBtn');

    if (animationTemplateSelect && customAnimationFields && editAnimations) {
        // Populate image previews
        updateImagePreview('mainImagePreview', 'mainImageName', currentSlide.img);
        updateImagePreview('backdropImagePreview', 'backdropImageName', currentSlide.backdrop);
        updateImagePreview('frontdropImagePreview', 'frontdropImageName', currentSlide.frontdrop);
        updateImagePreview('filterImagePreview', 'filterImageName', currentSlide.filter);

        // Populate animation template options
        updateAnimationTemplateSelect(currentSlide.animation?.template || '');

        // Set the selected template and handle custom fields
        if (currentSlide.animation && currentSlide.animation.template) {
            animationTemplateSelect.value = currentSlide.animation.template;
            if (currentSlide.animation.template === 'custom') {
                customAnimationFields.classList.remove('hidden');
                editTemplateBtn.classList.add('hidden');
                editAnimations.value = JSON.stringify(currentSlide.animation.custom, null, 2);
            } else {
                customAnimationFields.classList.add('hidden');
                editTemplateBtn.classList.remove('hidden');
            }
        } else {
            animationTemplateSelect.value = '';
            customAnimationFields.classList.add('hidden');
            editTemplateBtn.classList.remove('hidden');
        }

        // Add event listeners
        saveAsNewTemplateBtn.addEventListener('click', saveAsNewTemplate);
        updateTemplateBtn.addEventListener('click', updateTemplate);
        editTemplateBtn.addEventListener('click', editTemplate);


        // Add event listener to handle template changes
        animationTemplateSelect.addEventListener('change', function () {
            const isCustom = this.value === 'custom';
            customAnimationFields.classList.toggle('hidden', !isCustom);
            editTemplateBtn.classList.toggle('hidden', isCustom);
            updateTemplateBtn.classList.add('hidden');

            if (isCustom && (!editAnimations.value || editAnimations.value === '{}')) {
                const defaultTemplate = animationTemplates[0];
                editAnimations.value = JSON.stringify(defaultTemplate, null, 2);
            }
        });
    } else {
        console.warn('Some animation-related elements not found');
    }

    modal.classList.remove('hidden');
}

// Function to populate the settings template dropdown
function populateSettingsTemplateDropdown() {
    const select = document.getElementById('editSettingsTemplate');
    select.innerHTML = '<option value="">Select a template</option>';

    Object.keys(settingsTemplates).forEach(templateId => {
        const option = document.createElement('option');
        option.value = templateId;
        option.textContent = settingsTemplates[templateId].name;
        select.appendChild(option);
    });

    const customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = 'Custom';
    select.appendChild(customOption);
}


// Function to handle settings template selection
function handleSettingsTemplateSelection() {
    const select = document.getElementById('editSettingsTemplate');
    const customFields = document.getElementById('customSettingsFields');
    const editButton = document.getElementById('editSettingsTemplateBtn');
    const applyButton = document.getElementById('applySettingsTemplateBtn');
    const updateButton = document.getElementById('updateSettingsTemplateBtn');

    if (!select) {
        console.error('Settings template select element not found');
        return;
    }

    const selectedTemplate = select.value;

    if (customFields) {
        customFields.classList.toggle('hidden', selectedTemplate !== 'custom');
    } else {
        console.warn('Custom fields element not found');
    }

    if (editButton) {
        editButton.classList.toggle('hidden', selectedTemplate === 'custom' || !selectedTemplate);
    } else {
        console.warn('Edit button not found');
    }

    if (applyButton) {
        applyButton.classList.toggle('hidden', selectedTemplate !== 'custom');
    } else {
        console.warn('Apply button not found');
    }

    if (updateButton) {
        updateButton.classList.toggle('hidden', selectedTemplate === 'custom' || !selectedTemplate);
    } else {
        console.warn('Update button not found');
    }

    if (selectedTemplate === 'custom') {
        const editSettings = document.getElementById('editSettings');
        if (editSettings && storedSlides[currentAdIndex]) {
            editSettings.value = JSON.stringify(storedSlides[currentAdIndex].settings, null, 2);
        } else {
            console.warn('Edit settings textarea or current slide not found');
        }
    }
}

// Function to edit the selected template
function editSelectedTemplate() {
    const select = document.getElementById('editSettingsTemplate');
    const customFields = document.getElementById('customSettingsFields');
    const updateButton = document.getElementById('updateSettingsTemplateBtn');

    currentEditingSettingsTemplateId = select.value;
    currentEditingSize = getSelectedBanner(); // Assuming this function exists and returns the current size

    customFields.classList.remove('hidden');
    updateButton.classList.remove('hidden');

    let settingsToEdit;
    if (currentEditingSize && settingsTemplates[currentEditingSettingsTemplateId].size) {
        settingsToEdit = settingsTemplates[currentEditingSettingsTemplateId].size[currentEditingSize];
    } else {
        settingsToEdit = settingsTemplates[currentEditingSettingsTemplateId];
    }

    document.getElementById('editSettings').value = JSON.stringify(settingsToEdit, null, 2);
}

// Function to update the current template
function updateCurrentTemplate() {
    if (!currentEditingSettingsTemplateId) {
        alert('No template selected for editing.');
        return;
    }
    console.log('update clicked.');
    const settingsJSON = document.getElementById('editSettings').value;
    try {
        const newSettings = JSON.parse(settingsJSON);

        if (currentEditingSize) {
            // Updating a specific size
            if (!settingsTemplates[currentEditingSettingsTemplateId].size) {
                settingsTemplates[currentEditingSettingsTemplateId].size = {};
            }
            settingsTemplates[currentEditingSettingsTemplateId].size[currentEditingSize] = newSettings;
        } else {
            // Updating the entire template
            settingsTemplates[currentEditingSettingsTemplateId] = {
                ...settingsTemplates[currentEditingSettingsTemplateId],
                ...newSettings
            };
        }

        localStorage.setItem('settingsTemplates', JSON.stringify(settingsTemplates));
        alert('Template updated successfully.');
        populateSettingsTemplateDropdown(); // Refresh the dropdown
    } catch (error) {
        console.error('Invalid JSON for template settings:', error);
        alert('Invalid JSON for template settings. Please check your input.');
    }
}


// Function to save as a new template
function saveAsNewTemplate() {
    const settingsJSON = document.getElementById('editSettings').value;
    try {
        const newSettings = JSON.parse(settingsJSON);
        const templateName = prompt('Enter a name for this template:');
        if (templateName) {
            const templateId = templateName.toLowerCase().replace(/\s+/g, '-');

            if (currentEditingSize) {
                // Saving a new size-specific template
                settingsTemplates[templateId] = {
                    id: templateId,
                    name: templateName,
                    size: {
                        [currentEditingSize]: newSettings
                    }
                };
            } else {
                // Saving a new full template
                settingsTemplates[templateId] = {
                    id: templateId,
                    name: templateName,
                    ...newSettings
                };
            }

            localStorage.setItem('settingsTemplates', JSON.stringify(settingsTemplates));
            populateSettingsTemplateDropdown();
            alert('New template saved successfully.');
        }
    } catch (error) {
        console.error('Invalid JSON for template settings:', error);
        alert('Invalid JSON for template settings. Please check your input.');
    }
}


// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const settingsTemplateSelect = document.getElementById('editSettingsTemplate');
    const editTemplateBtn = document.getElementById('editSettingsTemplateBtn');
    const applySettingsTemplateBtn = document.getElementById('applySettingsTemplateBtn');
    const updateSettingsTemplateBtn = document.getElementById('updateSettingsTemplateBtn');
    const saveAsNewSettingsTemplateBtn = document.getElementById('saveAsNewSettingsTemplateBtn');

    populateSettingsTemplateDropdown();

    settingsTemplateSelect.addEventListener('change', handleSettingsTemplateSelection);
    editTemplateBtn.addEventListener('click', editSelectedTemplate);
    updateSettingsTemplateBtn.addEventListener('click', updateCurrentTemplate);
    saveAsNewSettingsTemplateBtn.addEventListener('click', saveAsNewTemplate);
});



function updateImagePreview(imgId, nameId, imageUrl) {
    const imgElement = document.getElementById(imgId);
    const nameElement = document.getElementById(nameId);

    if (imageUrl) {
        imgElement.src = imageUrl;
        nameElement.textContent = getImageNameFromUrl(imageUrl);
    } else {
        imgElement.src = 'path/to/placeholder-image.jpg';
        nameElement.textContent = 'No image selected';
    }
}

function getImageNameFromUrl(url) {
    return url.split('/').pop();
}

function closeEditModal() {
    const modal = document.getElementById('editSlideModal');
    const banners = document.getElementById('banners');

    if (modal) {
        modal.classList.add('hidden');
    }

    if (banners) {
        banners.classList.remove('hidden');
    } else {
        console.warn("Element with ID 'banners' not found");
    }
}

function handleEditFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const currentSlide = storedSlides[currentAdIndex];
    const animationTemplateSelect = document.getElementById('editAnimationTemplate');
    const settingsTemplateSelect = document.getElementById('editSettingsTemplate');
    const currentSize = getSelectedBanner();

    if (!currentSize) {
        console.error('No banner size selected. Cannot save settings.');
        alert('Please select a banner size before saving.');
        return;
    }

    const updatedSlide = {
        ...currentSlide,
        timestamp: parseInt(form.timestamp.value),
        audio: form.audio.value,
        logo: {
            icon: form.logoIcon.value,
            firstWord: form.logoFirstWord.value,
            secondWord: form.logoSecondWord.value
        },
        headline: form.headline.value,
        text: form.text.value.split('\n'),
        tags: form.tags.value,
        cta: form.cta.value,
        animation: {
            ...currentSlide.animation,
            template: animationTemplateSelect.value,
            isLooped: form.isLooped.checked,
            isExitAnimated: form.isExitAnimated.checked,
            isEntryAnimated: form.isEntryAnimated.checked
        },
        settingsTemplate: settingsTemplateSelect.value
    };

    // Handle animation settings
    if (updatedSlide.animation.template === 'custom') {
        try {
            updatedSlide.animation.custom = JSON.parse(form.animations.value);
        } catch (error) {
            console.error('Invalid JSON for custom animation:', error);
            alert('Invalid JSON for custom animation. Please check your input.');
            return;
        }
    } else {
        delete updatedSlide.animation.custom;
    }

    // Handle settings template
    if (updatedSlide.settingsTemplate === 'custom') {
        try {
            updatedSlide.settings = {
                size: {
                    [currentSize]: JSON.parse(document.getElementById('editSettings').value)
                }
            };
        } catch (error) {
            console.error('Invalid JSON for custom settings:', error);
            alert('Invalid JSON for custom settings. Please check your input.');
            return;
        }
    } else if (updatedSlide.settingsTemplate) {
        const templateSettings = settingsTemplates[updatedSlide.settingsTemplate];
        if (templateSettings && templateSettings.size && templateSettings.size[currentSize]) {
            updatedSlide.settings = {
                size: {
                    [currentSize]: JSON.parse(JSON.stringify(templateSettings.size[currentSize]))
                }
            };
        } else {
            console.error(`No settings found for template "${updatedSlide.settingsTemplate}" and size "${currentSize}"`);
            alert(`No settings found for the selected template and current banner size. Please check your selection.`);
            return;
        }
    } else {
        // If no template is selected, keep the existing settings or initialize with empty object
        updatedSlide.settings = currentSlide.settings || { size: {} };
        if (!updatedSlide.settings.size) {
            updatedSlide.settings.size = {};
        }
        if (!updatedSlide.settings.size[currentSize]) {
            updatedSlide.settings.size[currentSize] = {
                elements: {},
                layout: {}
            };
        }
    }

    // Update the current slide in storedSlides
    storedSlides[currentAdIndex] = updatedSlide;

    // Sort the storedSlides array based on timestamps
    storedSlides.sort((a, b) => a.timestamp - b.timestamp);

    // Update the currentAdIndex to reflect the new position of the edited slide
    currentAdIndex = storedSlides.findIndex(slide => slide.timestamp === updatedSlide.timestamp);

    // Save changes
    saveSettings();

    // Update the UI
    updateSlides();
    initializeTimeline();

    // Close the modal
    closeEditModal();
}

function addCustomTemplate() {
    const customAnimationJSON = document.getElementById('editAnimations').value;
    let customAnimation;
    try {
        customAnimation = JSON.parse(customAnimationJSON);
    } catch (error) {
        alert('Invalid JSON for custom animation. Please check your input.');
        return;
    }

    const templateName = prompt('Enter a name for this template:');
    if (!templateName) return;

    const newTemplate = {
        id: templateName.toLowerCase().replace(/\s+/g, '-'),
        name: templateName,
        ...customAnimation
    };

    animationTemplates.push(newTemplate);
    saveAnimationTemplates();
    updateAnimationTemplateSelect(newTemplate.id);
}

function editTemplate() {
    const selectedTemplateId = document.getElementById('editAnimationTemplate').value;
    if (selectedTemplateId === 'custom' || !selectedTemplateId) {
        alert('Please select a template to edit.');
        return;
    }

    const template = animationTemplates.find(t => t.id === selectedTemplateId);
    if (!template) {
        alert('Template not found.');
        return;
    }

    editingTemplateId = selectedTemplateId;
    document.getElementById('editAnimations').value = JSON.stringify(template, null, 2);
    document.getElementById('customAnimationFields').classList.remove('hidden');
    document.getElementById('updateTemplateBtn').classList.remove('hidden');
    document.getElementById('editTemplateBtn').classList.add('hidden');
}

function updateTemplate() {
    if (!editingTemplateId) return;

    const customAnimationJSON = document.getElementById('editAnimations').value;
    let updatedTemplate;
    try {
        updatedTemplate = JSON.parse(customAnimationJSON);
    } catch (error) {
        alert('Invalid JSON for custom animation. Please check your input.');
        return;
    }

    const templateIndex = animationTemplates.findIndex(t => t.id === editingTemplateId);
    if (templateIndex !== -1) {
        animationTemplates[templateIndex] = {
            ...animationTemplates[templateIndex],
            ...updatedTemplate
        };
        saveAnimationTemplates();
        alert('Template updated successfully!');
        updateAnimationTemplateSelect(editingTemplateId);
    }

    // Hide the custom animation fields and update button
    document.getElementById('customAnimationFields').classList.add('hidden');
    document.getElementById('updateTemplateBtn').classList.add('hidden');
    document.getElementById('editTemplateBtn').classList.remove('hidden');

    editingTemplateId = null;
}

function saveEditedTemplate() {
    if (!editingTemplateId) return;

    const customAnimationJSON = document.getElementById('editAnimations').value;
    let updatedTemplate;
    try {
        updatedTemplate = JSON.parse(customAnimationJSON);
    } catch (error) {
        alert('Invalid JSON for custom animation. Please check your input.');
        return;
    }

    const templateIndex = animationTemplates.findIndex(t => t.id === editingTemplateId);
    if (templateIndex !== -1) {
        animationTemplates[templateIndex] = {
            ...animationTemplates[templateIndex],
            ...updatedTemplate
        };
        saveAnimationTemplates();
        alert('Template updated successfully!');
        updateAnimationTemplateSelect(editingTemplateId);
    }

    // Remove the "Save Template" button
    const saveTemplateBtn = document.querySelector('#customAnimationFields button:last-child');
    if (saveTemplateBtn) saveTemplateBtn.remove();

    editingTemplateId = null;
}

function saveAsNewTemplate() {
    const settingsJSON = document.getElementById('editSettings').value;
    let newSettings;
    try {
        newSettings = JSON.parse(settingsJSON);
    } catch (error) {
        alert('Invalid JSON for settings. Please check your input.');
        return;
    }

    const templateName = prompt('Enter a name for this template:');
    if (!templateName) return;

    const templateId = templateName.toLowerCase().replace(/\s+/g, '-');
    const currentSize = getSelectedBanner(); // Assuming this function exists

    const newTemplate = {
        id: templateId,
        name: templateName,
        description: "User created template",
        img: "/img/default-template.gif",
        author: "User",
        date: new Date().toISOString().split('T')[0],
        version: "1.0.0",
        tags: [],
        categories: [],
        defaultSize: currentSize,
        size: {}
    };

    // Add the current size settings to the new template
    newTemplate.size[currentSize] = {
        width: newSettings.width,
        height: newSettings.height,
        img: newSettings.img,
        elements: newSettings.elements,
        layout: newSettings.layout
    };

    // Add the new template to settingsTemplates
    settingsTemplates[templateId] = newTemplate;

    // Save to localStorage
    localStorage.setItem('settingsTemplates', JSON.stringify(settingsTemplates));

    // Update the dropdown
    updateSettingsTemplateDropdown();

    alert('New template saved successfully!');
}

function updateSettingsTemplateDropdown() {
    const select = document.getElementById('editSettingsTemplate');
    select.innerHTML = '<option value="">Select a template</option>';

    Object.keys(settingsTemplates).forEach(templateId => {
        const option = document.createElement('option');
        option.value = templateId;
        option.textContent = settingsTemplates[templateId].name;
        select.appendChild(option);
    });

    const customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = 'Custom';
    select.appendChild(customOption);
}

function updateAnimationTemplateSelect(selectedId = '') {
    const animationTemplateSelect = document.getElementById('editAnimationTemplate');
    animationTemplateSelect.innerHTML = '<option value="">Select animation template</option>';
    animationTemplates.forEach(template => {
        const option = document.createElement('option');
        option.value = template.id;
        option.textContent = template.name;
        animationTemplateSelect.appendChild(option);
    });
    const customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = 'Custom';
    animationTemplateSelect.appendChild(customOption);

    animationTemplateSelect.value = selectedId;

    // Trigger the change event to update button visibility
    animationTemplateSelect.dispatchEvent(new Event('change'));
}

function saveAnimationTemplates() {
    localStorage.setItem('animationTemplates', JSON.stringify(animationTemplates));
}

// Load animation templates from localStorage on page load
function loadAnimationTemplates() {
    const savedTemplates = localStorage.getItem('animationTemplates');
    if (savedTemplates) {
        const parsedTemplates = JSON.parse(savedTemplates);
        // Instead of reassigning, we'll update the array contents
        animationTemplates.length = 0; // Clear the array
        animationTemplates.push(...parsedTemplates); // Add all saved templates
    }
}

function toggleSideBar() {
    // <div id="sideBar" class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-96 lg:flex-col">
    const sidebar = document.getElementById('sideBar');
    if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden',);
        sidebar.classList.add('fixed', 'inset-y-0', 'z-50', 'flex', 'w-full', 'flex-col')


    } else {
        sidebar.classList.add('hidden');
        sidebar.classList.remove('fixed', 'inset-y-0', 'z-50', 'flex', 'w-full', 'flex-col')
    }
}

// Function to scale banners
let isZoomed = true; // Start with zoomed (scaled) mode

function toggleZoom() {
    isZoomed = !isZoomed;
    if (isZoomed) {
        scaleBanners();
    } else {
        resetBanners();
    }
    updateZoomButtonText();
}

function scaleBanners() {
    const banners = document.querySelectorAll('.ad-container');
    const sidebar = document.getElementById('sideBar');
    const isSidebarVisible = window.innerWidth >= 1024 && getComputedStyle(sidebar).display !== 'none';
    const sidebarWidth = isSidebarVisible ? sidebar.offsetWidth : 0;
    const viewportWidth = window.innerWidth - sidebarWidth;
    const viewportHeight = window.innerHeight;

    banners.forEach(banner => {
        const originalWidth = parseInt(banner.getAttribute('data-original-width'));
        const originalHeight = parseInt(banner.getAttribute('data-original-height'));

        const widthScale = (viewportWidth * 0.95) / originalWidth;
        const heightScale = (viewportHeight * 0.7) / originalHeight;
        const scaleFactor = Math.min(widthScale, heightScale, 1);

        banner.style.transform = `scale(${scaleFactor})`;
        banner.style.width = `${originalWidth}px`;
        banner.style.height = `${originalHeight}px`;

        const marginHorizontal = (viewportWidth - (originalWidth * scaleFactor)) / 2;
        const marginVertical = (viewportHeight - (originalHeight * scaleFactor)) / 12;
        banner.style.margin = `${marginVertical}px ${marginHorizontal}px`;
    });
}

function resetBanners() {
    const banners = document.querySelectorAll('.ad-container');
    banners.forEach(banner => {
        banner.style.transform = 'scale(1)';
        banner.style.margin = '0';
        banner.style.width = `${banner.getAttribute('data-original-width')}px`;
        banner.style.height = `${banner.getAttribute('data-original-height')}px`;
    });
}

function storeOriginalSizes() {
    const banners = document.querySelectorAll('.ad-container');
    banners.forEach(banner => {
        if (!banner.hasAttribute('data-original-width')) {
            banner.setAttribute('data-original-width', banner.offsetWidth);
            banner.setAttribute('data-original-height', banner.offsetHeight);
        }
    });
}

function updateZoomButtonText() {
    const zoomButton = document.getElementById('zoomToggleButton');
    if (zoomButton) {
        zoomButton.innerHTML = isZoomed ? '<i class="fa-solid fa-up-right-and-down-left-from-center"></i> <span class="text-xs"></span>' : '<i class="fa-solid fa-down-left-and-up-right-to-center"></i><span class="text-xs"></span>';
    }
}

function createAndInsertZoomButton() {
    const existingButton = document.getElementById('zoomToggleButton');
    if (existingButton) {
        return; // Button already exists, no need to create a new one
    }

    const zoomButton = document.createElement('button');
    zoomButton.id = 'zoomToggleButton';
    zoomButton.className = 'px-1 py-1  hover:bg-sky-100 rounded-md cursor-pointer';
    zoomButton.onclick = toggleZoom;

    // Try to insert the button in the preferred location
    const buttonContainer = document.querySelector('.flex.gap-2');

    // Fallback: Insert the button as a fixed element if preferred location is not found
    zoomButton.style.position = 'fixed';
    zoomButton.style.top = '20px';
    zoomButton.style.right = '20px';
    zoomButton.style.zIndex = '40';
    document.body.appendChild(zoomButton);


    updateZoomButtonText();
}

function initScaling() {
    storeOriginalSizes();
    scaleBanners();
    createAndInsertZoomButton();
    window.addEventListener('resize', () => {
        if (isZoomed) {
            scaleBanners();
        }
    });
}

// Ensure initScaling runs after DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScaling);
} else {
    initScaling();
}



// Update the event listener for the settings toggle
document.getElementById('settingsToggle').addEventListener('change', toggleSlideSettings);

// Initialize slides and images
document.addEventListener('DOMContentLoaded', () => {

    convertAllTimestampsToMilliseconds();
    loadUISettings();
    loadAnimationTemplates();

    const settingsTemplateSelect = document.getElementById('editSettingsTemplate');
    const editTemplateBtn = document.getElementById('editSettingsTemplateBtn');
    const updateSettingsTemplateBtn = document.getElementById('updateSettingsTemplateBtn');
    const saveAsNewSettingsTemplateBtn = document.getElementById('saveAsNewSettingsTemplateBtn');
    const customSettingsFields = document.getElementById('customSettingsFields');

    populateSettingsTemplateDropdown();

    settingsTemplateSelect.addEventListener('change', handleSettingsTemplateSelection);
    editTemplateBtn.addEventListener('click', editSelectedTemplate);
    updateSettingsTemplateBtn.addEventListener('click', updateCurrentTemplate);
    saveAsNewSettingsTemplateBtn.addEventListener('click', saveAsNewTemplate);

    const toggleSwitch = document.getElementById('animationToggle');
    if (toggleSwitch) {
        toggleSwitch.checked = uiSettings.isAnimationsEnabled;
        toggleSwitch.addEventListener('change', toggleAnimations);
    } else {
        console.warn('Animation toggle switch not found in the DOM');
    }

    // Set the initial state of the settings toggle
    const settingsToggle = document.getElementById('settingsToggle');
    const animationToggle = document.getElementById('animationToggle');

    if (settingsToggle) {
        settingsToggle.checked = uiSettings.isSlideSettings;
        settingsToggle.addEventListener('change', function () {
            uiSettings.isSlideSettings = this.checked;
            if (uiSettings.isSlideSettings) {
                uiSettings.isAnimationsEnabled = true;
                if (animationToggle) {
                    animationToggle.checked = true;
                }
            }
            saveUISettings();
            applyUISettings();
            const size = getSelectedBanner();
            if (size) {
                applyAllSavedSettings(size);
            }
        });
    }

    if (animationToggle) {
        animationToggle.checked = uiSettings.isAnimationsEnabled;
        animationToggle.addEventListener('change', toggleAnimations);
    }

    applyUISettings();


    function updateScenelinePlayerVisibility() {
        const scenelinePlayer = document.querySelector('.sceneline-player');
        const adModeElements = document.querySelectorAll('.ad-mode');

        if (settingsToggle.checked) {
            scenelinePlayer.classList.remove('hidden');
            // Hide all ad-mode elements
            adModeElements.forEach(element => {
                element.classList.add('hidden');
            });
        } else {
            scenelinePlayer.classList.add('hidden');
            // Show all ad-mode elements
            adModeElements.forEach(element => {
                element.classList.remove('hidden');
            });
        }
    }

    // Initial visibility setup
    updateScenelinePlayerVisibility();

    // Add event listener for toggle changes
    settingsToggle.addEventListener('change', updateScenelinePlayerVisibility);

    // Apply saved settings for all banner sizes
    storedBannerSettings.forEach(bannerSetting => {
        applyAllSavedSettings(bannerSetting.size);
    });

    // Ensure backbanner colors are applied
    storedBannerSettings.forEach(bannerSetting => {
        const size = bannerSetting.size;
        const layoutSettings = bannerSetting.settings.layout;
        if (layoutSettings.colors && layoutSettings.colors.backbanner) {
            const backbanner = document.getElementById(`backbanner-${size}`);
            if (backbanner) {
                backbanner.style.backgroundColor = layoutSettings.colors.backbanner;
            }
        }
    });

    sizes.forEach(size => {
        applyAllSavedSettings(size);
    });



    // Apply settings for the initially selected banner
    const initialBanner = getSelectedBanner();
    if (initialBanner) {
        updateSliderValues(initialBanner);
        updateCheckboxStates(initialBanner);
        highlightSelectedBanner();
    }

    // Add event listeners for sliders
    const svgOneOpacitySlider = document.getElementById('svg-one-opacity');
    const svgTwoOpacitySlider = document.getElementById('svg-two-opacity');
    if (svgOneOpacitySlider) {
        svgOneOpacitySlider.addEventListener('input', () => {
            changeElementOpacity(svgOneOpacitySlider.value);
        });
    }
    if (svgTwoOpacitySlider) {
        svgTwoOpacitySlider.addEventListener('input', () => {
            changeElementOpacity(svgTwoOpacitySlider.value);
        });
    }

    updateSlides();
    updateImages();
    updateElementsList();
    applyElementPositions();
    highlightSelectedBanner();
    initializeTimeline();

    ensureAudioLoaded(() => {
        initializeTimeline();
        updateSlides();
    });

    // // Initialize the image gallery
    // const openGalleryButton = document.getElementById('openGalleryButton');
    // const closeGalleryButton = document.getElementById('closeGalleryButton');

    // if (openGalleryButton) {
    //     openGalleryButton.addEventListener('click', openImageGallery);
    // }

    // if (closeGalleryButton) {
    //     closeGalleryButton.addEventListener('click', closeImageGallery);
    // }

    // Initialize image URLs container
    const imageUrlsContainer = document.getElementById('imageUrlsContainer');
    storedImages.forEach((image, index) => {
        const inputField = document.createElement('div');
        inputField.classList.add('flex', 'items-center');
        inputField.innerHTML = `
            <label for="imageUrl-${index}" class="flex items-center mr-2"><i class="fa-solid fa-image p-1"></i> ${index + 1}</label>
            <input type="text" id="imageUrl-${index}" class="imageUrlInput flex-grow px-2 py-1 border rounded snap-center" value="${image}">
            <a onclick="deleteImageUrlInputField(${index})" class="p-1 cursor-pointer"><i class="fas fa-trash"></i></a>
        `;
        imageUrlsContainer.appendChild(inputField);
    });

    document.getElementById('addMoreImagesButton').addEventListener('click', addImageUrlInputField);
    document.getElementById('saveImagesButton').addEventListener('click', updateStoredImages);

    // Add event listeners for the edit slide modal
    document.getElementById('editSlideButton').addEventListener('click', openEditModal);
    document.getElementById('editSlideButtonSideBar').addEventListener('click', openEditModal);
    document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
    document.getElementById('editSlideForm').addEventListener('submit', handleEditFormSubmit);

    // move slider
    const moveMarkerButton = document.getElementById('moveMarkerButton');
    moveMarkerButton.addEventListener('click', toggleMoveMarker);

    // Event Listener for the new Add Slide button
    document.getElementById('addSlideButton').addEventListener('click', addSlideAtCurrentTime);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Shift') {
            isShiftKeyDown = true;
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Shift') {
            isShiftKeyDown = false;
        }
    });

    // Select an initial banner (e.g., the first one in storedBannerSettings)
    if (storedBannerSettings.length > 0) {
        selectBanner(storedBannerSettings[0].size);
    }

    initializeTimeline();

    // Additional check to hide the image if the setting is false
    storedBannerSettings.forEach(setting => {
        const size = setting.size;
        if (!setting.settings.elements.image) {
            const image = document.getElementById(`image-${size}`);
            if (image) {
                image.style.display = 'none';
            }
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (!selectedElement) return;

    const isShiftPressed = event.shiftKey;
    let step = isShiftPressed ? movementMultiplier : 5;

    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault(); // Prevent the page from scrolling up
            moveElement('up', step);
            break;
        case 'ArrowDown':
            event.preventDefault(); // Prevent the page from scrolling down
            moveElement('down', step);
            break;
        case 'ArrowLeft':
            moveElement('left', step);
            break;
        case 'ArrowRight':
            moveElement('right', step);
            break;
        case ']':
            if (isShiftPressed) changeZIndex('up');
            break;
        case '[':
            if (isShiftPressed) changeZIndex('down');
            break;
    }
});

document.addEventListener('DOMContentLoaded', initializeEnhancedTimeline);

document.getElementById('processImagesButton').addEventListener('click', () => {
    fetch('/api/process-images', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slides: storedSlides }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Refresh the slides here
            updateSlides();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

// Add this event listener to your audio element
document.getElementById('audioPlayer').addEventListener('loadedmetadata', onAudioLoaded);

document.addEventListener('DOMContentLoaded', function () {
    const elementSelector = document.getElementById('elementSelector');
    const increaseButton = document.getElementById('increaseZIndex');
    const decreaseButton = document.getElementById('decreaseZIndex');

    function updateArrowVisibility() {
        const isElementSelected = elementSelector.value !== "";
        increaseButton.style.visibility = isElementSelected ? 'visible' : 'hidden';
        decreaseButton.style.visibility = isElementSelected ? 'visible' : 'hidden';
    }

    elementSelector.addEventListener('change', updateArrowVisibility);
    document.getElementById('cancelEdit').addEventListener('click', closeEditModal);

    increaseButton.addEventListener('click', function () {
        if (elementSelector.value) {
            changeElementZIndex(elementSelector.value, 'increase');
        }
    });

    decreaseButton.addEventListener('click', function () {
        if (elementSelector.value) {
            changeElementZIndex(elementSelector.value, 'decrease');
        }
    });

    // Initial update of arrow visibility
    updateArrowVisibility();
});


window.onload = function () {



    // Apply settings for all banners
    storedBannerSettings.forEach(bannerSetting => {
        applyAllSavedSettings(bannerSetting.size);
    });

    // Select and highlight an initial banner (e.g., the first one)
    const initialBanner = storedBannerSettings[0].size;
    selectBanner(initialBanner);
    highlightSelectedBanner();
};

document.addEventListener('DOMContentLoaded', function () {

    applyStoredColors()
    const animationTemplateSelect = document.getElementById('editAnimationTemplate');
    const customAnimationFields = document.getElementById('customAnimationFields');

    // Add click event listeners for image selectors
    document.getElementById('mainImageSelector').addEventListener('click', () => openImageGallery('main'));
    document.getElementById('backdropImageSelector').addEventListener('click', () => openImageGallery('backdrop'));
    document.getElementById('frontdropImageSelector').addEventListener('click', () => openImageGallery('frontdrop'));
    document.getElementById('filterImageSelector').addEventListener('click', () => openImageGallery('filter'));

    // Populate the animation template dropdown
    animationTemplates.forEach(template => {
        const option = document.createElement('option');
        option.value = template.id;
        option.textContent = template.name;
        animationTemplateSelect.appendChild(option);
    });

    animationTemplateSelect.addEventListener('change', function () {
        if (this.value === 'custom') {
            customAnimationFields.classList.remove('hidden');
        } else {
            customAnimationFields.classList.add('hidden');
        }
    });
})