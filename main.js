/*
  should account for infinite scroll
*/

var Xray = require('x-ray');
var http = require('http');

var xray = Xray();

var page = 'http://cat.technology/';
var pageNumber = 2;

var results = [];

// callback for http response chunking
var callback = function(response){
  var str='';

  response.on('data', function(chunk){
    str+=chunk;
  });

  response.on('end', function(){
    pageNumber++;
    // str is a string
    // check if string contains post, which is the class for content
    if (str.indexOf('class="post"') > -1){
      scrape(str)
    }
  });
}

var scrape = function(page){
  xray(page, '.post',[{
    src: 'img @src',
    tags: xray('.has-tags .tag-link', [''])
  }])
  (function(err, data){
    // accumulate results
    results = results.concat(data);

    // continue to make requests to 'http://cat.technology/page/'+page
    console.log('this is page number: ', pageNumber);

    // request next page
    http.get('http://cat.technology/page/'+pageNumber, callback)
  });

  console.log(results);
  return results;
}

// invoke
scrape(page);


