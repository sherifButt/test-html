let currentIndex = 0;
let currentImageIndex = 0;
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
let isMoveSlidesActive = false;
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

// Load settings from local storage or use default
const storedBannerSettings = JSON.parse(localStorage.getItem('bannerSettings')) || bannerSettings;
const storedAds = JSON.parse(localStorage.getItem('ads')) || ads;
const storedImages = JSON.parse(localStorage.getItem('images')) || images;

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
            if (element) {
                element.style.opacity = opacity;
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

    const elements = [
        { id: `logo-icon-${size}`, name: 'Logo' },
        { id: `logo-title-${size}`, name: 'Logo Title' },
        { id: `image-${size}`, name: 'Image' },
        { id: `headline-${size}`, name: 'Headline' },
        { id: `text-container-${size}`, name: 'Text Container' },
        { id: `text-${size}`, name: 'Text' },
        { id: `tags-${size}`, name: 'Tags' },
        { id: `cta-${size}`, name: 'CTA' },
        { id: `path-one-${size}`, name: 'SVG Wave 1' },
        { id: `path-two-${size}`, name: 'SVG Wave 2' }
    ];

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

    if (selectedElement) {
        const currentZIndex = parseInt(window.getComputedStyle(selectedElement).zIndex) || 0;
        const colorPicker = document.getElementById('element-color');
        if (selectedElement.tagName.toLowerCase() === 'path') {
            colorPicker.value = selectedElement.getAttribute('fill') || '#000000';
        } else {
            const computedColor = window.getComputedStyle(selectedElement).color;
            colorPicker.value = rgbToHex(computedColor);
        }
    }

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

    const elementType = selectedElement.id.split('-').slice(0, 2).join('-');
    console.log('elementType:', selectedElement.tagName.toLowerCase());

    if (elementType === 'path-one' || elementType === 'path-two') {
        selectedElement.setAttribute('fill', color);
        selectedElement.classList.remove('path-one', 'path-two');
        settings.colors[elementType.replace('-', '')] = color; // Convert 'path-one' to 'pathOne'
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
        const currentTop = parseInt(selectedElement.style.top) || 0;
        const currentLeft = parseInt(selectedElement.style.left) || 0;
        let newTop = currentTop;
        let newLeft = currentLeft;

        switch (direction) {
            case 'up': newTop -= step; break;
            case 'down': newTop += step; break;
            case 'left': newLeft -= step; break;
            case 'right': newLeft += step; break;
        }

        selectedElement.style.top = `${newTop}px`;
        selectedElement.style.left = `${newLeft}px`;
        selectedElement.style.position = 'relative';

        if (!settings.positions) settings.positions = {};
        settings.positions[elementType] = { top: `${newTop}px`, left: `${newLeft}px` };
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
        'svg-wave': 'svgWave'
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
    if (selectedBanner.classList.contains('border-blue-500')) {
        selectedBanner.classList.remove('border-blue-500', 'shadow-xl', 'ring-4', 'ring-blue-300');
        document.getElementById('bannerSelect').value = '';
    } else {
        document.getElementById('bannerSelect').value = size;
        document.querySelectorAll('.border-blue-500').forEach(el => el.classList.remove('border-blue-500', 'shadow-xl', 'ring-4', 'ring-blue-300'));
        selectedBanner.classList.add('border-blue-500', 'shadow-xl', 'ring-4', 'ring-blue-300');

        applyAllSavedSettings(size);
        updateSliderValues(size);
        updateCheckboxStates(size);
        updateElementsList();

        selectedElement = null;
        highlightSelectedElement();
        deselectElement();
    }
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
    }[element];
    settings[elementKey] = el.style.display !== 'none';
    saveSettings();
    updateElementsList(); // Refresh the elements list
}


function downloadSettings() {
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
}

function uploadSettings() {
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
    const adTextArray = storedAds[currentIndex].text;

    // Cycle through text lengths
    settings.textLength = (settings.textLength + 1) % adTextArray.length;
    textElement.innerText = adTextArray[settings.textLength];
    saveSettings();
}


