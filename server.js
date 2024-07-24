const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

const PORT = 4000;
const OPENAI_API_KEY = 'your_openai_api_key_here';
const REMOVE_BG_API_KEY = 'your_remove_bg_api_key_here';

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`Received request for ${pathname}`);

  // Handle API routes
  if (pathname.startsWith('/api')) {
    handleApiRequest(req, res, pathname);
    return;
  }

  // Serve static files
  const filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        console.error(`File not found: ${filePath}`);
        res.writeHead(404);
        res.end('File not found');
      } else {
        console.error(`Server error: ${error.code}`);
        res.writeHead(500);
        res.end('Internal server error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
      console.log(`Served file: ${filePath}`);
    }
  });
});

async function handleApiRequest(req, res, pathname) {
  if (pathname === '/api/process-images' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        console.log('Received request to process images');
        await processAdImages(data.ads);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Images processed successfully' }));
        console.log('Images processed successfully');
      } catch (error) {
        console.error('Error processing images:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error processing images' }));
      }
    });
  } else {
    console.log(`Invalid API route: ${pathname}`);
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
}

async function processAdImages(ads) {
  for (const ad of ads) {
    if (ad.imgDescription) {
      try {
        console.log(`Processing image for ad: ${ad.headline}`);
        const imageUrl = await generateImageWithOpenAI(ad.imgDescription);
        console.log(`Image generated: ${imageUrl}`);
        const imageWithoutBg = await removeImageBackground(imageUrl);
        console.log('Background removed from image');
        const fileName = await saveImage(imageWithoutBg, ad.img);
        console.log(`Image saved as: ${fileName}`);
        ad.img = fileName;
      } catch (error) {
        console.error(`Error processing image for ad ${ad.headline}:`, error);
      }
    }
  }
}

function generateImageWithOpenAI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(responseData);
        if (response.data && response.data[0] && response.data[0].url) {
          resolve(response.data[0].url);
        } else {
          reject(new Error('Invalid response from OpenAI API'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

function removeImageBackground(imageUrl) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      image_url: imageUrl,
      size: 'auto'
    });

    const options = {
      hostname: 'api.remove.bg',
      port: 443,
      path: '/v1.0/removebg',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': REMOVE_BG_API_KEY
      }
    };

    const req = https.request(options, (res) => {
      let chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

function saveImage(imageBuffer, originalName) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5').update(imageBuffer).digest('hex');
    const ext = path.extname(originalName);
    const fileName = `${hash}${ext}`;
    const filePath = path.join(__dirname, 'img', fileName);

    fs.writeFile(filePath, imageBuffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`/img/${fileName}`);
      }
    });
  });
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});