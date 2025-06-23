import fs from 'fs';

interface ValidationResult {
  file: string;
  invalidUrls: Array<{
    url: string;
    line: number;
    reason: string;
  }>;
}

async function validateUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; URLValidator/1.0)'
      }
    });
    return response.ok;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch failed')) {
      console.warn(`Warning: Could not fetch ${url} - Network error`);
    }
    return false;
  }
}

function extractUrlsFromMarkdown(content: string): Array<{ url: string; line: number }> {
  const urlRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const urls: Array<{ url: string; line: number }> = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    let match;
    while ((match = urlRegex.exec(line)) !== null) {
      urls.push({
        url: match[2],
        line: index + 1,
      });
    }
  });

  return urls;
}

async function validateMarkdownFile(filePath: string): Promise<ValidationResult> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const urls = extractUrlsFromMarkdown(content);
  const invalidUrls = [];

  for (const { url, line } of urls) {
    const isValid = await validateUrl(url);
    if (!isValid) {
      invalidUrls.push({
        url,
        line,
        reason: 'URL is not accessible',
      });
    }
  }

  return {
    file: filePath,
    invalidUrls,
  };
}

async function main() {
  const markdownFiles = process.argv.slice(2);

  if (markdownFiles.length === 0) {
    console.error('Please provide at least one markdown file path');
    process.exit(1);
  }

  for (const file of markdownFiles) {
    try {
      const result = await validateMarkdownFile(file);
      if (result.invalidUrls.length > 0) {
        console.log(`\nInvalid URLs found in ${result.file}:`);
        result.invalidUrls.forEach(({ url, line, reason }) => {
          console.log(`  Line ${line}: ${url} - ${reason}`);
        });
      } else {
        console.log(`\nAll URLs in ${result.file} are valid!`);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
}

main().catch(console.error); 