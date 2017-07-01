#!/usr/bin/env node
const prog = require('caporal')
const getTrackList = require('./lib/getTrackList')

prog
  .version('1.0.0')

  .command('download', 'Download an OST from KHInsider')
  .argument('<link>', 'The segment after /album/ in the OST URL')
  .action((args, options) => {
    getTrackList(args.link)
  })

prog.parse(process.argv)