const tar = require("tar");
const fstream = require("fstream");
const path = require("path");

const dest = path.resolve(process.argv[2]);
const srcA = path.resolve(process.argv[3]);
const srcB = path.resolve(process.argv[4]);

const pack = tar.Pack();
pack.pipe(fstream.Writer(dest));

let endCount = 0;

function onEnd() {
  if (++endCount === 2) {
    pack.end();
  }
}

const srcStreamA = fstream
  .Reader({ type: "Directory", path: srcA })
  .on("end", onEnd);
const srcStreamB = fstream
  .Reader({ type: "Directory", path: srcB })
  .on("end", onEnd);

srcStreamA.pipe(pack, { end: false });
srcStreamB.pipe(pack, { end: false });
