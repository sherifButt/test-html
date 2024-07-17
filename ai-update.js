const fs = require('fs');
const path = require('path');
const readline = require('readline');
const https = require('https');

// OpenAI API integration
async function callOpenAI(prompt) {
    const data = JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.7
    });

    const options = {
        hostname: 'api.openai.com',
        path: '/v1/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(data);
        req.end();
    });
}

// Groq API integration
async function callGroq(prompt) {
    const data = JSON.stringify({
        query: prompt,
    });

    const options = {
        hostname: 'api.groq.com',
        path: '/v1/query',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(data);
        req.end();
    });
}

// Utility function to parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        type: null,
        dir: '.',
        verbose: false,
        silence: false,
        help: false,
        copy: '_ai',
        force: false,
        sysPrompt: 'Translate the following content:',
        api: 'openai',
        file: null
    };
    let prompt = '';

    args.forEach((arg, index) => {
        if (arg === '-type') {
            options.type = args[index + 1];
        } else if (arg === '-dir') {
            options.dir = args[index + 1];
        } else if (arg === '-ver') {
            options.verbose = true;
        } else if (arg === '-sil') {
            options.silence = true;
        } else if (arg === '-?' || arg === '-help' || arg === '-h') {
            options.help = true;
        } else if (arg === '-copy') {
            options.copy = args[index + 1];
        } else if (arg === '-f') {
            options.force = true;
        } else if (arg === '-sys') {
            options.sysPrompt = args[index + 1];
        } else if (arg === '-ai') {
            options.api = args[index + 1].toLowerCase();
        } else if (arg === '-file') {
            options.file = args[index + 1];
        } else {
            prompt += `${arg} `;
        }
    });

    return { options, prompt: prompt.trim() };
}

// Recursive function to traverse directories
function traverseDirectory(dir, callback) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error(`Unable to scan directory: ${err}`);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(dir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error(`Unable to stat file: ${err}`);
                    return;
                }

                if (stats.isDirectory()) {
                    traverseDirectory(filePath, callback);
                } else {
                    callback(filePath);
                }
            });
        });
    });
}

// Function to copy directories recursively without infinite loop
function copyDirectory(src, dest) {
    if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
    }

    fs.mkdirSync(dest, { recursive: true });

    fs.readdirSync(src).forEach((file) => {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);

        if (fs.lstatSync(srcFile).isDirectory()) {
            if (destFile.startsWith(src)) {
                console.error("Error: Infinite copy detected. Skipping directory.");
            } else {
                copyDirectory(srcFile, destFile);
            }
        } else {
            fs.copyFileSync(srcFile, destFile);
        }
    });
}

// Function to process files
async function processFile(filePath, sysPrompt, prompt, verbose, silence, api) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const newPrompt = `${sysPrompt}\n${prompt}\n${fileContent}`;
    
    if (verbose) {
        console.log(`Processing file: ${filePath}`);
    }

    let llmResponse;
    try {
        if (api === 'openai') {
            llmResponse = await callOpenAI(newPrompt);
        } else if (api === 'groq') {
            llmResponse = await callGroq(newPrompt);
        } else {
            console.error(`Unsupported API: ${api}`);
            return;
        }
    } catch (error) {
        console.error(`Error calling ${api} API: ${error.message}`);
        return;
    }

    const responseText = llmResponse.choices ? llmResponse.choices[0].text : llmResponse.result;

    const codeMatch = responseText.match(/```html([\s\S]*?)```/);
    if (codeMatch) {
        const newCode = codeMatch[1].trim();
        fs.writeFileSync(filePath, newCode, 'utf-8');
        if (verbose) {
            console.log(`Updated file: ${filePath}`);
        }
    }

    if (silence) {
        process.stdout.write('.');
    }
}

// Main function
async function main() {
    const { options, prompt } = parseArgs();

    if (options.help) {
        console.log('Usage: node ai-exec.js -type "html"');
        console.log('Flags:');
        console.log('  -type "type"   : Specify file type (html, text, jpg, etc.)');
        console.log('  -dir "folder"  : Specify directory to process');
        console.log('  -ver           : Verbose mode');
        console.log('  -sil           : Silence mode');
        console.log('  -copy "name"   : Specify name for the copied directory');
        console.log('  -f             : Force overwrite the original folder content');
        console.log('  -sys "prompt"  : Specify a system prompt');
        console.log('  -ai "api"      : Specify which API to use (openai, groq)');
        console.log('  -file "path"   : Specify a particular file to process');
        console.log('  -? or -help or -h : Show help');
        console.log('\nExamples:');
        console.log('  1. Process all HTML files in a directory using OpenAI API:');
        console.log('     node ai-exec.js -type "html" -dir "./src" -sys "Translate this"');
        console.log('  2. Process a specific file using Groq API:');
        console.log('     node ai-exec.js -file "./test/src/filename.html" -ai "groq"');
        console.log('  3. Copy a directory and process all text files in silence mode:');
        console.log('     node ai-exec.js -type "text" -dir "./docs" -copy "docs_backup" -sil');
        return;
    }

    const srcDir = options.dir;
    const destDir = options.dir === '.' ? '_ai' : `${srcDir}_ai`;

    // Copy the directory
    if (!options.file) {
        copyDirectory(srcDir, destDir);
        console.log(`Directory copied to ${destDir}`);
    }

    let fileCount = 0;
    let totalSize = 0;

    // Collect files
    const filesToProcess = [];
    if (options.file) {
        filesToProcess.push(options.file);
        const stats = fs.statSync(options.file);
        totalSize += stats.size;
    } else {
        traverseDirectory(destDir, (filePath) => {
            if (!options.type || filePath.endsWith(options.type)) {
                const stats = fs.statSync(filePath);
                totalSize += stats.size;
                filesToProcess.push(filePath);
            }
        });
    }

    fileCount = filesToProcess.length;
    console.log(`Found ${fileCount} files to process. Total size: ${totalSize} bytes.`);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('Do you want to proceed? (yes/no) ', async (answer) => {
        if (answer.toLowerCase() !== 'yes') {
            rl.close();
            return;
        }

        rl.close();

        if (options.silence) {
            console.log(`Processing ${filesToProcess.length} files...`);
        }

        for (let i = 0; i < filesToProcess.length; i++) {
            await processFile(filesToProcess[i], options.sysPrompt, prompt, options.verbose, options.silence, options.api);

            if (options.silence) {
                process.stdout.write(`${i + 1}/${filesToProcess.length} `);
            }

            // Implement cool-off period handling if necessary
            if ((i + 1) % 5 === 0) {
                console.log('Applying cool-off period...');
                await new Promise((resolve) => setTimeout(resolve, 20000)); // 20 seconds cool-off
            }
        }

        console.log('Processing complete.');
    });
}

main();
