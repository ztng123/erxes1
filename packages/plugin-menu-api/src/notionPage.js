const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const NOTION_API_KEY = "secret_72jiJHUxhJOIbWDwmeeu6F5m92wvdgtFD4eln3tt34t";
const NOTION_PAGE_ID = "317d4b0e37bb42aba62ff8043ae752c9"; // 페이지 ID 추출

router.get("/api/notion-page", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/pages/${NOTION_PAGE_ID}`,
      {
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2021-11-02", // 최신 버전으로 업데이트
          "Cache-Control": "no-cache", // 캐시 제어 헤더 추가
        },
      }
    );

    // 응답이 정상적인 JSON 형식인지 확인
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error("Error fetching Notion page data:", error);
    res.status(500).send({ error: "Error fetching Notion page data" });
  }
});

module.exports = router;
