const RandomStream = require("./06. random-stream");
const randomStream = new RandomStream();

randomStream.on("readable", () => {
  let chunk;

  while ((chunk = randomStream.read()) !== null) {
    console.log(`Chunk received : ${chunk.toString()} (${chunk.length})`);
  }
});
