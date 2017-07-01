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

        album.push({ title, link })
      })
  } catch (e) {
    console.error(e)
  }

  fs.mkdirSync(saveDirectory)

  for (let song of album) {
    handleDownload(song)
  }
}

const handleDownload = (track) => {
  console.log(`Downloading ${track.title}...`)
  axios({
    method: 'GET',
    url: track.link,
    responseType: 'stream'
  })
  .then((file) => {
    file.data.pipe(fs.createWriteStream(`${saveDirectory}/${track.title}`))
  })
  .catch((err) => {
    console.error(err)
  })
}

if (!process.argv[2]) {
  return console.error('Enter a URL')
}

getTrackList('https://downloads.khinsider.com/game-soundtracks/album/' + process.argv[2])