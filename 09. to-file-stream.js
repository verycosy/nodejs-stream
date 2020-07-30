const stream = require("stream");
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");

class ToFileStream extends stream.Writable {
  constructor() {
    super({ objectMode: true });
  }

  async _write(chunk, encoding, callback) {
    try {
      await mkdirp(path.dirname(chunk.path));
      fs.writeFile(chunk.path, chunk.content, callback);
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = ToFileStream;
