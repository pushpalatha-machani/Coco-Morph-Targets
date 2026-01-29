import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/lib/server/data/faceSettings.json');

export function readFaceSettings(): Record<string, number> 
{
  if (!fs.existsSync(filePath)) 
  {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export function writeFaceSettings(settings: Record<string, number>) 
{
  fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
}








