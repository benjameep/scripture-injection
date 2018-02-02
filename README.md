# REL275 Scripture Injection

Wrote a tiny script to inject the scripture after the link to the scripture

It isn't perfect but gets the job done

## To use

Just go to (here)[#]

## To help develop

It is written in javascript using NodeJs

So you will need to have node on your machine

##### Clone the repository
```
git clone 
cd scripture-injection
```
##### Install dependencies
```
npm install
```
##### Get the sessionval querystring
- Go to one of the Searching for Truths
- right click in the iframe which the scriptures are showing in
- Select the `View frame source` option
- Your url show look something like this 
```
view-source:https://byui.brightspace.com/content/enforced/389147-Online.2018.Winter.FDREL275.47/L02%20Searching%20for%20Truth.html?d2lSessionVal=XXXXXXXXXXXXXXX&ou=389147&d2l_body_type=3
```
- Copy the querystring off the end
```
?d2lSessionVal=XXXXXXXXXXXXXXX&ou=389147&d2l_body_type=3
```
- And paste it into `main.js` and the end of the link (line 10ish)

##### run main to update all of the html files
```
node main
```