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
// update ads object
let currentCampaignIndex = 0;

// fix jumbig issue
// fix jumping issue
let isAutoPlayActive = false;

// update animationTemplates array object
const sizes = ["480x120", "300x250", "160x600", "300x250-text", "728x90", "1200x628", "1200x628-2", "1080x1080","1080x1920"];

let currentImageType = 'main';

// implanting campaign object
let ads = campaigns[currentCampaignIndex].ads.map(ad => {
    return {
        ...ad,
        logo: campaigns[currentCampaignIndex].logo,
        audio: campaigns[currentCampaignIndex].audio.url
    }
});

let campaign = campaigns[currentCampaignIndex];
delete campaign.ads;



// Load settings from local storage or use default
const storedBannerSettings = JSON.parse(localStorage.getItem('bannerSettings')) || bannerSettings;
const storedAds = JSON.parse(localStorage.getItem('ads')) || ads;
const storedImages = JSON.parse(localStorage.getItem('images')) || images;
const storedFilters = JSON.parse(localStorage.getItem('filters')) || filters;
const storedCampaigns = JSON.parse(localStorage.getItem('campaigns')) || campaigns;
const storedCampaign = JSON.parse(localStorage.getItem('campaign')) || campaign;
const storedCurrentCampaignIndex = JSON.parse(localStorage.getItem('currentCampaignIndex')) || currentCampaignIndex;
let currentAdIndex = JSON.parse(localStorage.getItem('currentAdIndex')) || 0;
let currentImageIndex = JSON.parse(localStorage.getItem('currentImageIndex')) || 0;

function getSelectedBanner() {
    return document.getElementById('bannerSelect').value;
}



// Add this function to apply all saved settings for a specific banner size
function applyAllSavedSettings(size) {
    const settings = storedBannerSettings.find(setting => setting.size === size).settings;
    
    const layoutSettings = settings.layout;
    const elementSettings = settings.elements;

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
                    element.style.position = 'relative';
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
            if(elementType === 'backdrop'){
                const backdropImage = document.getElementById(`backdropimage-${size}`);
                if(backdropImage){
                    backdropImage.style.opacity = opacity;
                }
            } else if (elementType === 'frontdrop'){
                const frontdropImage = document.getElementById(`frontdropimage-${size}`);
                if(frontdropImage){
                    frontdropImage.style.opacity = opacity;
                }
            } else if (elementType === 'filter'){
                const filterImage = document.getElementById(`filterimage-${size}`);
                if(filterImage){
                    filterImage.style.opacity = opacity;
                }
            } else if (element) {
                element.style.opacity = opacity;
            }
        });
    }

    // Apply blur filters
    if (layoutSettings.filters) {
        Object.entries(layoutSettings.filters).forEach(([elementType, filter]) => {
            const element = document.getElementById(`${elementType}-${size}`);
            if (elementType === 'backdrop') {
                const backdropImage = document.getElementById(`backdropimage-${size}`);
                if (backdropImage) {
                    backdropImage.style.filter = filter;
                }
            } else if (elementType === 'frontdrop') {
                const frontdropImage = document.getElementById(`frontdropimage-${size}`);
                if (frontdropImage) {
                    frontdropImage.style.filter = filter;
                }
            } else if (elementType === 'filter') {
                const filterImage = document.getElementById(`filterimage-${size}`);
                if (filterImage) {
                    filterImage.style.filter = filter;
                }
            } else if (element) {
                element.style.filter = filter;
            }
        });
    }


                

    // Apply SVG opacities
    if (layoutSettings.opacities) {
        if (layoutSettings.opacities.svgOneOpacity !== undefined) {
            const pathOne = document.getElementById(`path-one-${size}`);
            if (pathOne) pathOne.setAttribute('fill-opacity', layoutSettings.opacities.svgOneOpacity);
            const sliderOne = document.getElementById('svg-one-opacity');
            if (sliderOne) sliderOne.value = layoutSettings.opacities.svgOneOpacity;
        }
        if (layoutSettings.opacities.svgTwoOpacity !== undefined) {
            const pathTwo = document.getElementById(`path-two-${size}`);
            if (pathTwo) pathTwo.setAttribute('fill-opacity', layoutSettings.opacities.svgTwoOpacity);
            const sliderTwo = document.getElementById('svg-two-opacity');
            if (sliderTwo) sliderTwo.value = layoutSettings.opacities.svgTwoOpacity;
        }
    }

    // Apply colors
    applyStoredColors();

    // Apply other layout settings
    if (layoutSettings.imageSize) {
        const image = document.getElementById(`image-${size}`);
        if (image) image.style.width = layoutSettings.imageSize;
    }
    if (layoutSettings.titleSize) {
        const headline = document.getElementById(`headline-${size}`);
        if (headline) headline.style.fontSize = layoutSettings.titleSize;
    }
    if (layoutSettings.bodySize) {
        const text = document.getElementById(`text-${size}`);
        if (text) text.style.fontSize = layoutSettings.bodySize;
    }
    if (layoutSettings.logoRotation !== undefined) {
        const logoIcon = document.getElementById(`logo-icon-${size}`);
        if (logoIcon) logoIcon.style.transform = `rotate(${layoutSettings.logoRotation}deg)`;
    }
    if (layoutSettings.backgroundImage !== undefined) {
        toggleBackground();
    }

    // Apply settings for new elements
    const backgroundBanner = document.getElementById(`backbanner-${size}`);
    if (backgroundBanner && layoutSettings.backgroundBannerStyle) {
        Object.assign(backgroundBanner.style, layoutSettings.backgroundBannerStyle);
    }
}

