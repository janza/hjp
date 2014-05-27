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

app.listen(process.env.PORT || 3000);
