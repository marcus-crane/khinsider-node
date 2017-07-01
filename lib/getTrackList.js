const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const handleDownload = require('./handleDownload')

const getTrackList = async (url) => {
  try {
    const saveDirectory = `${process.env['HOME']}/Downloads/${url}`
    const album = []

    if (fs.existsSync(saveDirectory)) { throw 'Folder already exists! Rename it or delete it.' }

    const list = await axios.get(`https://downloads.khinsider.com/game-soundtracks/album/${url}`)
    const $ = cheerio.load(list.data)
    $('#EchoTopic table')
      .eq(0)
      .find('tbody td a')
      .not(function(i, elem) {
        return $(this).text() === 'Download'
      })
      .each(function(i, elem) {
        const title = $(this).text()
        const link = $(this).attr('href')
        let track = (i + 1).toString()

        if (track.length === 1) { track = `0${track}` }

        album.push({ track, title, link })
      })

      fs.mkdirSync(saveDirectory)
      handleDownload(album, saveDirectory)
  } catch (e) {
    console.error(e)
  }
}

module.exports = getTrackList