function changeElementBlur(value) {
    if (!selectedElement) return;
    const size = getSelectedBanner();
    const elementType = selectedElement.id.split('-')[0];
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

    // Save the blur setting
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
    if (!settings.filters) settings.filters = {};
    settings.filters[elementType] = blurValue;
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
    const setting = storedBannerSettings.find(s => s.size === size);
    if (setting && setting.settings[category] && setting.settings[category][subcategory]) {
        setting.settings[category][subcategory][key] = value;
        saveSettings();
    }
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
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;

    if (!settings.colors) {
        settings.colors = {};
    }

    const elementType = selectedElement.id.split('-')[0];
    settings.colors[elementType] = color;

    saveSettings();
}


function saveBackgroundColor(color) {
    const size = getSelectedBanner();
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;

    if (!settings.colors) {
        settings.colors = {};
    }

    settings.colors.background = color;

    saveSettings();
}

function resetColors() {
    const size = getSelectedBanner();
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;

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
    const elementType = selectedElement.id.split('-')[0];
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;

    if (selectedElement.tagName.toLowerCase() === 'path') {
        // SVG path handling remains the same
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
        if (!settings.positions) settings.positions = {};
        settings.positions[elementType] = newTransform;
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

        if (!settings.positions) settings.positions = {};
        settings.positions[elementType] = { top: `${currentTop}px`, left: `${currentLeft}px` };
    }

    saveSettings();
}


// Update the changeZIndex function to increase/decrease by a larger step if Shift is pressed
function changeZIndex(direction) {
    if (!selectedElement) return;

    const size = getSelectedBanner();
    const elementType = selectedElement.id.split('-')[0];
    const currentZIndex = parseInt(window.getComputedStyle(selectedElement).zIndex) || 0;
    const newZIndex = direction === 'up' ? currentZIndex + 10 : Math.max(0, currentZIndex - 10);

    selectedElement.style.zIndex = newZIndex;

    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
    if (!settings.zIndex) settings.zIndex = {};
    settings.zIndex[elementType] = newZIndex;

    saveSettings();
}

// Update the rotateElement function
function rotateElement(direction) {
    if (!selectedElement) return;
    const size = getSelectedBanner();
    const elementType = selectedElement.id.split('-')[0];
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;

    const currentRotation = selectedElement.style.transform ?
        parseInt(selectedElement.style.transform.replace(/[^\d-]/g, '')) : 0;
    const newRotation = direction === 'left' ? currentRotation - 15 : currentRotation + 15;
    selectedElement.style.transform = `rotate(${newRotation}deg)`;

    // Save the new rotation
    if (!settings.rotations) settings.rotations = {};
    settings.rotations[elementType] = newRotation;

    saveSettings();
}

