const got = require('got')
const cheerio = require('cheerio')
const fs = require('fs')

/*
* This link doesn't work
* Your going to have to go to the page yourself to get the querystring that needs
* to be attached to this link, because it has a session val in it
*/
const link = num => `https://byui.brightspace.com/content/enforced/389147-Online.2018.Winter.FDREL275.47/L${num}%20Searching%20for%20Truth.html`

async function main (lessonNum){
	// pad the number with a leading zero
	lessonNum = (lessonNum+"").padStart(2,0)
	// Grabs the page
	const res = await got(link(lessonNum))
	// Loads the page into cheerio
	const $main = cheerio.load(res.body)
	// Scrapes all of the links off the page
	const links = $main('a[href*="lds.org/scriptures"]').get().map(a => ({
		tag: a,
		href: a.attribs.href
	}))
	// All of the scripture look ups
	for(var i = 0; i < links.length; i++){
		// go to the scripture link
		const scripRes = await got(links[i].href)
		// loads the page into cheerio again
		const $page = cheerio.load(scripRes.body)
		// grab all the highlighted scriptures, 
		// strips the text of the super tags and verse numbers
		// and throws them into some p tags
		const scrip = $page('.verse.highlight').get()
			.map(n => `<p><strong>${$page(n).find('.verse-number').text()}</strong>${$page(n).clone().find('sup , .verse-number').remove().end().text()}</p>`).join('\n')
		// create the callout div
		$main(links[i].tag).parent().after(`<div class="callout">${scrip}</div>`)
		// fix all of the links so that the # ref is correct
		$main(links[i].tag).attr('href',$main(links[i].tag).attr('href').replace(/(\/\d+\.(\d+).*?)\?.*/,'$1#p$2'))
		// and make them open in a seperate tab
		$main(links[i].tag).attr('target','_blank')
		// Fix the title
		$main('title').text(`Week ${lessonNum}`)
	}
	// write it out to the file
	fs.writeFileSync(`Lessons/L${lessonNum}.html`,$main.html())
}

// For each of the lessons
for(var i = 2; i <= 13; i++){
	main(i)
}