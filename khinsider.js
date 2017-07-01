#!/usr/bin/env node
const prog = require('caporal')
require('dotenv').config()
const getTrackList = require('./lib/getTrackList')

prog
  .version('1.0.0')

  .command('download', 'Download an OST from KHInsider')
  .argument('<link>', 'The segment after /album/ in the OST URL')
  .option('--id <id>', 'Fetch track names from Discogs using album ID')
  .action((args, options) => {
    getTrackList(args.link, options.id)
  })

prog.parse(process.argv)