function updateLogo(size) {
    const logoIcon = document.getElementById(`logo-icon-${size}`);
    const logo = storedAds[currentIndex].logo;
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

// Functions to control image z-index
function increaseImageZIndex() {
    const size = getSelectedBanner();
    const image = document.getElementById(`image-${size}`);
    let zIndex = parseInt(window.getComputedStyle(image).zIndex, 10);
    zIndex = isNaN(zIndex) ? 10 : zIndex + 10;
    image.style.zIndex = zIndex;

    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
    settings.imageZIndex = zIndex;
    saveSettings();
}

function decreaseImageZIndex() {
    const size = getSelectedBanner();
    const image = document.getElementById(`image-${size}`);
    let zIndex = parseInt(window.getComputedStyle(image).zIndex, 10);
    zIndex = isNaN(zIndex) ? 10 : Math.max(1, zIndex - 10);
    image.style.zIndex = zIndex;

    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
    settings.imageZIndex = zIndex;
    saveSettings();
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
    const adTextArray = storedAds[currentIndex].text;

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
        currentIndex = findAdIndexForTime(sliderTime * 1000);

        audioPlayer.play().then(() => {
            audioStarted = true;
            startAutoPlay();
            startCounter();
            playButton.innerHTML = '<i class="fas fa-pause w-10"></i>';
            playButton.classList.add('active');
        }).catch(error => {
            console.log('Audio play error:', error);
            audioPlayer.pause();
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
    if (newIndex !== currentIndex) {
        currentIndex = newIndex;
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
    const audioPlayer = document.getElementById('audioPlayer');
    if (autoPlayTimeout) {
        clearTimeout(autoPlayTimeout);
        autoPlayTimeout = null;
    }
    audioPlayer.pause();
    stopCounter();
    pauseStartTime = Date.now();
}

function startAutoPlay() {
    if (pauseStartTime !== null) {
        pausedTime += Date.now() - pauseStartTime;
        pauseStartTime = null;
    }
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
    currentIndex = 0;
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
}

function scheduleNextAd() {
    const audioPlayer = document.getElementById('audioPlayer');
    const currentTime = audioPlayer.currentTime * 1000; // Convert to milliseconds

    if (currentTime >= totalDuration) {
        // Audio has ended, stop scheduling
        return;
    }

    if (currentIndex < storedAds.length - 1) {
        const nextAdIndex = currentIndex + 1;
        const nextAdTime = getCurrentAdTimestamp(nextAdIndex);

        const delay = nextAdTime - currentTime;
        autoPlayTimeout = setTimeout(() => {
            currentIndex = nextAdIndex;
            updateAds();
            scheduleNextAd();
        }, Math.max(delay, 0));
    } else {
        // We're past the last ad, so just update the slider position
        autoPlayTimeout = setTimeout(() => {
            updateSliderPosition();
            scheduleNextAd(); // Keep calling this to continue updating the slider
        }, 1000); // Update every second
    }
}

function toggleMoveSlides() {
    const moveSlidesButton = document.getElementById('moveSlidesButton');
    isMoveSlidesActive = !isMoveSlidesActive;

    if (isMoveSlidesActive) {
        moveSlidesButton.classList.add('active', 'bg-blue-500', 'text-white');
        moveSlidesButton.classList.remove('bg-gray-300');
    } else {
        moveSlidesButton.classList.remove('active', 'bg-blue-500', 'text-white');
        moveSlidesButton.classList.add('bg-gray-300');
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
    const timelineMarkers = document.getElementById('timelineMarkers');

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

    // Update marker positions
    const markers = timelineMarkers.children;
    for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];
        const markerTime = parseInt(marker.getAttribute('data-time'));
        const markerPosition = ((markerTime - startTime) / (endTime - startTime)) * 100;
        marker.style.left = `${markerPosition}%`;
    }

    // Ensure current time is within visible range
    const currentTime = parseInt(timelineSlider.value);
    if (currentTime < startTime || currentTime > endTime) {
        timelineSlider.value = Math.min(Math.max(currentTime, startTime), endTime);
    }

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

    // Calculate total duration based on the last ad timestamp or audio duration, whichever is greater
    const lastAdTimestamp = Math.max(...storedAds.map(ad => ad.timestamp));
    const audioPlayer = document.getElementById('audioPlayer');
    totalDuration = Math.max(lastAdTimestamp, audioPlayer.duration * 1000);

    console.log(`Last ad timestamp: ${lastAdTimestamp}, Audio duration: ${audioPlayer.duration * 1000}`);
    console.log(`Total duration set to: ${totalDuration}`);

    // Set slider max value
    timelineSlider.max = totalDuration;

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

function convertAllTimestampsToMilliseconds() {
    storedAds.forEach(ad => {
        if (typeof ad.timestamp === 'string') {
            const [minutes, seconds] = ad.timestamp.split(':').map(Number);
            ad.timestamp = (minutes * 60 + seconds) * 1000;
        }
    });
    saveSettings();
    console.log('All timestamps converted to milliseconds');
}

function handleMarkerClick(event, index) {
    if (isMoveSlidesActive || isShiftKeyDown) {
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
    currentIndex = findAdIndexForTime(sliderValue);

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
    currentIndex = findAdIndexForTime(timestamp);
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
    const visibleDuration = parseInt(timelineSlider.max) - parseInt(timelineSlider.min);
    const sliderPosition = ((currentTime - parseInt(timelineSlider.min)) / visibleDuration) * 100;
    timelineSlider.value = currentTime;
    console.log(`Updating slider position: ${sliderPosition}% (${currentTime}ms / ${visibleDuration}ms)`);
}

function updateSlideNavigationButtons() {
    const prevButton = document.getElementById('prevSlideButton');
    const currentButton = document.getElementById('currentSlideButton');
    const nextButton = document.getElementById('nextSlideButton');

    const prevIndex = Math.max(0, currentIndex - 1);
    const nextIndex = Math.min(storedAds.length - 1, currentIndex + 1);

    prevButton.textContent = storedAds[prevIndex].headline;
    currentButton.textContent = storedAds[currentIndex].headline;
    nextButton.textContent = storedAds[nextIndex].headline;

    prevButton.onclick = () => jumpToAd(prevIndex);
    currentButton.onclick = () => jumpToAd(currentIndex);
    nextButton.onclick = () => jumpToAd(nextIndex);
}

function updateTimelineMarkers() {
    const markers = document.querySelectorAll('#timelineMarkers > div');
    markers.forEach((marker, index) => {
        if (index === currentIndex) {
            marker.classList.remove('bg-blue-500');
            marker.classList.add('bg-red-500');
        } else {
            marker.classList.remove('bg-red-500');
            marker.classList.add('bg-blue-500');
        }
    });
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

    if (isMoveSlidesActive) {
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

    // Update currentIndex
    currentIndex = storedAds.findIndex(ad => ad.timestamp === currentTime);

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
    const dampingFactor = 0.25 / zoomLevel;
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

    // Update currentIndex
    currentIndex = storedAds.findIndex(ad => ad.timestamp === newTimestamp);

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

    // Update currentIndex to point to the new slide
    currentIndex = insertIndex;

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
    const markerPosition = (getCurrentAdTimestamp(currentIndex) / totalDuration) * 100;

    newMarker.className = 'absolute w-2.5 h-2.5 bg-green-500 rounded-full cursor-pointer transform -translate-x-1/2';
    newMarker.style.left = `${markerPosition}%`;
    newMarker.style.top = '-10px';
    newMarker.title = formatTimestamp(getCurrentAdTimestamp(currentIndex));
    newMarker.onclick = (event) => handleMarkerClick(event, currentIndex);

    timelineMarkers.appendChild(newMarker);

    // Highlight the new marker
    setTimeout(() => {
        newMarker.classList.remove('bg-green-500');
        newMarker.classList.add('bg-red-500');
    }, 1000);
}

function updateAds() {
    const sizes = ["480x120", "300x250", "160x600", "300x250-text", "728x90", "1200x628", "1200x628-2", "1080x1080"];
    sizes.forEach(size => {
        const pathOne = document.getElementById(`path-one-${size}`);
        const pathTwo = document.getElementById(`path-two-${size}`);
        const headline = document.getElementById(`headline-${size}`);
        const textContainer = document.getElementById(`text-container-${size}`);
        const text = document.getElementById(`text-${size}`);
        const tags = document.getElementById(`tags-${size}`);
        const cta = document.getElementById(`cta-${size}`);
        const image = document.getElementById(`image-${size}`);
        const logoIcon = document.getElementById(`logo-icon-${size}`);
        const logoTitle = document.getElementById(`logo-title-${size}`);
        const settings = storedBannerSettings.find(setting => setting.size === size).settings;

        const ad = storedAds[currentIndex];
        const animation = ad.animation || {};

        if (headline) headline.innerText = ad.headline;
        const adTextArray = ad.text;
        if (text) text.innerText = adTextArray[settings.layout.textLength] || adTextArray[0];
        if (tags) tags.innerText = ad.tags;
        if (cta && cta.innerText !== '>') {
            cta.innerText = ad.cta;
        }
        updateLogo(size);

        if (ad.img) {
            if (image) image.src = ad.img;
        }

        if (pathOne) pathOne.style.display = settings.elements.svgWave ? 'block' : 'none';
        if (pathTwo) pathTwo.style.display = settings.elements.svgWave ? 'block' : 'none';
        if (headline) headline.style.display = settings.elements.headline ? 'block' : 'none';
        if (text) text.style.display = settings.elements.text ? 'block' : 'none';
        if (tags) tags.style.display = settings.elements.tags ? 'block' : 'none';
        if (cta) cta.style.display = settings.elements.cta ? 'block' : 'none';
        if (image) image.style.display = settings.elements.image ? 'block' : 'none';
        if (logoIcon) logoIcon.style.display = settings.elements.logoIcon ? 'block' : 'none';

        if (image) image.style.width = settings.layout.imageSize;
        if (headline) headline.style.fontSize = settings.layout.titleSize;
        if (text) text.style.fontSize = settings.layout.bodySize;

        if (logoIcon) {
            logoIcon.style.transform = `rotate(${settings.layout.logoRotation}deg)`;
        }

        if (image) image.style.zIndex = settings.layout.imageZIndex || 30;

        if (pathOne) applyAnimation(pathOne, animation.pathOne || 'hidden-element');
        if (pathTwo) applyAnimation(pathTwo, animation.pathTwo || 'hidden-element');
        if (headline) applyAnimation(headline, animation.headline || 'hidden-element');
        if (text) applyAnimation(text, animation.text || 'hidden-element');
        if (tags) applyAnimation(tags, animation.tags || 'hidden-element');
        if (cta) applyAnimation(cta, animation.cta || 'hidden-element');
        if (image) applyAnimation(image, animation.image || 'hidden-element');
        if (logoIcon) applyAnimation(logoIcon, animation.logoIcon || 'hidden-element');
    });

    updateSlideNavigationButtons();
    updateTimelineMarkers();
}

function applyAnimation(element, animationClass) {
    if (element && animationClass) {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, 1750); // Duration of the animation
    }
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
    if (currentIndex < storedAds.length - 1) {
        currentIndex++;
        jumpToAd(currentIndex);
    }
}

function previousAd() {
    if (currentIndex > 0) {
        currentIndex--;
        jumpToAd(currentIndex);
    }
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
    currentIndex = index;
    updateAds();

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
}

function nextImage() {
    if (currentImageIndex < storedImages.length - 1) {
        currentImageIndex++;
        updateImages();
    }
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
        cta.innerText = storedAds[currentIndex].cta;
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
    const adTextArray = storedAds[currentIndex].text;
    if (adTextArray.length > 1) {
        const currentIndex = adTextArray.indexOf(currentText);
        const nextIndex = currentIndex === adTextArray.length - 1 ? 0 : currentIndex + 1;
        textElement.innerText = adTextArray[nextIndex];
    }
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

function downloadAds() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storedAds));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "ads.json");
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

function openEditModal() {
    const modal = document.getElementById('editSlideModal');
    const form = document.getElementById('editSlideForm');

    const banners = document.getElementById('banners');


    const currentSlide = storedAds[currentIndex];

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
    if (currentIndex === storedAds.length - 1 || storedAds[currentIndex].timestamp !== storedAds[currentIndex + 1].timestamp) {
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
    storedAds[currentIndex] = updatedSlide;

    // Sort the storedAds array based on timestamps
    storedAds.sort((a, b) => a.timestamp - b.timestamp);

    // Update the currentIndex to reflect the new position of the edited slide
    currentIndex = storedAds.findIndex(slide => slide.timestamp === updatedSlide.timestamp);

    // Save changes
    saveSettings();

    // Update the UI
    updateAds();
    initializeTimeline();

    // Close the modal
    closeEditModal();
}

// Initialize ads and images
document.addEventListener('DOMContentLoaded', () => {

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

    // Initialize image URLs container
    const imageUrlsContainer = document.getElementById('imageUrlsContainer');
    storedImages.forEach((image, index) => {
        const inputField = document.createElement('div');
        inputField.classList.add('flex', 'items-center', 'mb-2');
        inputField.innerHTML = `
            <label for="imageUrl-${index}" class="mr-2 w-24">Image ${index + 1}:</label>
            <input type="text" id="imageUrl-${index}" class="imageUrlInput flex-grow px-2 py-1 border rounded" value="${image}">
            <a onclick="deleteImageUrlInputField(${index})" class="p-2 cursor-pointer"><i class="fas fa-times"></i></a>
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
    const moveSlidesButton = document.getElementById('moveSlidesButton');
    moveSlidesButton.addEventListener('click', toggleMoveSlides);

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