// Update the mirrorElement function
function mirrorElement() {
    if (!selectedElement) return;
    const size = getSelectedBanner();
    const elementType = selectedElement.id.split('-')[0];
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;

    const currentScale = selectedElement.style.transform && selectedElement.style.transform.includes('scale')
        ? parseInt(selectedElement.style.transform.split('scale(')[1])
        : 1;
    const newScale = -currentScale;
    selectedElement.style.transform = `scale(${newScale}, 1)`;

    // Save the new scale
    if (!settings.scales) settings.scales = {};
    settings.scales[elementType] = newScale;

    saveSettings();
}

// Update the resizeElement function
function resizeElement(direction) {
    if (!selectedElement) return;
    const size = getSelectedBanner();
    const elementType = selectedElement.id.split('-')[0];
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;

    const currentScale = selectedElement.style.transform && selectedElement.style.transform.includes('scale')
        ? parseFloat(selectedElement.style.transform.split('scale(')[1])
        : 1;
    const newScale = direction === 'up' ? currentScale * 1.1 : currentScale * 0.9;
    selectedElement.style.transform = `scale(${newScale})`;

    // Save the new scale
    if (!settings.scales) settings.scales = {};
    settings.scales[elementType] = newScale;

    saveSettings();
}

// Update the changeElementOpacity function
function changeElementOpacity(value) {
    if (!selectedElement) return;
    const size = getSelectedBanner();
    const elementType = selectedElement.id.split('-')[0];
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;

    if (selectedElement.id.startsWith('path-')) {
        selectedElement.setAttribute('fill-opacity', value);
        const svgNumber = selectedElement.id.includes('one') ? 'One' : 'Two';
        if (!settings.opacities) settings.opacities = {};
        settings.opacities[`svg${svgNumber}Opacity`] = value;
    } else {
        selectedElement.style.opacity = value;
        if (!settings.opacities) settings.opacities = {};
        settings.opacities[elementType] = value;
    }

    saveSettings();
}


