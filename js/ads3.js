let currentIndex = 0;
let currentImageIndex = 0;

// Load settings from local storage or use default
const storedBannerSettings = JSON.parse(localStorage.getItem('bannerSettings')) || bannerSettings;
const storedAds = JSON.parse(localStorage.getItem('ads')) || ads;
const storedImages = JSON.parse(localStorage.getItem('images')) || images;

function toggleDrawer(open) {
    const drawer = document.querySelector('.drawer');
    if (open) {
        drawer.classList.remove('translate-x-full');
        document.addEventListener('click', handleClickOutsideDrawer);
    } else {
        drawer.classList.add('translate-x-full');
        document.removeEventListener('click', handleClickOutsideDrawer);
    }
}

function toggleAdsContainer(open) {
    const adsContainer = document.getElementById('adsContainer');
    const subAdsContainer = document.getElementById('subAdsContainer');
    if (open) {
        adsContainer.classList.remove('w-3/4')
        adsContainer.classList.add('w-2/5');
        subAdsContainer.classList.remove('lg:grid-cols-2')
        subAdsContainer.classList.add('lg:grid-cols-1');
    } else {
        adsContainer.classList.remove('w-2/5');
        adsContainer.classList.add('w-3/4');

        subAdsContainer.classList.remove('lg:grid-cols-1')
        subAdsContainer.classList.add('lg:grid-cols-2');
    }

}

function getSelectedBanner() {
    return document.getElementById('bannerSelect').value;
}

function updateCheckboxStates(size) {
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.elements;
    const elements = ['logo-icon', 'image', 'headline', 'text', 'tags', 'cta', 'svg'];
    elements.forEach(element => {
        const checkbox = document.getElementById(`toggle-${element}`);
        if (checkbox) {
            checkbox.checked = settings[element];
        }
    });

    const backgroundCheckbox = document.getElementById('toggle-background');
    if (backgroundCheckbox) {
        backgroundCheckbox.checked = settings.backgroundImage;
    }
}


function selectBanner(size) {
    const selectedBanner = document.getElementById(`ad-container-${size}`);
    const isSelected = selectedBanner.classList.contains('border-blue-500');

    document.querySelectorAll('.border-blue-500').forEach(el => el.classList.remove('border-blue-500', 'shadow-xl', 'ring-4', 'ring-blue-300'));

    if (!isSelected) {

        selectedBanner.classList.add('border-blue-500', 'shadow-xl', 'ring-4', 'ring-blue-300');
        document.getElementById('bannerSelect').value = size;
        updateSliderValues(size);
        updateCheckboxStates(size);
        openDrawer(); // Open drawer when a banner is selected
        toggleAdsContainer(true);
    }
}

function openDrawer() {
    const drawer = document.querySelector('.drawer');
    if (drawer.classList.contains('translate-x-full')) {
        drawer.classList.remove('translate-x-full');
    }

    // Add an event listener to close the drawer when clicking outside
    document.addEventListener('click', handleClickOutsideDrawer);
}

function closeDrawer() {
    const drawer = document.querySelector('.drawer');
    if (!drawer.classList.contains('translate-x-full')) {
        drawer.classList.add('translate-x-full');
    }

    // Remove the event listener to close the drawer when clicking outside
    document.removeEventListener('click', handleClickOutsideDrawer);
}

function handleClickOutsideDrawer(event) {
    const drawer = document.querySelector('.drawer');
    const bannerSelect = document.getElementById('bannerSelect');
    const bannerContainers = document.querySelectorAll('.ad-container');
    let clickedInsideBanner = false;

    bannerContainers.forEach(container => {
        if (container.contains(event.target)) {
            clickedInsideBanner = true;
        }
    });

    if (!drawer.contains(event.target) && !bannerSelect.contains(event.target) && !clickedInsideBanner) {
        toggleDrawer(false); // Close the drawer when clicking outside
        toggleAdsContainer(false);
    }
}

function updateSliderValues(size) {
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.layout;
    document.getElementById('svg-one-opacity').value = settings.svgOneOpacity;
    document.getElementById('svg-two-opacity').value = settings.svgTwoOpacity;
    document.getElementById('opacity').value = settings.imageOpacity;
}

function saveSettings() {
    localStorage.setItem('bannerSettings', JSON.stringify(storedBannerSettings));
    localStorage.setItem('ads', JSON.stringify(storedAds));
    localStorage.setItem('images', JSON.stringify(storedImages));
}

function toggleElement(element) {
    const size = getSelectedBanner();
    const el = document.getElementById(`${element}-${size}`);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
    const settings = storedBannerSettings.find(setting => setting.size === size).settings.elements;
    settings[element] = el.style.display !== 'none';
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
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ ads: storedAds, bannerSettings: storedBannerSettings, images: storedImages }));
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
            localStorage.setItem('ads', JSON.stringify(parsed.ads));
            localStorage.setItem('bannerSettings', JSON.stringify(parsed.bannerSettings));
            localStorage.setItem('images', JSON.stringify(parsed.images));
            location.reload(); // reload to apply the new settings
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
        const currentText = text ? text.innerText : '';
        const adTextArray = storedAds[currentIndex].text;
        if (text && !adTextArray.includes(currentText)) {
            text.innerText = adTextArray[0];
        }
        if (tags) tags.innerText = storedAds[currentIndex].tags;
        if (cta && cta.innerText !== '>') {
            cta.innerText = storedAds[currentIndex].cta;
        }
        updateLogo(size);

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
            text?.classList.remove('slide-from-left');
            tags?.classList.remove('slide-from-right');
            cta?.classList.remove('slide-from-bottom');
            image?.classList.remove('slide-from-top');
            logoIcon?.classList.remove(isHorizontal ? 'slide-from-left' : 'slide-from-left');
        }, 1750);
    });
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
            <label for="imageUrl-${index}" class="mr-2">Image URL ${index + 1}:</label>
            <input type="text" id="imageUrl-${index}" class="imageUrlInput flex-grow px-2 py-1 border rounded" value="${image}">
            <button onclick="deleteImageUrlInputField(${index})" class="ml-2 text-red-500"><i class="fas fa-times"></i></button>
        `;
        imageUrlsContainer.appendChild(inputField);
    });

    document.getElementById('addMoreImagesButton').addEventListener('click', addImageUrlInputField);
    document.getElementById('saveImagesButton').addEventListener('click', updateStoredImages);

    // Close drawer when clicking the close button
    document.querySelector('.drawer .fa-times').addEventListener('click', closeDrawer);
});






