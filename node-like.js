var sys = require("sys"),
    http = require("http"),
    url = require("url"),
    queryString = require("querystring");

var requestHandler = function (clientRequest, clientResponse) {
  var uri = url.parse(clientRequest.url);
  if (uri.port == undefined) {
    uri.port = {"http:":80,"https:":443}[uri.protocol];
  }
  var pathname = uri.search ? uri.pathname + uri.search : uri.pathname;
  
  if (uri.href.match(/http:\/\/www\.facebook\.com\/plugins\/like\.php\?/)) {
    var likedUrl = queryString.parse(uri.query).href;
    sys.puts(likedUrl);
    clientResponse.writeHead(200, {'Content-Type': 'text/html'});
    clientResponse.end('<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">\
    <head>\
    <style>\
      body {\
        margin: 3px;\
      }\
      input#button1 {\
        opacity: 0.9;\
        height:23px;\
        width:65px;\
        border:1px solid #858fa6;\
        background:#4a5775;\
        background:-moz-linear-gradient(top, #606c88, #3f4c6b);\
        background:-webkit-gradient(linear, left top, left bottom, from(#606c88), to(#3f4c6b));\
        -moz-border-radius:3px;\
        -webkit-border-radius:3px;\
        border-radius:3px;\
        -moz-box-shadow:0px 0px 5px #000;\
        -webkit-box-shadow:0px 0px 5px #000;\
        box-shadow:0px 0px 5px #000;\
        font-family:arial;\
        color:#e5edff;\
        font-size:12px;\
        text-shadow:0px 0px 5px rgba(0, 0, 0, 0.75);\
      }\
      input#button1:hover, input#button1:focus {\
        border-color:#adbad9;\
      }\
      input#button1:active {\
        background:-moz-linear-gradient(bottom, #606c88, #3f4c6b);\
        background:-webkit-gradient(linear, left bottom, left top, from(#606c88), to(#3f4c6b));\
        text-shadow:0px 0px 2px #000;\
      }\
      span {\
        font-family:arial;\
        color:#e5edff;\
        font-size:12px;\
        padding:5px 5px 5px 0;\
      }\
      img {\
        padding-left:5px;\
      }\
    </style>\
    </head>\
    <body>\
      <input type="submit" id="button1" value="Like!" onclick="window.open(\'http://delicious.com/save?v=5&noui&jump\
=close&url=\'+encodeURIComponent(\''+ likedUrl +'\')+\'&title=\'+encodeURIComponent(\'' + likedUrl + '\'), \'delicious\',\'toolbar=no,width=550,height=550\'); return false;" />\
      <img src="http://static.delicious.com/img/delicious.small.gif" height="10" width="10" alt="Delicious" />\
      <span>how about adding this stuff to delicious?</span>\
    </body>\
    </html>');
  } else {
    var c = http.createClient(uri.port, uri.hostname);
    var proxyRequest = c.request(clientRequest.method, pathname, clientRequest.headers);
    proxyRequest.addListener("response", function (response) {
      clientResponse.writeHeader(response.statusCode, response.headers);
      response.addListener("data", function (chunk) {
        clientResponse.write(chunk, 'binary');
      });
      response.addListener("end", function () {
        clientResponse.end();
      });
    });
  
    clientRequest.addListener("data", function (chunk) {
      proxyRequest.write(chunk, 'binary');
    });
    clientRequest.addListener("end", function () {
      proxyRequest.end();
    });
  }
};

var foobar = function () {
  sys.puts('foobar');
}

var server = http.createServer(requestHandler);
server.listen(8000);
sys.puts("Server running at http://127.0.0.1:8000/");