const axios = require('axios')
const cheerio = require('cheerio')

const fetchDownloadLink = async (url) => {
  try {
    const page = await axios.get(url)
    const $ = cheerio.load(page.data)
    return $('audio').attr('src')
  } catch (e) {
    console.error('Error fetching song link', e)
  }
}

module.exports = fetchDownloadLink