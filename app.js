const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

const saveDirectory = `${process.env['HOME']}/Downloads/${process.argv[2]}`

const getTrackList = async (url) => {
  let album = []
  try {
    const list = await axios.get(url)
    const $ = cheerio.load(list.data)
    $('#EchoTopic table tbody td a')
      .not(function(i, elem) {
        return $(this).text() === 'Download'
      })
      .each(function(i, elem) {
        let title = $(this).text()
        let link = $(this).attr('href')
        let track = (i + 1).toString()

        if (track.length === 1) { track = `0${track}` }

        album.push({ title, link, track })
      })
  } catch (e) {
    console.error(e)
  }

  fs.mkdirSync(saveDirectory)

  handleDownload(album)
}

const handleDownload = (album) => {
  for (song of album) {
    console.log(`Downloading ${song.track}/${album.length} - ${song.title}...`)
    axios({
      method: 'GET',
      url: song.link,
      responseType: 'stream'
    })
    .then((file) => {
      file.data.pipe(fs.createWriteStream(`${saveDirectory}/${song.title}`))
    })
    .catch((err) => {
      console.error(err)
    })
  }
}

if (!process.argv[2]) {
  return console.error('Enter a URL')
}

getTrackList('https://downloads.khinsider.com/game-soundtracks/album/' + process.argv[2])