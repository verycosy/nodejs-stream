/**
 * 스트림을 이용한 비동기 순차 반복
 * (iterator나 async/await와 비슷 ... )
 */

const fromArray = require("from2-array");
const through = require("through2");
const fs = require("fs");

function concatFiles(dest, files, cb) {
  const destStream = fs.createWriteStream(dest);
  fromArray
    .obj(files) // 파일 배열로부터 ReadableStream 생성
    .pipe(
      through.obj((file, enc, done) => {
        // 순차적으로 각 파일을 처리하기 위해 through(Transform) 스트림 생성.
        // 각 파일에 대해 Readable 스트림을 만들고, 출력 파일을 나타내는 destStream으로 연결(pipe).
        const src = fs.createReadStream(file);
        src.pipe(destStream, { end: false }); // 소스 파일을 다 읽은 후에도 destStream 닫지 않도록.
        src.on("end", done); // 소스 파일의 모든 내용이 destStream으로 전달되면, 현재 처리가 완료됐음을 알림. 다음 파일의 처리를 시작시켜야 함.
      })
    )
    .on("finish", () => {
      destStream.end();
      cb();
    });
}

// module.exports = concatFiles;

concatFiles(process.argv[2], process.argv.slice(3), () => {
  console.log(`Files concatenated succesfully`);
});
