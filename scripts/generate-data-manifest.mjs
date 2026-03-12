import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PUBLIC_API_DIR = path.join(process.cwd(), 'public', 'api');

async function findJsonFilesRecursive(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findJsonFilesRecursive(fullPath)));
    } else if (entry.name.endsWith('.json') && !entry.name.startsWith('_')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function generateManifest() {
  console.log('🚀 Generating data manifest...');

  const manifest = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    datasets: [],
  };

  const scanDirs = ['fetched', 'manual'];

  for (const dir of scanDirs) {
    const basePath = path.join(DATA_DIR, dir);
    if (!(await fs.stat(basePath).catch(() => null))) continue;

    const files = await findJsonFilesRecursive(basePath);

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      try {
        const dataset = JSON.parse(content);
        if (dataset.id && dataset.metadata) {
          manifest.datasets.push({
            id: dataset.id,
            name: dataset.metadata.name,
            publisher: dataset.metadata.publisher,
            category: dataset.siteCategory,
            subcategory: dataset.siteSubcategory,
            url: dataset.metadata.url,
            rawPath: `/data/${path.relative(DATA_DIR, file)}`,
          });
        }
      } catch (e) {
        console.warn(`⚠️ Skipping invalid JSON: ${file}`);
      }
    }
  }

  // Ensure public/api exists
  await fs.mkdir(PUBLIC_API_DIR, { recursive: true });

  await fs.writeFile(
    path.join(PUBLIC_API_DIR, 'datasets.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`✅ Manifest generated with ${manifest.datasets.length} datasets.`);
}

generateManifest().catch(console.error);
