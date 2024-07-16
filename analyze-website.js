const fs = require('fs').promises;
const path = require('path');
const http = require('http');
const https = require('https');
const url = require('url');

const args = process.argv.slice(2);
const shouldScan = args.includes('-scan');

const rootDir = process.cwd();
const outputDir = path.join(rootDir, 'link-check');
const reportFile = path.join(outputDir, 'index.html');
const siteMapFile = path.join(outputDir, 'link_check_site_map.txt');
const xmlSitemapFile = path.join(rootDir, 'sitemap.xml');
const historyFile = path.join(outputDir, 'link_check_history.json');
const structureFile = path.join(outputDir, 'link_check_structure.yaml');
const extendedStructureFile = path.join(outputDir, 'link_check_extended_structure.yaml');
const blogTestFile = path.join(rootDir, 'blog.html');


const imagesDir = path.join(rootDir, 'img');
const blogsDir = path.join(rootDir, 'blog');
const imagesJsFile = path.join(rootDir, 'cache', 'images.js');
const blogsJsFile = path.join(rootDir, 'cache', 'blogs.js');
const catsJsFile = path.join(rootDir, 'cache', 'cats.js');

let brokenLinks = [];
let siteMap = new Map();
let xmlUrls = new Set();
let detectedDomain = null;
let folderStructure = {};
let extendedFolderStructure = {};
let htmlFileCount = 0;

async function analyzeWebsite() {
    try {
        console.log('Starting website analysis...');
        console.log(`Root directory: ${rootDir}`);

        if (shouldScan) {
            console.log('Scanning folders to generate blogs.js, images.js, and cats.js...');
            await createOutputDirectory();
            await createCacheDirectory();
            console.log('Processing directory...');
            await processDirectory(rootDir);
            console.log(`Total HTML files found: ${htmlFileCount}`);
            if (htmlFileCount === 0) {
                console.warn('No HTML files were found in the directory structure.');
            }
            if (!detectedDomain) {
                console.warn('Warning: Could not detect domain. Using a placeholder.');
                detectedDomain = 'https://example.com/';
            }
            console.log(`Detected domain: ${detectedDomain}`);
            await generateImagesJsFile();
            await generateBlogsJsFile();
            await generateCatsJsFile();
        } else {
            console.log('Skipping folder scanning and using existing blogs.js, images.js, and cats.js...');
        }

        const previousResults = await loadPreviousResults();

        await Promise.all([
            generateHTMLReport(previousResults),
            writeSiteMap(),
            generateXMLSitemap(),
            generateYAMLStructure(),
            generateExtendedYAMLStructure(),
            saveCurrentResults(),
            generateBlogHtml(),
            generateBlogsIndexHtml()
        ]);

        console.log('Analysis complete. Check the link-check folder and sitemap.xml for results.');
        console.log(`Files generated:
        - ${reportFile}
        - ${siteMapFile}
        - ${xmlSitemapFile}
        - ${historyFile}
        - ${structureFile}
        - ${extendedStructureFile}
        - ${imagesJsFile}
        - ${blogsJsFile}
        - ${catsJsFile}
        - ${blogTestFile}`);

        process.exit(0);
    } catch (error) {
        console.error('Error during analysis:', error);
        process.exit(1);
    }
}


async function processDirectory(dir, structure = folderStructure, extendedStructure = extendedFolderStructure, level = 0) {
    console.log(`Processing directory (level ${level}): ${dir}`);
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        console.log(`Found ${entries.length} entries in ${dir}`);

        for (const entry of entries) {
            const name = entry.name;
            const filePath = path.join(dir, name);
            const relativePath = path.relative(rootDir, filePath);

            if (name.startsWith('.') || name === 'link-check') {
                console.log(`Skipping: ${filePath}`);
                continue;
            }

            if (entry.isDirectory()) {
                console.log(`Found directory: ${filePath}`);
                structure[name] = {};
                extendedStructure[name] = {};
                await processDirectory(filePath, structure[name], extendedStructure[name], level + 1);
            } else {
                console.log(`Found file: ${filePath}`);
                structure[name] = null;
                if (path.extname(name).toLowerCase() === '.html') {
                    console.log(`Processing HTML file: ${filePath}`);
                    htmlFileCount++;
                    await processHtmlFile(filePath);
                    const metadata = await extractHtmlMetadata(filePath);
                    console.log(`Extracted metadata for ${filePath}:`, metadata);
                    extendedStructure[name] = metadata;
                } else {
                    console.log(`Non-HTML file: ${filePath}`);
                    extendedStructure[name] = null;
                }
            }
        }
        console.log(`Finished processing directory (level ${level}): ${dir}`);
        console.log(`Structure at this level:`, JSON.stringify(structure, null, 2));
        console.log(`Extended structure at this level:`, JSON.stringify(extendedStructure, null, 2));
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
    }
}

