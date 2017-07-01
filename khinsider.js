#!/usr/bin/env node

const prog = require('caporal')
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

const getTrackList = async (url) => {
  const saveDirectory = `${process.env['HOME']}/Downloads/${url}`
  const album = []
  try {
    const list = await axios.get(`https://downloads.khinsider.com/game-soundtracks/album/${url}`)
    const $ = cheerio.load(list.data)
    $('#EchoTopic table tbody td a')
      .not(function(i, elem) {
        return $(this).text() === 'Download'
      })
      .each(function(i, elem) {
        const title = $(this).text()
        const link = $(this).attr('href')
        let track = (i + 1).toString()

        if (track.length === 1) { track = `0${track}` }

        album.push({ title, link, track })
      })
  } catch (e) {
    console.error(e)
  }

  fs.mkdirSync(saveDirectory)

  handleDownload(album, saveDirectory)
}

const fetchDownloadLink = async (url) => {
  const page = await axios.get(url)
  const $ = cheerio.load(page.data)
  return $('audio').attr('src')
}

const handleDownload = async (album, saveDirectory) => {
  for (song of album) {
    try {
      console.log(`Downloading ${song.track}/${album.length} - ${song.title}...`)
      song.url = await fetchDownloadLink(song.link)
      const file = await axios({ method: 'GET', url: song.url, responseType: 'stream' })
      file.data.pipe(fs.createWriteStream(`${saveDirectory}/${song.title}`))
    } catch (e) {
      console.error(e)
    }
  }
}

prog
  .version('1.0.0')

  .command('download', 'Download an OST from KHInsider')
  .argument('<link>', 'The segment after /album/ in the OST URL')
  .action((args, options) => {
    getTrackList(args.link)
  })

prog.parse(process.argv)