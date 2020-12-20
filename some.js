var jimp = require('jimp');

var images = ['sam1.jpg', 'banner.png'];

var jimps = [];


jimps[0] = jimp.read('sam1.jpg');

async function resize() {
    // Read the image.
    const image = await jimp.read('banner.png');
    // Resize the image to width 150 and heigth 150.
    await image.resize(550, 550);
    // Save and overwrite the image
    await image.writeAsync('banner.png');
}
resize();
jimps[1] = jimp.read('banner.png');



jimps[0].then(res => {

    jimps[1].then(res1 => {
        res.composite(res1, 100, 1000);
        res.write('test.png', function() {
            console.log("wrote the image");
        });
        console.log(res);
    });



});