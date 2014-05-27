var request = require('request');
var express = require('express');
var cheerio = require('cheerio');

var app = express();

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
            return 'http://hjp.novi-liber.hr/' + old;
        });
        res.send('<html><head></head><body><table>' + table.html() + '</table></body></html>');
    });
});

app.get('/', function(req, res){
    res.send('<!DOCTYPE html><html><head><title>HJP search</title><link rel="search" href="/opensearch.xml" type="application/opensearchdescription+xml" title="HJP search" /></head><body><form method="GET" action="/q/"></form><input type="text" name="q"><input type="submit"></body></html>');
});

app.get('/opensearch.xml', function(req, res){
    res.header('Content-Type','text/xml').send('<?xml version="1.0" encoding="UTF-8"?><OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"><ShortName>HJP search</ShortName><Description>HJP search</Description><Tags>hjp parser search</Tags><InputEncoding>UTF-8</InputEncoding><Url type="text/html" template="http://hjp.jjanzic.com/q/{searchTerms}" /><Image height="16" width="16" type="image/x-icon">http://hjp.novi-liber.hr/images/logo_nl.gif</Image></OpenSearchDescription>');
});

app.listen(process.env.PORT || 3000);
