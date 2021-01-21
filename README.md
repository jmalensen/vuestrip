# Readme for vuestrip project

### /! --CORS trouble to get responses from XKCD website from another domain-- !\
First of all, handle the cors trouble because, we are reaching an url from a different domain

I prefixed all calls for json urls by "https://cors-anywhere.herokuapp.com/" to get rid of cors trouble.
Otherwise, we need to install a middleware using NodeJs to put 'Access-Control-Allow-Origin' in response's headers from XKCD website.

## 3 parts on the app

There 3 parts for this app :
- Part 1 - Show the strip of the day
- Part 2 - Show gallery of strips with possibility to browse through them
- Part 3 - Show a strip requested by its number ou pick a random strip

You can go to these 3 parts by the tabs.

I used sass to compile css file.

Enjoy the app !