async function extractHtmlMetadata(filePath) {
    console.log(`Extracting metadata from: ${filePath}`);
    const content = await fs.readFile(filePath, 'utf-8');
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    const descriptionMatch = content.match(/<meta\s+name="description"\s+content="(.*?)"/i);
    const keywordsMatch = content.match(/<meta\s+name="keywords"\s+content="(.*?)"/i);
    const authorMatch = content.match(/<meta\s+name="author"\s+content="(.*?)"/i);
    const readingTimeMatch = content.match(/<meta\s+name="reading-time"\s+content="(.*?)"/i);
    const imageMatches = [...content.matchAll(/<img\s+[^>]*src="([^"]*)"/gi)];
    const internalLinkMatches = [...content.matchAll(/<a\s+[^>]*href="([^"#][^"]*)"/gi)];
    const externalLinkMatches = [...content.matchAll(/<a\s+[^>]*href="(https?:\/\/[^"]*)"/gi)];

    const metadata = {
        title: titleMatch ? titleMatch[1] : null,
        description: descriptionMatch ? descriptionMatch[1] : null,
        keywords: keywordsMatch ? keywordsMatch[1].split(',').map(keyword => keyword.trim()) : null,
        author: authorMatch ? authorMatch[1] : null,
        readingTime: readingTimeMatch ? readingTimeMatch[1] : null,
        images: imageMatches ? imageMatches.map(match => match[1]) : null,
        internalLinks: internalLinkMatches ? internalLinkMatches.map(match => match[1]) : null,
        externalLinks: externalLinkMatches ? externalLinkMatches.map(match => match[1]) : null
    };

    console.log(`Extracted metadata:`, metadata);
    return metadata;
}

async function createOutputDirectory() {
    try {
        await fs.mkdir(outputDir, { recursive: true });
    } catch (error) {
        console.error('Error creating output directory:', error);
    }
}

async function createCacheDirectory() {
    try {
        // Ensure cache directory exists
        await fs.mkdir(path.join(rootDir, 'cache'), { recursive: true });

        // Ensure imagesJsFile exists
        try {
            await fs.access(imagesJsFile);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(imagesJsFile, 'const images = [];\n');
            } else {
                throw error;
            }
        }

        // Ensure blogsJsFile exists
        try {
            await fs.access(blogsJsFile);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(blogsJsFile, 'const blogPosts = [];\n');
            } else {
                throw error;
            }
        }

        // Ensure catsJsFile exists
        try {
            await fs.access(catsJsFile);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(catsJsFile, 'const cats = [];\n');
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('Error creating cache directory:', error);
    }
}


async function loadPreviousResults() {
    try {
        const data = await fs.readFile(historyFile, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

async function saveCurrentResults() {
    const results = {
        timestamp: new Date().toISOString(),
        brokenLinksCount: brokenLinks.length,
        brokenLinksSummary: summarizeBrokenLinks()
    };
    await fs.writeFile(historyFile, JSON.stringify(results, null, 2));
}

function summarizeBrokenLinks() {
    const summary = {};
    for (const { link } of brokenLinks) {
        const type = getLinkType(link);
        summary[type] = (summary[type] || 0) + 1;
    }
    return summary;
}

function getLinkType(link) {
    if (link.startsWith('#')) return 'Anchor';
    if (link.startsWith('http') || link.startsWith('https')) return 'External';
    return 'Internal';
}

async function generateHTMLReport(previousResults) {
    const summary = summarizeBrokenLinks();
    let fixedLinksCount = 0;
    if (previousResults) {
        fixedLinksCount = previousResults.brokenLinksCount - brokenLinks.length;
    }

    let content = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Broken Links Report</title>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1, h2 { color: #333; }
          ul { list-style-type: none; padding: 0; }
          li { margin-bottom: 10px; }
          a { color: #1a73e8; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .summary { background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
      </style>
  </head>
  <body>
      <h1>Broken Links Report</h1>
      <div class="summary">
          <h2>Summary</h2>
          <p>Total broken links: ${brokenLinks.length}</p>
          ${Object.entries(summary).map(([type, count]) => `<p>${type} links to fix: ${count}</p>`).join('')}
          ${previousResults ? `<p>Links fixed since last run: ${fixedLinksCount}</p>` : ''}
          ${previousResults ? `<p>Last run: ${new Date(previousResults.timestamp).toLocaleString()}</p>` : ''}
      </div>
      <h2>Broken Links Details</h2>
      <ul>
  `;

    for (const { link, sourcePath, lineNumber } of brokenLinks) {
        const relativePath = path.relative(rootDir, sourcePath);
        const vscodeUri = `vscode://file${sourcePath}:${lineNumber}`;
        content += `
          <li>
              Broken link: ${link}<br>
              in file: <a href="${vscodeUri}">${relativePath} (Line ${lineNumber})</a>
          </li>
      `;
    }

    content += `
      </ul>
      <footer>
      <section id="decoration" style="position: relative; margin-top: 200px">
        <p style="position: relative; bottom: 30px; left: 20%">&copy; 2024 Octopus Energy. All rights reserved.</p>
        <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="2 -2 1440 320" class="footer-wave" style="bottom: -20">
          <path
            fill-opacity="1"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </section>
    </footer>
  </body>
  </html>
    `;

    await fs.writeFile(reportFile, content);
}

function generateYAMLContent(structure, indent = 0) {
    let content = '';
    const indentStr = '  '.repeat(indent);

    for (const [key, value] of Object.entries(structure)) {
        const escapedKey = key.includes(':') ? `"${key}"` : key;
        if (value === null) {
            content += `${indentStr}- ${escapedKey}\n`;
        } else if (typeof value === 'object' && !Array.isArray(value)) {
            if (Object.keys(value).length === 0) {
                content += `${indentStr}${escapedKey}: {}\n`;
            } else {
                content += `${indentStr}${escapedKey}:\n`;
                content += generateYAMLContent(value, indent + 1);
            }
        } else {
            content += `${indentStr}${escapedKey}: ${JSON.stringify(value)}\n`;
        }
    }
    return content;
}

async function generateYAMLStructure() {
    console.log('Generating YAML structure...');
    const content = generateYAMLContent(folderStructure);
    console.log(`Writing YAML structure to ${structureFile}`);
    await fs.writeFile(structureFile, content);
}

async function generateExtendedYAMLStructure() {
    console.log('Generating extended YAML structure...');
    const content = generateYAMLContent(extendedFolderStructure);
    console.log(`Writing extended YAML structure to ${extendedStructureFile}`);
    await fs.writeFile(extendedStructureFile, content);
}

async function processHtmlFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');

    // Try to detect domain if not already detected
    if (!detectedDomain) {
        detectedDomain = detectDomain(content);
    }

    const links = extractLinks(content);

    const fileLinks = [];

    for (const link of links) {
        fileLinks.push(link.href);
        if (await isLinkBroken(link.href, filePath)) {
            brokenLinks.push({
                link: link.href,
                sourcePath: filePath,
                lineNumber: link.lineNumber
            });
        }
    }

    const relativePath = path.relative(rootDir, filePath);
    siteMap.set(relativePath, fileLinks);

    // Add this file to the XML sitemap URLs
    const fileUrl = path.join(path.dirname(relativePath), path.basename(relativePath, '.html'));
    xmlUrls.add(fileUrl.replace(/\\/g, '/'));
}

function detectDomain(content) {
    // Try to find base tag
    const baseMatch = content.match(/<base\s+href=["'](https?:\/\/[^"']+)["']/i);
    if (baseMatch) return baseMatch[1];

    // Try to find canonical link
    const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["'](https?:\/\/[^"']+)["']/i);
    if (canonicalMatch) return new URL(canonicalMatch[1]).origin + '/';

    // Try to find Open Graph URL
    const ogUrlMatch = content.match(/<meta\s+property=["']og:url["']\s+content=["'](https?:\/\/[^"']+)["']/i);
    if (ogUrlMatch) return new URL(ogUrlMatch[1]).origin + '/';

    return null;
}

async function generateXMLSitemap() {
    const lastMod = await lastHtmlFileModified();
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const url of xmlUrls) {
        xmlContent += '  <url>\n';
        xmlContent += `    <loc>${detectedDomain}${url}</loc>\n`;
        xmlContent += `    <lastmod>${lastMod}</lastmod>\n`;
        xmlContent += '    <changefreq>weekly</changefreq>\n';
        xmlContent += '    <priority>0.5</priority>\n';
        xmlContent += '  </url>\n';
    }

    xmlContent += '</urlset>';

    await fs.writeFile(xmlSitemapFile, xmlContent);
}

async function lastHtmlFileModified() {
    let latestDate = new Date(0);

    async function checkDirectory(dir) {
        const files = await fs.readdir(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = await fs.stat(filePath);

            if (stat.isDirectory()) {
                await checkDirectory(filePath);
            } else if (path.extname(file).toLowerCase() === '.html') {
                if (stat.mtime > latestDate) {
                    latestDate = stat.mtime;
                }
            }
        }
    }

    await checkDirectory(rootDir);
    return latestDate.toISOString().split('T')[0];
}

function extractLinks(html) {
    const lines = html.split('\n');
    const links = [];
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi;

    for (let i = 0; i < lines.length; i++) {
        let match;
        while ((match = linkRegex.exec(lines[i])) !== null) {
            links.push({ href: match[1], lineNumber: i + 1 });
        }
    }

    return links;
}

async function isLinkBroken(link, sourcePath) {
    try {
        if (link.startsWith('#')) {
            return !(await isValidAnchor(link, sourcePath));
        } else if (link.startsWith('http') || link.startsWith('https')) {
            await checkExternalLink(link);
        } else {
            await checkInternalLink(link, sourcePath);
        }
        return false;
    } catch (error) {
        return true;
    }
}

async function isValidAnchor(anchor, sourcePath) {
    const content = await fs.readFile(sourcePath, 'utf-8');
    const idRegex = new RegExp(`id=["']${anchor.slice(1)}["']`, 'i');
    const nameRegex = new RegExp(`name=["']${anchor.slice(1)}["']`, 'i');
    return idRegex.test(content) || nameRegex.test(content);
}

function checkExternalLink(link) {
    return new Promise((resolve, reject) => {
        const parsedUrl = url.parse(link);
        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        const req = protocol.request(
            {
                hostname: parsedUrl.hostname,
                port: parsedUrl.port,
                path: parsedUrl.path,
                method: 'HEAD',
            },
            (res) => {
                if (res.statusCode >= 400) {
                    reject(new Error(`HTTP status code ${res.statusCode}`));
                } else {
                    resolve();
                }
            }
        );

        req.on('error', reject);
        req.end();
    });
}

async function checkInternalLink(link, sourcePath) {
    const absolutePath = path.resolve(path.dirname(sourcePath), link);
    await fs.access(absolutePath);
}

async function writeSiteMap() {
    let content = '';
    for (const [file, links] of siteMap) {
        content += `File: ${file}\n`;
        content += `Links:\n${links.map(link => `  - ${link}`).join('\n')}\n\n`;
    }

    await fs.writeFile(siteMapFile, content);
}

async function generateImagesJsFile() {
    console.log('Generating images.js file...');
    const images = await fs.readdir(imagesDir);
    const imageFiles = images.filter(file => /\.(png|webp)$/i.test(file));
    const imagePaths = imageFiles.map(file => `/img/${file}`);
    const imagesJsContent = `const images = [\n${imagePaths.map(img => `    "${img}"`).join(',\n')}\n];\n`;
    await fs.writeFile(imagesJsFile, imagesJsContent);
    console.log(`Written ${imagesJsFile}`);
}

async function generateBlogsJsFile() {
    console.log('Generating blogs.js file...');
    const blogEntries = [];

    async function processDirectory(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const name = entry.name;
            const filePath = path.join(dir, name);

            if (entry.isDirectory()) {
                await processDirectory(filePath);
            } else if (path.extname(name).toLowerCase() === '.html' && name.toLowerCase() !== 'index.html') {
                const relativePath = path.relative(rootDir, filePath);
                const metadata = await extractHtmlMetadata(filePath);
                const blogEntry = {
                    title: metadata.title,
                    url: `/${relativePath.replace(/\\/g, '/')}`,
                    description: metadata.description,
                    author: metadata.author,
                    readingTime: metadata.readingTime,
                    excerpt: metadata.description ? metadata.description.substring(0, 150) : '',
                    img: metadata.images ? metadata.images[0] : ''
                };
                blogEntries.push(blogEntry);
            }
        }

        // Generate index.html for the current directory
        const relativeDir = path.relative(rootDir, dir).replace(/\\/g, '/');
        const directoryName = relativeDir.split('/').pop() || 'Our Blog';
        const blogEntriesInDir = blogEntries.filter(entry => entry.url.startsWith(`/${relativeDir}/`) && !entry.url.endsWith('index.html'));
        if (blogEntriesInDir.length > 0) {
            await generateCategoriesIndexHtml(relativeDir, directoryName, blogEntriesInDir);
        }
    }

    await processDirectory(blogsDir);

    const blogsJsContent = `const blogPosts = [\n${blogEntries.map(blog => `    ${JSON.stringify(blog)}`).join(',\n')}\n];\n`;
    await fs.writeFile(blogsJsFile, blogsJsContent);
    console.log(`Written ${blogsJsFile}`);
}


async function generateBlogHtml() {
    console.log('Generating blog_test.html...');
    const blogsJsContent = await fs.readFile(blogsJsFile, 'utf-8');
    const blogPosts = JSON.parse(blogsJsContent.replace('const blogPosts = ', '').replace(';', ''));
    const blogEntriesHtml = blogPosts.map(post => `
        <article class="blog-entry">
            <a href="${post.url}" >
                <img src="${post.img}" alt="${post.title}" >
            </a>
            <div class="content">
                <a href="${post.url}" ><h2 class="p-name">${post.title}</h2></a>
                <div class="meta author">
                    <span class="p-author h-card">by ${post.author}</span> | <span>${post.readingTime}</span>
                </div>
                <p>${post.excerpt}</p>
                <a href="${post.url}" ><button>Read more...</button></a>
            </div>
        </article>
    `).join('');

    const content = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <title>Marketing Company - Blog</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400..900&family=Oswald:wght@200..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <link href="/styles.css" type="text/css" rel="stylesheet" />
    <script defer src="/cache/blogs.js"></script>
  </head>
  <body style="position: relative">
    <header class="container">
      <div>
        <nav>
          <ul>
            <li>
              <i class="fa-brands fa-octopus-deploy"></i> <a href="https://octopus.energy"> <span style="font-weight: 700">octopus</span>energy</a>
            </li>
          </ul>
          <ul class="screen">
            <li><a href="#services">Services</a></li>
            <li><a href="/blog/">Blog</a></li>
          </ul>
        </nav>
      </div>
    </header>
    <main class="container">
      <section id="blog-list">
        <div class="header">
          <h1>Our Blog</h1>
          <p>Explore our latest articles and insights on marketing, lead generation, and business growth.</p>
        </div>
        <div class="blog-entries">
          ${blogEntriesHtml}
        </div>
      </section>
    </main>
    <footer>
    </footer>
    <section id="decoration" style="position: relative; margin-top: 200px">
      <p style="position: relative; bottom: 10px; left: 20%; width:250px;">&copy; 2024 Octopus Energy. All rights reserved.</p>
      <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="2 -2 1440 320" class="footer-wave" style="bottom: -20">
        <path
          fill-opacity="1"
          d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </section>
  </body>
</html>
    `;
    await fs.writeFile(blogTestFile, content);
    console.log(`Written ${blogTestFile}`);
}

async function generateBlogsJsFile() {
    console.log('Generating blogs.js file...');
    const blogEntries = [];

    async function processDirectory(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const name = entry.name;
            const filePath = path.join(dir, name);

            if (entry.isDirectory()) {
                await processDirectory(filePath);
            } else if (path.extname(name).toLowerCase() === '.html' && name.toLowerCase() !== 'index.html') {
                const relativePath = path.relative(rootDir, filePath);
                const metadata = await extractHtmlMetadata(filePath);
                const blogEntry = {
                    title: metadata.title,
                    url: `/${relativePath.replace(/\\/g, '/')}`,
                    description: metadata.description,
                    author: metadata.author,
                    readingTime: metadata.readingTime,
                    excerpt: metadata.description ? metadata.description.substring(0, 150) : '',
                    img: metadata.images ? metadata.images[0] : ''
                };
                blogEntries.push(blogEntry);
            }
        }

        // Generate index.html for the current directory
        const relativeDir = path.relative(rootDir, dir).replace(/\\/g, '/');
        const directoryName = relativeDir.split('/').pop() || 'Our Blog';
        const blogEntriesInDir = blogEntries.filter(entry => entry.url.startsWith(`/${relativeDir}/`) && !entry.url.endsWith('index.html'));
        if (blogEntriesInDir.length > 0) {
            await generateCategoriesIndexHtml(relativeDir, directoryName, blogEntriesInDir);
        }
    }

    await processDirectory(blogsDir);

    const filteredBlogEntries = blogEntries.filter(blog => !blog.url.endsWith('index.html'));

    const blogsJsContent = `const blogPosts = [\n${filteredBlogEntries.map(blog => `    ${JSON.stringify(blog)}`).join(',\n')}\n];\n`;
    await fs.writeFile(blogsJsFile, blogsJsContent);
    console.log(`Written ${blogsJsFile}`);
}

async function generateCategoriesIndexHtml(relativeDir, directoryName, blogEntries) {
    const blogEntriesHtml = blogEntries.map(post => `
        <article class="blog-entry">
            <a href="${post.url}" >
                <img src="${post.img}" alt="${post.title}" >
            </a>
            <div class="content">
                <a href="${post.url}" ><h2 class="p-name">${post.title}</h2></a>
                <div class="meta author">
                  <span style="text-transform: capitalize;">
                  ${post.url.split('/').slice(0, -1).map((dir, index, arr) => index === arr.length - 1 ? `<a href="${arr.slice(0, index + 1).join('/') || '/'}">${dir}</a>` : '').filter(Boolean).join('')} 
                  </span> | <span class="p-author h-card">by ${post.author}</span> | <span>${post.readingTime}</span>
                </div>
                <p>${post.excerpt}</p>
                <a href="${post.url}" ><button>Read more...</button></a>
            </div>
        </article>
    `).join('');

    const content = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <title>${directoryName} - Blog</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400..900&family=Oswald:wght@200..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <link href="/styles.css" type="text/css" rel="stylesheet" />
    <script defer src="/cache/blogs.js"></script>
  </head>
  <body style="position: relative">
    <header class="container">
      <div>
        <nav>
          <ul>
            <li>
              <i class="fa-brands fa-octopus-deploy"></i> <a href="https://octopus.energy"> <span style="font-weight: 700">octopus</span>energy</a>
            </li>
          </ul>
          <ul class="screen">
            <li><a href="#services">Services</a></li>
            <li><a href="/blog/">Blog</a></li>
          </ul>
        </nav>
      </div>
    </header>
    <main class="container">
      <section id="blog-list">
        <div class="header" style="text-transform: uppercase;">
          <a href="${'/' + relativeDir.split('/').slice(0, -1).join('/') || '· /'}" class="previous-article">
            <button><i class="fa fa-arrow-left" aria-hidden="true"></i></button>
        </a>
        <div style="display: flex; align-items: center; gap: 20px;justify-content: center;">
            <p>${
        // directories before the current one
        relativeDir.split('/').slice(0, -1).map((dir, index) => `<a href="${'/' + relativeDir.split('/').slice(0, index + 1).join('/') || '/'}">${dir}</a>`).join(' / ') || ''
        }</p> / <h1>${directoryName}</h1>
          </div>
        </div>
        <div class="blog-entries">
          ${blogEntriesHtml}
        </div>
      </section>
    </main>
    <footer>
      
    </footer>
    <section id="decoration" style="position: relative; margin-top: 200px">
      <p style="position: relative; bottom: 10px; left: 20%; width:250px;">&copy; 2024 Octopus Energy. All rights reserved.</p>
      <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="2 -2 1440 320" class="footer-wave" style="bottom: -20">
        <path
          fill-opacity="1"
          d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </section>
  </body>
</html>
    `;
    const outputDir = path.join(rootDir, relativeDir);
    await fs.writeFile(path.join(outputDir, 'index.html'), content);
    console.log(`Written ${path.join(outputDir, 'index.html')}`);
}

async function generateCatsJsFile() {
    console.log('Generating cats.js file...');
    const categories = [];

    async function processDirectory(dir, parentDir = null) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        // Read blogPosts data from blogs.js
        const blogsJsContent = await fs.readFile(blogsJsFile, 'utf-8');
        const blogPosts = JSON.parse(blogsJsContent.replace('const blogPosts = ', '').replace(';', ''));

        for (const entry of entries) {
            const name = entry.name;
            const filePath = path.join(dir, name);

            if (entry.isDirectory()) {
                const category = {
                    title: name,
                    longTitle: null,
                    parent: parentDir ? path.basename(parentDir) : 'blog',
                    url: `/${path.relative(rootDir, filePath).replace(/\\/g, '/')}`,
                    image: null,
                    description: null,
                    blogs: blogPosts.filter(post => post.url.startsWith(`/${path.relative(rootDir, filePath).replace(/\\/g, '/')}/`)),


                };

                const imageEntries = await fs.readdir(filePath);
                const imageFile = imageEntries.find(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
                if (imageFile) {
                    category.image = `${category.url}/${imageFile}`;
                }

                categories.push(category);
                await processDirectory(filePath, filePath);
            }
        }
    }

    await processDirectory(blogsDir);

    const catsJsContent = `const cats = [\n${categories.map(cat => `    ${JSON.stringify(cat)}`).join(',\n')}\n];\n`;
    await fs.writeFile(catsJsFile, catsJsContent);
    console.log(`Written ${catsJsFile}`);
}

async function generateBlogsIndexHtml() {
    // Read blogPosts data from blogs.js
    const blogsJsContent = await fs.readFile(blogsJsFile, 'utf-8');
    const blogPosts = JSON.parse(blogsJsContent.replace('const blogPosts = ', '').replace(';', ''));

    // Read cats data from cats.js
    const catsJsContent = await fs.readFile(catsJsFile, 'utf-8');
    const cats = JSON.parse(catsJsContent.replace('const cats = ', '').replace(';', ''));

    const content = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <title>Blog - Marketing Company</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
    <link
      href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400..900&family=Oswald:wght@200..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
      rel="stylesheet"
    />
    <link href="/styles.css" type="text/css" rel="stylesheet" />
    <script defer src="/cache/cats.js"></script>
    <script defer src="/cache/blogs.js"></script>
    <script defer src="/js/blog-search.js"></script>
  </head>
  <body>
    <header class="container">
      <div>
        <nav>
          <ul>
            <li>
              <i class="fa-brands fa-octopus-deploy"></i> <a href="https://octopus.energy"><span style="font-weight: 700">octopus</span>energy</a>
            </li>
          </ul>
          <ul class="screen">
            <li><a href="#services">Services</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <main class="container">
        
        <section class="search-bar header">
        
          <h1>BLOG</h1>
          <p style="margin: 0  0 40px 0;">Explore our latest articles and insights on marketing, lead generation, and business growth.</p>
          
        <input type="text" id="searchInput" placeholder="Search posts..." oninput="searchPosts()" />
      <section id="searchResults"></section>
      </section>
      

      <section id="categories">
      <div style="width:full">
      <h3 style="text-align: center;">CATEGORIES</h3>
      </div>
        <div class="grid">
          ${
        // only show categories with blog posts
        cats
            .filter(cat => cat.blogs.length > 0)
            .map(cat => `
            <article style="display:flex;flex-direction:column; align-items:center;text-align: center;">
            <a href="${cat.url}" style="display:flex; align-items:center; gap: 15px;">
             
            <img class="cat-img"  src="${cat.image}" width="100" alt="${cat.title}" />
              <button style="color: gray; text-transform:uppercase;">${cat.blogs.length} <span style="font-size:.8rem;text-transform:lowercase;">posts in</span> ${cat.title}</button>
            </a>
            </article>
          `).join('')}
        </div>
      </section>
    </main>

    <footer class="container" id="contact">
      </footer>
      <section id="decoration" style="position: relative; margin-top: 100px;">
        <p style="position: relative ; bottom:30px; left: 25%; width:250px;">&copy; 2024 Octopus Energy. All rights reserved.</p>
        <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="2 -2 1440 320" class="footer-wave" style="  bottom:-20;">
          <path
            fill-opacity="1"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </section>
  </body>
</html>
    `;
    const outputDir = path.join(blogsDir, 'index.html');
    await fs.writeFile(outputDir, content);
    console.log(`Written ${outputDir}`);
}

analyzeWebsite();

