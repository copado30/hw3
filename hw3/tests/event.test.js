var fs = require('fs');
var path = require('path');
const { JSDOM } = require('jsdom');

test('test selectEvent', () => {
    // Read the index.html file into a string
    var html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
    expect(html).toEqual(expect.anything()); // any non-null value is okay

    // Create a test DOM using JSDOM
    const dom = new JSDOM(html);
    const { window } = dom;
    const $ = require('jquery')(window);

    // Check if the H1 tag contains "Cheesecake Order Form"
    expect($('h1').text()).toBe("Cheesecake Order Form");
});
