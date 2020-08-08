/**
 * 비순차 병렬 실행
 * 항목들을 받은 순서대로 보존하지 않는다.
 * 데이터의 순서가 중요한 바이너리 스트림에서는 잘 작동하지 않지만,
 * 일부 유형의 객체 스트림에서는 유용.
 */

const stream = require("stream");

class ParallelStream extends stream.Transform {
  constructor(userTransform) {
    super({ objectMode: true });
    this.userTransform = userTransform;
    this.running = 0;
    this.terminateCallback = null;
  }

  _transform(chunk, end, done) {
    this.running++;
    this.userTransform(
      chunk,
      end,
      this.push.bind(this),
      this._onComplete.bind(this)
    );
    done();
  }

  _flush(done) {
    if (this.running > 0) {
      this.terminateCallback = done;
    } else {
      done();
    }
  }

  _onComplete(err) {
    this.running--;

    if (err) {
      return this.emit("error", err);
    }

    if (this.running === 0) {
      this.terminateCallback && this.terminateCallback();
    }
  }
}

// module.exports = ParallelStream;

const fs = require("fs");
const split = require("split"); // 각각의 라인을 서로 다른 데이터 덩어리로 출력하는 Transform 스트림
const request = require("request");

fs.createReadStream(process.argv[2])
  .pipe(split())
  .pipe(
    new ParallelStream((url, enc, push, done) => {
      if (!url) return done();
      request.head(url, (err, response) => {
        push(url + " is " + (err ? "down" : "up") + "\n");
        done();
      });
    })
  )
  .pipe(fs.createWriteStream("results.txt"))
  .on("finish", () => console.log("All urls were checked"));
