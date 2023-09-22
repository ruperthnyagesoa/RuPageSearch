# RuPageSearch
Implementation of automated static site full-site search - High performance/real-time search/regex syntax support/asynchronous/web worker/automatic continuous build/expandable data format/customizable frontend style
## Demo
You can try this search feature directly on [my blog](https://ruperth.netlify.app/articles/), and experience its high performance.
When building, run `search.js`, which will index all the articles on the website and generate an index file `search.json`.
When used on the client side, the browser will request the generated `search.json` and establish a connection with the Web Worker `search.worker.js`.
During a search, the search term and index data will be sent to the Worker for processing, and the Worker will return a JSON-formatted search result.
Afterwards, the frontend will process the returned result and display it.
## Usage
### Initialization configuration
> **Note: You need to adjust the script according to your page structure first.**
#### Configure directory structure
Example:
If your article directory structure is as follows:
```
......
├── articles
│   ├── 20200816
│   │   ├── index.html
│   ├── 20210701
│   │   └── index.html
│   ├── 20210705
│   │   └── index.html
│   ├── 20210719
│   │   └── index.html
│   ├── 20220206
│   │   └── index.html
......
```
Configure it like this in `search.js`:
```js
// Configuration section
const articlesFolder = "../articles/"; // Article root directory
const articlesFileName = "index.html"; // Document file name
const savePath = "../assets/data/search.json";
```
This will match content like this: `../articles/*/index.html`
RPageSearch will list all directories in `articlesFolder` by default and check if they contain `articlesFileName` for parsing.
Among them, `savePath` defines the save path for generating the data, which will be used later.
#### Configure page structure
Example:
If your article document structure is as follows:
```html
<article>
    <div id="articles-header">
        <h2><a href="/articles/20221224/">HikvisionIP Camera Bypass</a></h2><p class="articles-info">
            <time>2022-12-24</time> •<span class="i_small ri:archive-line"></span><span class="class"><a>Network Security</a>/<a>Technology</a></span> •<span class="i_small ri:t-box-line"></span> <span id="textLength">----words</span> •<span class="i_small ri:search-eye-line"></span> <span id="pageVisitors">---</span>
        </p>
        <p class="articles-tags">
            <span class="i_small ri:price-tag-3-line"></span><a>ATTACK</a><a>JSON</a><a>MONITOR</a>
        </p>
        <hr>
    </div>
    <div id="articles-body">
        <h3>Title</h3><p>
            Content
        </p>
        <br><br><h3>Title</h3><p>
            Content
        </p>
        <h3>Title</h3><p>
            Content
        </p>
    </div>
    <div id="articles-footer">
        Omitted
    </div>
</article>
```
You can configure it like this in `search.js`:
```js
// Selectors
const articlesName = "#articles-header h2 a"; // Article title element
const articlesUrl = "#articles-header h2 a"; // Article link element
const articlesTime = "#articles-header .articles-info time"; // Article time element
const articlesClass = "#articles-header .articles-info .class a"; // Article classification element
const articlesTag = "#articles-header .articles-tags a"; // Article tag element
const articlesBody = "#articles-body"; // Article content element
const articlesImages = "#articles-body img"; // Article image element
const articlesLinks = "#articles-body a"; // Article external link element
const articlesTitle =
  "#articles-body h2 , #articles-body h3 , articles-body h4 , articles-body h5 , articles-body h6"; // Article sub-headings element
```
You can use CSS selectors freely here, as shown above.
#### Generate index data
Install dependencies and run `search.js`
```
npm install
node search.js
```
If everything goes well, the `search.json` file used to save the results will be generated in the previously defined path `savePath`.
This file is used for communication with search.worker.js, and its format generally does not need to be adjusted.
## Advanced
Because an index file is provided, you can generate other files based on it. Refer to the following project:
[https://github.com/ruperthnyagesoa/local-feed-generation](https://github.com/ruperthnyagesoa/local-feed-generation)
## Dependencies
https://github.com/cheeriojs/cheerio
