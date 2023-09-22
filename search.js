console.log("[RuPageSearch] V2");
console.log("Loading modules...");

const fs = require("fs");
const cheerio = require("cheerio");

// Configuration
const articlesFolder = "../articles/"; // Root directory of articles
const articlesFileName = "index.html"; // Document filename
const savePath = "../assets/data/search.json";
// Selectors
const articlesName = "#articles-header h2 a"; // Article title element
const articlesUrl = "#articles-header h2 a"; // Article link element
const articlesTime = "#articles-header .articles-info time"; // Article time element
const articlesClass = "#articles-header .articles-info .class a"; // Article category element
const articlesTag = "#articles-header .articles-tags a"; // Article tag element
const articlesBody = "#articles-body"; // Article content element
const articlesImages = "#articles-body img"; // Article image element
const articlesLinks = "#articles-body a"; // Article external link element
const articlesTitle =
  "#articles-body h2 , #articles-body h3 , articles-body h4 , articles-body h5 , articles-body h6"; // Article subheading element

let fileStructure = [];
let fileList = [];
let objectStructure = {};
let objectStructureList = [];
let json;

console.log("[RuPageSearch] LOADED");
console.log("Fetching file tree...");

function fileRead(name) {
  data = fs.readFileSync(`${articlesFolder}${name}/${articlesFileName}`);
  fileParse(data);
}

function HTMLEncode(str) {
  var s = "";
  if (str.length == 0) return "";
  s = str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/ /g, "&nbsp;")
    .replace(/\'/g, "&#39;")
    .replace(/\"/g, "&quot;")
    .replace(/\n/g, "<br/>");
  return s;
}

function fileParse(file) {
  let cla = [];
  let tag = [];
  let title = [];
  let img = [];
  let links = [];
  let name, url, time, context;

  const $ = cheerio.load(file, {
    ignoreWhitespace: true,
  });
  name = $(articlesName).text();
  url = $(articlesUrl).attr("href");
  time = $(articlesTime).text();
  $(articlesClass).each(function (i, e) {
    cla.push($(e).text().toLowerCase());
  });

  $(articlesTag).each(function (i, e) {
    tag.push($(e).text().toLowerCase());
  });

  context = HTMLEncode(
    $(articlesBody)
      .text()
      .replace(/\s+/g, "&nbsp;")
      .replace(/\n|\r/g, " "),
  );
  $(articlesTitle).each(function (i, e) {
    title.push(
      $(e)
        .text()
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/\n|\r/g, ""),
    );
  });
  $(articlesImages).each(function (i, e) {
    if (
      $(e).attr("src").indexOf("http") == -1 &&
      $(e).attr("src").indexOf("articles") == -1
    ) {
      img.push($(articlesUrl).attr("href") + $(e).attr("src"));
    } else {
      img.push($(e).attr("src"));
    }
  });
  $(articlesLinks).each(function (i, e) {
    if (
      typeof $(e).attr("href") !== "undefined" &&
      $(e).attr("href")[0] !== "#"
    ) {
      links.push($(e).attr("href"));
    }
  });
  fileStructure.push([name, url, time, cla, tag, title, context, img, links]);
  packer(name);
}

fs.readdir(articlesFolder, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Directory read successful. Found a total of " + data.length + " files");
    fileList = [];
    data.forEach((e) => {
      if (/^\d+$/.test(e)) {
        fileList.push(e);
      }
    });
    fileList.sort((a, b) => b - a);
    fileList.forEach((e) => {
      fileRead(e);
    });
  }
});

function objectCreater(arr) {
  this.name = arr[0];
  this.url = arr[1];
  this.time = arr[2];
  this.class = arr[3];
  this.tag = arr[4];
  this.title = arr[5];
  this.context = arr[6];
  this.img = arr[7];
  this.links = arr[8];
}

function packer(e) {
  console.log(`Article '${e}' has been indexed.`);
  if (fileList.length == fileStructure.length) {
    fileStructure.forEach((e, index) => {
      objectStructure = new objectCreater(e);
      objectStructureList.push(objectStructure);
    });
    fs.writeFile(savePath, JSON.stringify(objectStructureList), (err) => {
      if (err) throw err;
      console.log("Generation & Writing successful.");
    });
  }
}
