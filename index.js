var request = require('request');
var express = require('express');
var cheerio = require('cheerio');

var app = express();

var form = '<form style="margin-bottom: 30px;padding: 10px;background: #f5f5f5;border: 1px solid #ddd;" onsubmit="window.location=\'/q/\' + document.getElementById(\'word\').value; return false;" method="GET" action="/q/"><input style="padding:  10px;font-size: 20px;width: 100%;" id="word" type="text" name="q"><input type="submit" value="Submit"></form>';

app.get('/q/:word', function(req, res){

    request.post('http://hjp.novi-liber.hr/index.php?show=search', {
        form: {
            word: req.params.word,
            search: '+',
            osnovni_podaci: 'on',
            definicija: 'on',
            sintagma: 'on',
            frazeologija: 'on',
            onomastika: 'on',
            etimologija: 'on',
            postano: true
        }
    }, function(err, r, body) {
        if (err) res.send('ERROR');
        var $ = cheerio(body);
        var table = $.find('.natuknica > table');
        table.find('img').attr('src', function(i, old) {
            return 'http://hjp.novi-liber.hr/' + old;
        });
        table.find('a.natlink').attr('href', function(i, old) {
            var word = cheerio(this).prevAll('b').last().text().trim().split(' ')[0];
            return word ? '/q/' + word : 'http://hjp.novi-liber.hr/' + old;
        });
        res.send('<html><head><link rel="search" href="/opensearch.xml" type="application/opensearchdescription+xml" title="HJP search" /></head><body>' + form+ '<table style="width: 100%">' + table.html() + '</table><script>document.getElementById(\'word\').focus()</script></body></html>');
    });
});

app.get('/', function(req, res){
    res.send('<!DOCTYPE html><html><head><title>HJP search</title><link rel="search" href="/opensearch.xml" type="application/opensearchdescription+xml" title="HJP search" /></head><body>' + form+ '</body><script>document.getElementById(\'word\').focus()</script></html>');
});

app.get('/opensearch.xml', function(req, res){
    res.header('Content-Type','text/xml').send('<?xml version="1.0" encoding="UTF-8"?><OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"><ShortName>HJP search</ShortName><Description>HJP search</Description><Tags>hjp parser search</Tags><InputEncoding>UTF-8</InputEncoding><Url type="text/html" template="http://hjp.jjanzic.com/q/{searchTerms}" /><Image height="16" width="16" type="image/x-icon">http://hjp.novi-liber.hr/images/logo_nl.gif</Image></OpenSearchDescription>');
});

app.listen(process.env.PORT || 3000);
