const Chance = require("chance");
const chance = new Chance();

require("http")
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });

    function generateMore() {
      while (chance.bool({ likelihood: 95 })) {
        let shouldContinue = res.write(
          chance.string({ length: 16 * 1024 - 1 }) // 데이터크기 16kb - 1 byte = highWatermark 기본값과 매우 가까움.
        );

        if (!shouldContinue) {
          console.log("Backpressure");
          // 이벤트 리스너 함수가 한번이라도 실행하고 나면 자동으로 제거되므로 이벤트를 딱 한번만 받아서 처리 할 수 있음.
          return res.once("drain", generateMore);
        }
      }
      res.end("\nThe end...\n");
    }

    generateMore();
  })
  .listen(8080, () => console.log(`Listening on localhost:8080`));
