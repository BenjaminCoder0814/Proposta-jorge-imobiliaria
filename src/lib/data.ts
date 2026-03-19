import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

export function readData<T>(filename: string): T[] {
  ensureDataDir()
  const filepath = path.join(dataDir, `${filename}.json`)
  if (!fs.existsSync(filepath)) return []
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf-8')) as T[]
  } catch {
    return []
  }
}

export function writeData<T>(filename: string, data: T[]): void {
  ensureDataDir()
  const filepath = path.join(dataDir, `${filename}.json`)
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8')
}
