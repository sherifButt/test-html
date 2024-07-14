let currentIndex = 0;
let currentImageIndex = 0;

// Load settings from local storage or use default
const storedBannerSettings = JSON.parse(localStorage.getItem('bannerSettings')) || bannerSettings;
const storedAds = JSON.parse(localStorage.getItem('ads')) || ads;
const storedImages = JSON.parse(localStorage.getItem('images')) || images;

function getSelectedBanner() {
    return document.getElementById('bannerSelect').value;
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
        selectedBanner.classList.remove('border-blue-500', 'shadow-xl','ring-4','ring-blue-300');
        document.getElementById('bannerSelect').value = '';
    } else {
        document.getElementById('bannerSelect').value = size;
        document.querySelectorAll('.border-blue-500').forEach(el => el.classList.remove('border-blue-500', 'shadow-xl','ring-4','ring-blue-300'));
        selectedBanner.classList.add('border-blue-500', 'shadow-xl','ring-4','ring-blue-300');
        updateSliderValues(size);
        updateCheckboxStates(size);
    }
}

function updateSliderValues(size) {
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
    if (settings) {
        if (settings.svgOneOpacity !== undefined) {
            document.getElementById('svg-one-opacity').value = settings.svgOneOpacity;
        }
        if (settings.svgTwoOpacity !== undefined) {
            document.getElementById('svg-two-opacity').value = settings.svgTwoOpacity;
        }
        if (settings.imageOpacity !== undefined) {
            document.getElementById('opacity').value = settings.imageOpacity;
        }
        if (settings.titleSize) {
            document.getElementById('title-size').value = settings.titleSize.replace('rem', '');
        }
        if (settings.bodySize) {
            document.getElementById('body-size').value = settings.bodySize.replace('rem', '');
        }
        if (settings.imageSize) {
            document.getElementById('image-size').value = settings.imageSize.replace('%', '');
        }
        if (settings.logoRotation !== undefined) {
            const logoIcon = document.getElementById(`logo-icon-${size}`);
            logoIcon.style.transform = `rotate(${settings.logoRotation}deg)`;
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
    const el = document.getElementById(`${element}-${size}`);
    if (el) {
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    }
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.elements;
    const elementKey = {
        'logo-icon': 'logoIcon',
        'svg-wave': 'svgWave',
        'image': 'image',
        'headline': 'headline',
        'text': 'text',
        'tags': 'tags',
        'cta': 'cta'
    }[element];
    settings[elementKey] = el.style.display !== 'none';
    saveSettings();
}




function setOpacity() {
    const size = getSelectedBanner();
    const image = document.getElementById(`image-${size}`);
    const container = document.getElementById(`ad-container-${size}`);
    const opacity = document.getElementById('opacity').value;
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
    settings.imageOpacity = opacity;
    if (settings.backgroundImage) {
        container.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, ${1 - opacity}), rgba(255, 255, 255, ${1 - opacity})), url(${image.src})`;
    } else {
        image.style.opacity = opacity;
    }
    saveSettings();
}

function setSvgOpacity(item) {
    const size = getSelectedBanner();
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
    settings[`svg${item.charAt(0).toUpperCase() + item.slice(1)}Opacity`] = document.getElementById(`svg-${item}-opacity`).value;
    const path = document.getElementById(`path-${item}-${size}`);
    if (path) path.style.fillOpacity = settings[`svg${item.charAt(0).toUpperCase() + item.slice(1)}Opacity`];
    saveSettings();
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


function updateAds() {
    const sizes = ["480x120", "300x250", "160x600", "300x250-text", "728x90", "1200x628", "1200x628-2"];
    sizes.forEach(size => {
        const pathOne = document.getElementById(`path-one-${size}`);
        const pathTwo = document.getElementById(`path-two-${size}`);
        const headline = document.getElementById(`headline-${size}`);
        const text = document.getElementById(`text-${size}`);
        const tags = document.getElementById(`tags-${size}`);
        const cta = document.getElementById(`cta-${size}`);
        const image = document.getElementById(`image-${size}`);
        const logoIcon = document.getElementById(`logo-icon-${size}`);
        const settings = storedBannerSettings.find(setting => setting.size === size).settings;
        

        if (headline) headline.innerText = storedAds[currentIndex].headline;
        const adTextArray = storedAds[currentIndex].text;
        if (text) text.innerText = adTextArray[settings.layout.textLength] || adTextArray[0];
        if (tags) tags.innerText = storedAds[currentIndex].tags;
        if (cta && cta.innerText !== '>') {
            cta.innerText = storedAds[currentIndex].cta;
        }
        updateLogo(size);

        // Apply visibility settings to elements
        if (pathOne) pathOne.style.display = settings.elements.svgWave ? 'block' : 'none';
        if (pathTwo) pathTwo.style.display = settings.elements.svgWave ? 'block' : 'none';
        if (headline) headline.style.display = settings.elements.headline ? 'block' : 'none';
        if (text) text.style.display = settings.elements.text ? 'block' : 'none';
        if (tags) tags.style.display = settings.elements.tags ? 'block' : 'none';
        if (cta) cta.style.display = settings.elements.cta ? 'block' : 'none';
        if (image) image.style.display = settings.elements.image ? 'block' : 'none';
        if (logoIcon) logoIcon.style.display = settings.elements.logoIcon ? 'block' : 'none';

        // Apply size settings
        if (image) image.style.width = settings.layout.imageSize;
        if (headline) headline.style.fontSize = settings.layout.titleSize;
        if (text) text.style.fontSize = settings.layout.bodySize;

        // Apply rotation setting
        if (logoIcon) {
            logoIcon.style.transform = `rotate(${settings.layout.logoRotation}deg)`;
        }

        // Apply z-index setting
        if (image) image.style.zIndex = settings.layout.imageZIndex || 30;
        

        // Initially hide all elements
        if (pathOne) pathOne.classList.add('hidden-element');
        if (pathTwo) pathTwo.classList.add('hidden-element');
        if (headline) headline.classList.add('hidden-element');
        if (text) text.classList.add('hidden-element');
        if (tags) tags.classList.add('hidden-element');
        if (cta) cta.classList.add('hidden-element');
        if (image) image.classList.add('hidden-element');
        if (logoIcon) logoIcon.classList.add('hidden-element');

        // Determine if the banner is horizontal
        const isHorizontal = size === '480x120' || size === '728x90' || size === '1200x628' || size === '1200x628-2';

        // Apply animations
        if (isHorizontal) {
            setTimeout(() => pathOne?.classList.replace('hidden-element', 'slide-from-bottom'), 0);
            setTimeout(() => pathTwo?.classList.replace('hidden-element', 'slide-from-bottom'), 250);
            setTimeout(() => logoIcon?.classList.replace('hidden-element', 'slide-from-left'), 500);
            setTimeout(() => headline?.classList.replace('hidden-element', 'slide-from-top'), 500);
            setTimeout(() => text?.classList.replace('hidden-element', 'slide-from-right'), 1000);
            setTimeout(() => tags?.classList.replace('hidden-element', 'slide-from-right'), 1250);
            setTimeout(() => cta?.classList.replace('hidden-element', 'slide-from-bottom'), 1500);
            setTimeout(() => image?.classList.replace('hidden-element', 'slide-from-top'), 1750);
        } else {
            setTimeout(() => pathOne?.classList.replace('hidden-element', 'slide-from-bottom'), 0);
            setTimeout(() => pathTwo?.classList.replace('hidden-element', 'slide-from-bottom'), 250);
            setTimeout(() => logoIcon?.classList.replace('hidden-element', 'slide-from-left'), 500);
            setTimeout(() => headline?.classList.replace('hidden-element', 'slide-from-left'), 500);
            setTimeout(() => text?.classList.replace('hidden-element', 'slide-from-left'), 750);
            setTimeout(() => tags?.classList.replace('hidden-element', 'slide-from-left'), 1000);
            setTimeout(() => cta?.classList.replace('hidden-element', 'slide-from-bottom'), 1250);
            setTimeout(() => image?.classList.replace('hidden-element', 'slide-from-bottom'), 1500);
        }

        if (size === '160x600' || size === '728x90' || size === '300x250' || size === '480x120') {
            cta.innerText = '>';
            cta.style.padding = '5px 12px';
            cta.style.borderRadius = '100%';
        }

        // Remove animation classes after animation ends to enable re-animation if needed
        setTimeout(() => {
            pathOne?.classList.remove('slide-from-bottom');
            pathTwo?.classList.remove('slide-from-bottom');
            headline?.classList.remove(isHorizontal ? 'slide-from-top' : 'slide-from-left');
            text?.classList.remove(isHorizontal ? 'slide-from-right' : 'slide-from-left');
            tags?.classList.remove(isHorizontal ? 'slide-from-right' : 'slide-from-left');
            cta?.classList.remove('slide-from-bottom');
            image?.classList.remove(isHorizontal ? 'slide-from-top' : 'slide-from-bottom');
            logoIcon?.classList.remove('slide-from-left');
        }, 1750);
    });
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
    const sizes = ["160x600", "480x120", "300x250", "300x250-text", "728x90", "1200x628", "1200x628-2"];
    sizes.forEach(size => {
        document.getElementById(`image-${size}`).src = storedImages[currentImageIndex];
    });
}

function previousAd() {
    if (currentIndex > 0) {
        currentIndex--;
        updateAds();
    }
}

function nextAd() {
    if (currentIndex < storedAds.length - 1) {
        currentIndex++;
        updateAds();
    }
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
    setOpacity();
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
        { size: '1200x628-2', dimensions: '1200x628' }
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
    xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend = function() {
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


// Initialize ads and images
document.addEventListener('DOMContentLoaded', () => {
    updateAds();
    updateImages();

    const initialBanner = getSelectedBanner();
    if (initialBanner) {
        updateSliderValues(initialBanner);
        updateCheckboxStates(initialBanner);
    }
    highlightSelectedBanner(); 
    setOpacity();
    setSvgOpacity('one');
    setSvgOpacity('two');

    const imageUrlsContainer = document.getElementById('imageUrlsContainer');
    storedImages.forEach((image, index) => {
        const inputField = document.createElement('div');
        inputField.classList.add('flex', 'items-center', 'mb-2');
        inputField.innerHTML = `
            <label for="imageUrl-${index}" class="mr-2 w-24"> Image ${index + 1}:</label>
            <input type="text" id="imageUrl-${index}" class="imageUrlInput flex-grow px-2 py-1 border rounded" value="${image}">
            <a onclick="deleteImageUrlInputField(${index})" class="p-2 cursor-pointer "><i class="fas fa-times"></i></a>
        `;
        imageUrlsContainer.appendChild(inputField);
    });

    document.getElementById('addMoreImagesButton').addEventListener('click', addImageUrlInputField);
    document.getElementById('saveImagesButton').addEventListener('click', updateStoredImages);

    // Additional check to hide the image if the setting is false
    Object.keys(storedBannerSettings).forEach((key) => {
        const size = storedBannerSettings[key].size;
        if (!storedBannerSettings[key].settings.elements.image) {
            const image = document.getElementById(`image-${size}`);
            if (image) {
                image.style.display = 'none';
            }
        }
    });
});





