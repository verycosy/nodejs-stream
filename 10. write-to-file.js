const ToFileStream = require("./09. to-file-stream");
const tfs = new ToFileStream();

tfs.write({ path: "file1.txt", content: "Hello" });
tfs.write({ path: "file2.txt", content: "Node.js" });
tfs.write({ path: "file3.txt", content: "Streams" });
tfs.end(() => console.log("All files created"));
