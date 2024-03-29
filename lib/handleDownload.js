const axios = require('axios')
const fs = require('fs')
const fetchLink = require('./fetchLink')

const handleDownload = async (album, saveDirectory) => {
  for (song of album) {
    try {
      song.track = (song.track + 1).toString()
      
      if (song.track.toString().length === 1) { song.track = `0${song.track}` }
      
      console.log(`Downloading ${song.track}/${album.length} - ${song.title}...`)
      song.url = await fetchLink(song.link)
      const file = await axios({ method: 'GET', url: song.url, responseType: 'stream' })
      file.data.pipe(fs.createWriteStream(`${saveDirectory}/${song.title}`))
    } catch (e) {
      console.error('Error downloading album', e)
    }
  }
}

module.exports = handleDownload