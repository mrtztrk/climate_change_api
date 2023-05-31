const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express(); // this line call express

const newspapers = [
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "nyt",
    address: "https://www.nytimes.com/international/section/climate",
    base: "https://www.nytimes.com",
  },
  {
    name: "bbc",
    address: "https://www.bbc.com/news/science_and_environment",
    base: "https://www.bbc.com",
  },
  {
    name: "latimes",
    address: "https://www.latimes.com/environment",
    base: "",
  },
  {
    name: "smh",
    address: "https://www.smh.com.au/environment/climate-change",
    base: "https://www.smh.com.au",
  },
  {
    name: "cityam",
    address: "https://www.cityam.com/topic/climate-change/",
    base: "",
  },
  {
    name: "dailymail",
    address:
      "https://www.dailymail.co.uk/news/climate_change_global_warming/index.html",
    base: "",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    $("a:contains('climate')", html).each(function () {
      const title = $(this)
        .text()
        .replace(/(\r\n|\n|\t|\r)/gm, "");
      const url = $(this).attr("href");
      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

app.get("/muratisgreat", function (req, res) {
  res.json("welcome to my climate change News API");
});

// app.get("/news", (req, res) => {
//   axios
//     .get("https://www.theguardian.com/environment/climate-crisis")
//     .then((response) => {
//       const html = response.data;
//       const $ = cheerio.load(html);
//       $('a:contains("climate")', html).each(function () {
//         const title = $(this).text();
//         const url = $(this).attr("href");
//         articles.push({
//           title,
//           url,
//         });
//       });
//       res.json(articles);
//     })
//     .catch((err) => {
//       console.log(err);
//     })
// });

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperID", (req, res) => {
  const newspaperId = req.params.newspaperID;

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];
      $('a:contains("climate")', html).each(function () {
        const title = $(this)
          .text()
          .replace(/(\r\n|\n|\t|\r)/gm, "");
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
