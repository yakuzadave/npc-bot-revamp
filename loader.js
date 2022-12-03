
import { URL } from 'url';
import { readFile } from 'fs/promises';

function isAllowedURL(url) {
  return ['.html', '.htm', '.md', '.css', '.svg', '.json'].some(x => {
    return url.endsWith(x);
  });
}

export async function load(url, context, defaultLoad) {
  if (!isAllowedURL(url)) {
    return defaultLoad(url, context, defaultLoad);
  }

  const content = (await readFile(new URL(url))).toString();
  const js = url.endsWith('.js') ? content : JSON.stringify(content)

  return {
    format: 'module',
    source: `export default ${js};`,
    //source: `export default ${json};`,
    shortCircuit: true,
  };
}