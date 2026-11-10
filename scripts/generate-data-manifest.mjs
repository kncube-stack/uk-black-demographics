import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PUBLIC_API_DIR = path.join(process.cwd(), 'public', 'api');
const PUBLIC_DATA_DIR = path.join(process.cwd(), 'public', 'data');

async function findJsonFilesRecursive(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findJsonFilesRecursive(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith('.json') && !entry.name.startsWith('_')) {
      files.push(fullPath);
    }
  }
  return files.sort();
}

async function generateManifest() {
  const manifest = { version: '1.0', generatedAt: new Date().toISOString(), datasets: [] };
  const filesToPublish = [];
  const ids = new Set();

  // Publish only public aggregate datasets, never other data-directory content.
  for (const dir of ['fetched', 'manual']) {
    const files = await findJsonFilesRecursive(path.join(DATA_DIR, dir));
    for (const file of files) {
      const content = await fs.readFile(file);
      const dataset = JSON.parse(content.toString('utf8'));
      if (!dataset.id || !dataset.metadata) throw new Error(`Invalid dataset: ${file}`);
      if (ids.has(dataset.id)) throw new Error(`Duplicate dataset ID: ${dataset.id}`);
      ids.add(dataset.id);
      const relativePath = path.relative(DATA_DIR, file);
      manifest.datasets.push({
        id: dataset.id,
        name: dataset.metadata.name,
        publisher: dataset.metadata.publisher,
        category: dataset.siteCategory,
        subcategory: dataset.siteSubcategory,
        url: dataset.metadata.url,
        rawPath: `/data/${relativePath.split(path.sep).join('/')}`,
      });
      filesToPublish.push({ relativePath, content });
    }
  }

  // This directory contains only generated copies; rebuilding removes stale assets.
  await fs.rm(PUBLIC_DATA_DIR, { recursive: true, force: true });
  for (const { relativePath, content } of filesToPublish) {
    const destination = path.join(PUBLIC_DATA_DIR, relativePath);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, content);
  }
  await fs.mkdir(PUBLIC_API_DIR, { recursive: true });
  await fs.writeFile(path.join(PUBLIC_API_DIR, 'datasets.json'), JSON.stringify(manifest, null, 2));
  console.log(`Published ${manifest.datasets.length} datasets and their manifest.`);
}

generateManifest().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
