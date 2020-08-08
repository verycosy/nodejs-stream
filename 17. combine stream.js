const zlib = require("zlib");
const crypto = require("crypto");
const combine = require("multipipe");

// 결합된 스트림을 블랙박스처럼 사용 가능.
function compressAndEncrypt(password) {
  return combine(zlib.createGzip(), crypto.createCipher("aes192", password));
}

function decryptAndDecompress(password) {
  return combine(
    crypto.createDecipher("aes192", password),
    zlib.createGunzip()
  );
}

const fs = require("fs");

// // 만들어진 파이프라인 밖으로 결합된 스트림 생성.
// fs.createReadStream(process.argv[3])
//   .pipe(compressAndEncrypt(process.argv[2]))
//   .pipe(fs.createWriteStream(process.argv[3] + ".gz.enc"))
//   .on("error", (err) => {
//     // 마지막 스트림에서 발생하는 에러만 처리 or 스트림마다 일일이 붙이기
//     console.error(err);
//   });

combine(
  fs
    .createReadStream(process.argv[3])
    .pipe(compressAndEncrypt(process.argv[2]))
    .pipe(fs.createWriteStream(process.argv[3] + ".gz.enc"))
).on("error", (err) => {
  // 오류 리스너를 결합된 스트림에 직접 부착 가능 & 모든 내부 스트림으로부터 발생된 에러 수신 가능
  // 파이프라인 내의 모든 에러들 처리
  console.error(err);
});

// 위쪽 combine 코드 실행 완료가 보장된 후 동작해야 함
combine(
  fs
    .createReadStream(process.argv[3] + ".gz.enc")
    .pipe(decryptAndDecompress(process.argv[2]))
    .pipe(fs.createWriteStream("new.txt"))
).on("error", (err) => {
  console.error(err);
});
