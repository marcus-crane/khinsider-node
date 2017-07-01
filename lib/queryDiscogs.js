const axios = require('axios')
const fs = require('fs')
const Discogs = require('disconnect').Client
const db = new Discogs({ userToken: process.env.DISCOGS_TOKEN }).database()
const fetchLink = require('./fetchLink')

const queryDiscogs = async (album, id) => {
  const data = await db.getRelease(id)
  
  const saveDirectory = `${process.env['HOME']}/Downloads/${data.title}`
  if (fs.existsSync(saveDirectory)) {
    throw 'Folder already exists! Rename it or delete it.'
  } else {
    fs.mkdirSync(saveDirectory)
  }

  for (song of album) {
    try {
      let title = data.tracklist[song.track].title
      song.track = song.track + 1
      console.log(`Downloading ${song.track}/${album.length} - ${title}`)
      song.url = await fetchLink(song.link)
      if (song.track.toString().length === 1) { song.track = `0${song.track}`}
      const file = await axios({ method: 'GET', url: song.url, responseType: 'stream' })
      file.data.pipe(fs.createWriteStream(`${saveDirectory}/${song.track} ${title}.mp3`))
  } catch (e) {
      console.error('Error downloading album', e)
    }
  }
}

module.exports = queryDiscogs