#!/usr/bin/env node
const prog = require('caporal')
const getTrackList = require('./lib/getTrackList')
const writeTags = require('./lib/writeTags')

prog
  .version('1.0.0')

  .command('download', 'Download an OST from KHInsider')
  .argument('<link>', 'The segment after /album/ in the OST URL')
  .option('--id <id>', 'Fetch track names from Discogs using album ID')
  .action((args, options) => {
    getTrackList(args.link, options.id)
  })

  .command('tag', 'Generate ID3 tags from Discogs')
  .argument('<id>', 'Discogs ID of the downloaded album')
  .action((args, options) => {
    writeTags(args.id)
  })

prog.parse(process.argv)