// Update the applyElementPositions function
function applyElementPositions() {
    const size = getSelectedBanner();
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;

    if (settings.positions) {
        Object.entries(settings.positions).forEach(([elementType, position]) => {
            const element = document.getElementById(`${elementType}-${size}`);
            if (element) {
                if (element.tagName.toLowerCase() === 'path') {
                    element.setAttribute('transform', position);
                } else {
                    element.style.position = 'relative';
                    element.style.top = position.top;
                    element.style.left = position.left;
                }
            }
        });
    }

    if (settings.rotations) {
        Object.entries(settings.rotations).forEach(([elementType, rotation]) => {
            const element = document.getElementById(`${elementType}-${size}`);
            if (element) {
                element.style.transform = `rotate(${rotation}deg)`;
            }
        });
    }

    if (settings.scales) {
        Object.entries(settings.scales).forEach(([elementType, scale]) => {
            const element = document.getElementById(`${elementType}-${size}`);
            if (element) {
                element.style.transform = `scale(${scale})`;
            }
        });
    }

    if (settings.opacities) {
        Object.entries(settings.opacities).forEach(([elementType, opacity]) => {
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
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;

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
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.elements;
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

       
    } applyAllSavedSettings(size);

        updateSliderValues(size);
        updateCheckboxStates(size);
        updateElementsList();

        selectedElement = null;
        highlightSelectedElement();
        deselectElement();
}



function updateSliderValues(size) {
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
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
    localStorage.setItem('bannerSettings', JSON.stringify(storedBannerSettings));
    localStorage.setItem('ads', JSON.stringify(storedAds));
    localStorage.setItem('images', JSON.stringify(storedImages));
    localStorage.setItem('filters', JSON.stringify(storedFilters));
    localStorage.setItem('campaigns', JSON.stringify(storedCampaigns));
    localStorage.setItem('campaign', JSON.stringify(storedCampaign));
    localStorage.setItem('currentCampaignIndex', JSON.stringify(currentCampaignIndex));
    localStorage.setItem('currentAdIndex', JSON.stringify(currentAdIndex));
    localStorage.setItem('currentImageIndex', JSON.stringify(currentImageIndex));
}

function toggleElement(element) {
    const size = getSelectedBanner();
    let el;
    if (element === 'svg-wave') {
        const pathOne = document.getElementById(`path-one-${size}`);
        const pathTwo = document.getElementById(`path-two-${size}`);
        if (pathOne) pathOne.style.display = pathOne.style.display === 'none' ? 'block' : 'none';
        if (pathTwo) pathTwo.style.display = pathTwo.style.display === 'none' ? 'block' : 'none';
        el = pathOne; // Use pathOne for toggling the setting
    } else {
        el = document.getElementById(`${element}-${size}`);
        if (el) {
            el.style.display = el.style.display === 'none' ? 'block' : 'none';
        }
    }
    if (!element) return;
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.elements;
    const elementKey = {
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
        'frontdrop': 'frontdrop',
        'backdrop': 'backdrop',
        'filter': 'filter',
        'backbanner': 'backbanner'

    }[element];
    settings[elementKey] = el.style.display !== 'none';
    saveSettings();
    updateElementsList(); // Refresh the elements list
}


async function downloadSettings() {
    await convertAllTimestampsToMinutes();
    const settingsToDownload = {
        ads: storedAds,
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

async function uploadSettings() {
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
            if (parsed.ads && parsed.bannerSettings && parsed.images) {
                localStorage.setItem('ads', JSON.stringify(parsed.ads));
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
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
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
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
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
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
    settings.logoRotation = rotation;
    saveSettings();
}

function updateTextLength() {
    const size = getSelectedBanner();
    const textElement = document.getElementById(`text-${size}`);
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
    const adTextArray = storedAds[currentAdIndex].text;

    // Cycle through text lengths
    settings.textLength = (settings.textLength + 1) % adTextArray.length;
    textElement.innerText = adTextArray[settings.textLength];
    saveSettings();
}


function updateLogo(size) {
    const logoIcon = document.getElementById(`logo-icon-${size}`);
    const logo = storedAds[currentAdIndex].logo;
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

    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
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

    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
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

    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
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
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
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
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
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
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
    settings.imageSize = imageSize;
    saveSettings();
}

function updateTextLength() {
    const size = getSelectedBanner();
    const textElement = document.getElementById(`text-${size}`);
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
    const adTextArray = storedAds[currentAdIndex].text;

    // Cycle through text lengths
    settings.textLength = (settings.textLength + 1) % adTextArray.length;
    textElement.innerText = adTextArray[settings.textLength];
    saveSettings();
}

function updateImages() {
    const sizes = ["160x600", "480x120", "300x250", "300x250-text", "728x90", "1200x628", "1200x628-2", "1080x1080"];
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
            const firstAdAudioSrc = storedAds[0].audio;
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
    while (index < storedAds.length - 1 && getCurrentAdTimestamp(index + 1) <= time) {
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
    while (newIndex < storedAds.length - 1 && getCurrentAdTimestamp(newIndex + 1) <= newTimestamp) {
        newIndex++;
    }

    // Update current index and ads if necessary
    if (newIndex !== currentAdIndex) {
        currentAdIndex = newIndex;
        updateAds();
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
    updateAds();
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
    const timestamp = storedAds[index].timestamp;
    return timestamp; // Assuming all timestamps are now stored as milliseconds
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

    if (currentAdIndex < storedAds.length - 1) {
        const nextAdIndex = currentAdIndex + 1;
        const nextAdTime = getCurrentAdTimestamp(nextAdIndex);

        const delay = nextAdTime - currentTime;

        if (isAutoPlayActive) {
            const currentAd = storedAds[currentAdIndex];
            const currentAnimation = currentAd.animation || {};
            const currentTemplate = animationTemplates.find(t => t.id === currentAnimation.template);
            const exitDuration = currentTemplate ? currentTemplate.exit.settings.duration + currentTemplate.exit.settings.delay : 0;

            autoPlayTimeout = setTimeout(() => {
                handleExitAnimations(() => {
                    currentAdIndex = nextAdIndex;
                    updateAds();
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

function toggleMoveMarker() {
    const moveMarkerButton = document.getElementById('moveMarkerButton');
    isMoveMarkerActive = !isMoveMarkerActive;

    if (isMoveMarkerActive) {
        moveMarkerButton.classList.add('active', 'bg-blue-500', 'text-white');
        moveMarkerButton.classList.remove('bg-gray-300');
    } else {
        moveMarkerButton.classList.remove('active', 'bg-blue-500', 'text-white');
        moveMarkerButton.classList.add('bg-gray-300');
    }
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
    const lastAdTimestamp = Math.max(...storedAds.map(ad => ad.timestamp));
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
    storedAds.forEach((ad, index) => {
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
    updateAds();
}

async function convertAllTimestampsToMilliseconds() {
    storedAds.forEach(ad => {
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
    storedAds.forEach(ad => {
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

    storedAds[index].timestamp = currentTime; // Store as milliseconds

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

    // Update ads
    updateAds();

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
    updateAds();
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
    const nextIndex = Math.min(storedAds.length - 1, currentAdIndex + 1);

    prevButton.innerHTML = '<i class="fas fa-backward-step"></i> ' + storedAds[prevIndex].headline;
    currentButton.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> ' + storedAds[currentAdIndex].headline;
    nextButton.innerHTML = storedAds[nextIndex].headline + ' <i class="fas fa-forward-step"></i>';

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
    marker.className = 'absolute w-2.5 h-2.5 bg-blue-500 rounded-full cursor-pointer transform -translate-x-1/2';
    marker.style.left = `${markerPosition}%`;
    marker.style.top = '-10px';
    marker.title = formatTimestamp(timestamp);
    marker.setAttribute('data-index', index);
    marker.setAttribute('data-time', timestamp);

    marker.addEventListener('mousedown', handleMarkerInteraction);
    marker.addEventListener('touchstart', handleMarkerInteraction, { passive: false });

    timelineMarkers.appendChild(marker);

    console.log(`Marker created at position: ${markerPosition}%`);
}

function handleMarkerInteraction(e) {
    e.preventDefault();
    const marker = e.target;
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

    storedAds[index].timestamp = currentTime;

    // Update the marker position
    updateMarkerPosition(index, currentTime);

    // Sort storedAds based on new timestamps
    storedAds.sort((a, b) => a.timestamp - b.timestamp);

    // Update currentAdIndex
    currentAdIndex = storedAds.findIndex(ad => ad.timestamp === currentTime);

    // Save changes and update UI
    saveSettings();
    initializeTimeline();
    updateAds();

    console.log(`Slide ${index} moved to ${formatTimestamp(currentTime)}`);
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
    if (!isDragging) return;

    const index = parseInt(draggedMarker.getAttribute('data-index'));
    const newTimestamp = parseInt(draggedMarker.getAttribute('data-time'));

    // Update the timestamp in storedAds
    storedAds[index].timestamp = newTimestamp;

    // Sort storedAds based on new timestamps
    storedAds.sort((a, b) => a.timestamp - b.timestamp);

    // Update currentAdIndex
    currentAdIndex = storedAds.findIndex(ad => ad.timestamp === newTimestamp);

    // Revert the counter to its original value
    document.getElementById('timeCounter').innerText = originalCounterValue;

    // Save changes and update UI
    saveSettings();
    initializeTimeline();
    updateAds();

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
    while (insertIndex < storedAds.length && getCurrentAdTimestamp(insertIndex) < currentTime) {
        insertIndex++;
    }

    // Copy data from the previous slide (or the next slide if it's the first one)
    const sourceIndex = insertIndex > 0 ? insertIndex - 1 : Math.min(insertIndex, storedAds.length - 1);
    const newSlide = JSON.parse(JSON.stringify(storedAds[sourceIndex])); // Deep copy

    // Update the timestamp of the new slide
    newSlide.timestamp = currentTime;

    // Insert the new slide
    storedAds.splice(insertIndex, 0, newSlide);

    // Update currentAdIndex to point to the new slide
    currentAdIndex = insertIndex;

    // Save changes
    saveSettings();

    // Update the UI
    updateAds();
    initializeTimeline();

    // Open edit modal for the new slide
    openEditModal();
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

function updateAds() {

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
            // backdropImage: document.getElementById(`backdropimage-${size}`),
            filter: document.getElementById(`filter-${size}`),
            // filterImage: document.getElementById(`filterimage-${size}`),
            frontdrop: document.getElementById(`frontdrop-${size}`),
            // frontdropImage: document.getElementById(`frontdropimage-${size}`),
            backbanner: document.getElementById(`backbanner-${size}`)
        };
        const settings = storedBannerSettings.find(setting => setting.size === size).settings;

        const ad = storedAds[currentAdIndex];
        const animation = ad.animation || {};

        // Update content
        if (elements.headline) elements.headline.innerText = ad.headline;
        const adTextArray = ad.text;
        if (elements.text) elements.text.innerText = adTextArray[settings.layout.textLength] || adTextArray[0];
        if (elements.tags) elements.tags.innerText = ad.tags;
        if (elements.cta && elements.cta.innerText !== '>') {
            elements.cta.innerText = ad.cta;
        }

        updateLogo(size);

        // Update background banner
        if (ad.img && elements.image) elements.image.src = ad.img;
        if (ad.imageBackground && elements.imageBackground) elements.imageBackground.src = ad.imageBackground;
        if (ad.filter && elements.filter) elements.filter.style.backgroundColor = ad.filter;

        // if (ad.filterImage && elements.filterImage) elements.filterImage.src = ad.filterImage;
        // if (ad.backdropImage && elements.backdropImage) elements.backdropImage.src = ad.backdropImage;
        // if (ad.frontdropImage && elements.frontdropImage) elements.frontdropImage.src = ad.frontdropImage;
        


        // Apply visibility settings
        Object.entries(elements).forEach(([key, element]) => {
            if (key == 'pathOne' || key == 'pathTwo') {
                if (elements.svgWave) {
                    elements.svgWave.style.display = settings.elements[key] ? 'block' : 'none';
                }

            } else if (element) {
                element.style.display = settings.elements[key] ? 'block' : 'none';

            }
        });

        // Apply other settings
        if (elements.image) elements.image.style.width = settings.layout.imageSize;
        if (elements.headline) elements.headline.style.fontSize = settings.layout.titleSize;
        if (elements.text) elements.text.style.fontSize = settings.layout.bodySize;
        if (elements.logoIcon) elements.logoIcon.style.transform = `rotate(${settings.layout.logoRotation}deg)`;
        if (elements.image) elements.image.style.zIndex = settings.layout.imageZIndex || 30;



        // Apply entry animations
        if (animation.template && animation.isEntryAnimated) {
            const template = animationTemplates.find(t => t.id === animation.template);
            if (template) {
                const { settings: animationSettings, elements: animationElements } = template.entry;
                Object.entries(elements).forEach(([key, element]) => {
                    if (element && animationElements[key]) {
                        applyAnimation(element, animationElements[key], animationSettings);
                    }
                });
            }
        }
    });

    updateSlideNavigationButtons();
    updateTimelineMarkers();
}

function applyAnimation(element, animationClass, settings) {
    if (element && animationClass) {
        // Remove existing and entering animation classes by getting the classList from animationTemplates array .entry.elements object and exit.elements object 
        const animationClasses = Object.values(animationTemplates).reduce((acc, template) => {
            const entryClasses = Object.values(template.entry.elements);
            const exitClasses = Object.values(template.exit.elements);
            return [...acc, ...entryClasses, ...exitClasses];
        }
            , []);

        element.classList.remove(...animationClasses);

        // Set animation properties
        element.style.animationDuration = `${settings.duration}ms`;
        element.style.animationDelay = `${settings.delay}ms`;
        element.style.animationTimingFunction = settings.easing;

        // Force a reflow
        void element.offsetWidth;

        // Add the animation class
        element.classList.add(animationClass);
    }
}

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

        const ad = storedAds[currentAdIndex];
        const animation = ad.animation || {};

        if (animation.template && animation.isExitAnimated) {
            const template = animationTemplates.find(t => t.id === animation.template);
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
    if (currentAdIndex < storedAds.length - 1) {
        handleExitAnimations(() => {
            currentAdIndex++;
            jumpToAd(currentAdIndex);
        });
    }
    saveSettings();
}

function previousAd() {
    if (currentAdIndex > 0) {
        handleExitAnimations(() => {
            currentAdIndex--;
            jumpToAd(currentAdIndex);
        });
    }
    saveSettings();
}

function jumpToAd(index) {
    const audioPlayer = document.getElementById('audioPlayer');
    const timestamp = getCurrentAdTimestamp(index);

    jumpToTime(timestamp);

    // Update the startTime to reflect the new position
    startTime = Date.now() - timestamp;
    pausedTime = 0;

    // Update audio position
    audioPlayer.currentTime = timestamp / 1000; // Convert to seconds

    // Update ads
    currentAdIndex = index;


    updateAds();


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
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
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
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
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
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
    settings.bodySize = `${fontSize}px`;
    saveSettings();
}

function toggleBackground() {
    const size = getSelectedBanner();
    if (!size) {
        console.error('No banner selected');
        return;
    }
    const container = document.getElementById(`ad-container-${size}`);
    const image = document.getElementById(`image-${size}`);
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
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
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;

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
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;

    if (cta.innerText === '>') {
        cta.innerText = storedAds[currentAdIndex].cta;
        cta.style.padding = '5px 12px';
        cta.style.borderRadius = '4px';
        settings.ctaStyle = 'default';
    } else {
        cta.innerText = '>';
        cta.style.padding = '5px 12px';
        cta.style.borderRadius = '100%';
        settings.ctaStyle = 'circle';
    }
    saveSettings();
}

function toggleTextLength() {
    const size = getSelectedBanner();
    const textElement = document.getElementById(`text-${size}`);
    const currentText = textElement.innerText;
    const adTextArray = storedAds[currentAdIndex].text;
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
        { size: '1080x1080', dimensions: '1080x1080' }
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

async function downloadAds() {
    await convertAllTimestampsToMinutes();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storedAds));
    await convertAllTimestampsToMilliseconds();
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "slides.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}



function uploadAds() {
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
            localStorage.setItem('ads', JSON.stringify(parsed));
            location.reload(); // reload to apply the new settings
        }
    }
    input.click();
}

async function downloadCampaign() {
    const campaign = { ...storedCampaign, slides: storedAds };
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
            // delete parsed.ads;
            localStorage.setItem('campaign', JSON.stringify(parsed));
            localStorage.setItem('ads', JSON.stringify(parsed.ads));
            location.reload(); // reload to apply the new settings
        }
    }
    input.click();
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
    openImageGallery();
}
function openFrontdropGallery() {
    currentImageType = 'frontdrop';
    openImageGallery();
}

function openFilterGallery() {
    currentImageType = 'filter';
    openImageGallery('filter');
}

function openImageGallery(type = 'main') {
    const modal = document.getElementById('imageGalleryModal');
    const grid = document.getElementById('imageGalleryGrid');
    grid.innerHTML = ''; // Clear existing images

    const imageSource = type === 'filter' ? storedFilters : storedImages;

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
 currentImageType = type;
    modal.classList.remove('hidden');
}

function closeImageGallery() {
    const modal = document.getElementById('imageGalleryModal');
    modal.classList.add('hidden');
}

function selectGalleryImage(imageUrl) {

    sizes.forEach(size => {
        let imgElement;
        switch (currentImageType) {
            case 'frontdrop':
                imgElement = document.getElementById(`frontdropimage-${size}`);
                break;
            case 'backdrop':
                imgElement = document.getElementById(`backdropimage-${size}`);
                break;
            case 'filter':
                imgElement = document.getElementById(`filter-${size}`);
                break;
            default:
                imgElement = document.getElementById(`image-${size}`);
        }

        if (imgElement) {
            imgElement.src = imageUrl;
        }
    });

    // Update the current slide's image URL in storedAds
    if (currentImageType === 'main') {
        storedAds[currentAdIndex].img = imageUrl;
    } else if (currentImageType === 'backdrop') {
        storedAds[currentAdIndex].backdrop = imageUrl;
    } else if (currentImageType === 'filter') {
        storedAds[currentAdIndex].filter = imageUrl;
    } else if (currentImageType === 'frontdrop') {
        storedAds[currentAdIndex].frontdrop = imageUrl;
    }

    // Save the changes
    saveSettings();

    // Close the gallery
    closeImageGallery();

    // Reset the currentImageType
    currentImageType = 'main';
}



function openEditModal() {
    const modal = document.getElementById('editSlideModal');
    const form = document.getElementById('editSlideForm');

    const banners = document.getElementById('banners');


    const currentSlide = storedAds[currentAdIndex];

    // Populate form fields
    form.timestamp.value = currentSlide.timestamp;
    form.audio.value = currentSlide.audio;
    form.logoIcon.value = currentSlide.logo.icon;
    form.logoFirstWord.value = currentSlide.logo.firstWord;
    form.logoSecondWord.value = currentSlide.logo.secondWord;
    form.headline.value = currentSlide.headline;
    form.text.value = currentSlide.text.join('\n');
    form.tags.value = currentSlide.tags;
    form.img.value = currentSlide.img;
    form.cta.value = currentSlide.cta;
    form.animations.value = JSON.stringify(currentSlide.animation, null, 2);

    modal.classList.remove('hidden');
    banners.classList.add('hidden');

    // If this is a new slide, highlight the new marker
    if (currentAdIndex === storedAds.length - 1 || storedAds[currentAdIndex].timestamp !== storedAds[currentAdIndex + 1].timestamp) {
        updateTimelineWithNewMarker();
    }
}

function closeEditModal() {
    const modal = document.getElementById('editSlideModal');
    const banners = document.getElementById('banners');

    modal.classList.add('hidden');
    banners.classList.remove('hidden');
}

function handleEditFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const updatedSlide = {
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
        img: form.img.value,
        cta: form.cta.value,
        animation: JSON.parse(form.animations.value)
    };

    // Update the current slide in storedAds
    storedAds[currentAdIndex] = updatedSlide;

    // Sort the storedAds array based on timestamps
    storedAds.sort((a, b) => a.timestamp - b.timestamp);

    // Update the currentAdIndex to reflect the new position of the edited slide
    currentAdIndex = storedAds.findIndex(slide => slide.timestamp === updatedSlide.timestamp);

    // Save changes
    saveSettings();

    // Update the UI
    updateAds();
    initializeTimeline();

    // Close the modal
    closeEditModal();
}

function toggleSideBar() {
    // <div id="sideBar" class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-96 lg:flex-col">
    const sidebar = document.getElementById('sideBar');
    if(sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden',);
    sidebar.classList.add('fixed', 'inset-y-0', 'z-50', 'flex','w-full', 'flex-col')

       
    } else {
        sidebar.classList.add('hidden');
        sidebar.classList.remove('fixed', 'inset-y-0', 'z-50', 'flex','w-full', 'flex-col')
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
        const marginVertical = (viewportHeight - (originalHeight * scaleFactor)) / 2;
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
// Initialize ads and images
document.addEventListener('DOMContentLoaded', () => {

    convertAllTimestampsToMilliseconds();

    // Apply saved settings for all banner sizes
    storedBannerSettings.forEach(bannerSetting => {
        applyAllSavedSettings(bannerSetting.size);
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

    updateAds();
    updateImages();
    updateElementsList();
    applyElementPositions();
    highlightSelectedBanner();
    initializeTimeline();

    ensureAudioLoaded(() => {
        initializeTimeline();
        updateAds();
    });

    // Initialize the image gallery
    const openGalleryButton = document.getElementById('openGalleryButton');
    const closeGalleryButton = document.getElementById('closeGalleryButton');

    if (openGalleryButton) {
        openGalleryButton.addEventListener('click', openImageGallery);
    }

    if (closeGalleryButton) {
        closeGalleryButton.addEventListener('click', closeImageGallery);
    }

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
        body: JSON.stringify({ ads: storedAds }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Refresh the ads here
            updateAds();
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


window.onload = function() {
    // Apply settings for all banners
    storedBannerSettings.forEach(bannerSetting => {
      applyAllSavedSettings(bannerSetting.size);
    });
  
    // Select and highlight an initial banner (e.g., the first one)
    const initialBanner = storedBannerSettings[0].size;
    selectBanner(initialBanner);
    highlightSelectedBanner();
  };
  
  