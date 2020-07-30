process.stdin
  .on("readable", () => {
    let chunk;
    console.log("New Data Available");
    while ((chunk = process.stdin.read()) !== null) {
      console.log(`Chunk read: (${chunk.length})`);
      console.log(`"${chunk.toString()}\n"`);
    }
  })
  .on("end", () => process.stdout.write("End of stream"));
