const express = require("express");
const app = express();
const port = 4012; // 원하는 포트 번호

app.use(express.static("dist")); // 'dist'는 Webpack 빌드 결과물이 저장되는 디렉토리

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
