const axios = require('axios')
require('dotenv').config({ path: '/Users/Marcus/Code/Node/khinsider/.env' })
const fs = require('fs')
const nodeID3 = require('node-id3')
const Discogs = require('disconnect').Client
const db = new Discogs({ userToken: process.env.DISCOGS_TOKEN }).database()

const writeTags = async (id) => {
  try {
    const data = await db.getRelease(id)
    const saveDirectory = `${process.env['HOME']}/Downloads/${data.title}`
    const file = await axios({ method: 'GET', url: data.images[0]['resource_url'], responseType: 'stream' })
    file.data.pipe(fs.createWriteStream(`${saveDirectory}/cover.jpg`))
    
    const album = fs.readdirSync(saveDirectory)
    album.pop()
    for (song of album) {
      let index = album.indexOf(song)
      let title = data.tracklist[index].title

      const tags = {
        title,
        album: data.title,
        image: `${saveDirectory}/cover.jpg`
      }

      const success = nodeID3.write(tags, `${saveDirectory}/${song}`)
      console.log('written', success)

      const read = nodeID3.read(`${saveDirectory}/${song}`)
      console.log(read)
    }
  } catch (e) {
    console.error(e)
  }
}
    // const songBuffer = fs.readFileSync(`${saveDirectory}/${song.track} ${title}.mp3`)
    // const coverBuffer = await axios.get(data.images[0]['resource_url'])

    // const writer = new ID3Writer(songBuffer)

    // writer.setFrame('TIT2', title)
    //       .setFrame('TALB', data.title)
    //       .setFrame('TRCK', song.track)
    //       .setFrame('TYER', data.released)
    //       .setFrame('APIC', {
    //         type: 3,
    //         data: coverBuffer,
    //         description: 'Album Cover'
    //       })
    // writer.addTag()

    // const taggedSongBuffer = Buffer.from(writer.arrayBuffer)
    // fs.writeFileSync(`${saveDirectory}/${song.track} ${title}.mp3`)
  // }

  // for (song of album) {
  //   try {
  //     let title = data.tracklist[song.track].title
  //     song.track = song.track + 1
  //     console.log(`Downloading ${song.track}/${album.length} - ${title}`)
  //     song.url = await fetchLink(song.link)
  //     if (song.track.toString().length === 1) { song.track = `0${song.track}`}
  //     const file = await axios({ method: 'GET', url: song.url, responseType: 'stream' })
  //     file.data.pipe(fs.createWriteStream(`${saveDirectory}/${song.track} ${title}.mp3`))

      // const songBuffer = fs.readFileSync(`${saveDirectory}/${song.track} ${title}.mp3`)
      // const coverBuffer = await axios.get(data.images[0]['resource_url'])

      // const writer = new ID3Writer(songBuffer)

      // writer.setFrame('TIT2', title)
      //       .setFrame('TALB', data.title)
      //       .setFrame('TRCK', song.track)
      //       .setFrame('TYER', data.released)
      //       .setFrame('APIC', {
      //         type: 3,
      //         data: coverBuffer,
      //         description: 'Album Cover'
      //       })
      // writer.addTag()

      
      
  // } catch (e) {
  //     console.error('Error downloading album', e)
  //   }
  // }
// }

module.exports = writeTags