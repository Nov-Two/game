import fs from 'fs'
import path from 'path'
const __dirname = path.resolve('./mock/lang/')
const files = fs.readdirSync(__dirname)
const LangMap = {}

files.forEach((item) => {
  if (item.indexOf('.json') > -1) {
    const name = item.split('.json')[0]
    LangMap[name] = {
      ...JSON.parse(fs.readFileSync(path.join(__dirname, item)))
    }
  }
})

export default LangMap
