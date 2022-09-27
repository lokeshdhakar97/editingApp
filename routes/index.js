const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const axios = require('axios');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    const fname = Date.now() + '-' + Math.round(Math.random() * 1E9) + file.originalname;
    cb(null, fname);
  }

})
const upload = multer({ storage: storage })

let filename = "";


router.get('/', function (req, res) {
  res.render('index', { imageFile: filename });
  filename = "";
});

router.post('/upload', upload.single('avtar'), function (req, res) {
  filename = req.file.filename;
  res.redirect('/');
});

router.get('/invert/:filename', async (req, res) => {
  await Jimp.read(`./public/images/${req.params.filename}`)
    .then(image => {
      image
        .invert()
        .write(`./public/images/invertimage_${req.params.filename}`);
    })
    .catch(err => {
      console.error(err);
    });
  res.json({ imageFile: `invertimage_${req.params.filename}` })
});

router.get('/greyscale/:filename', async (req, res) => {
  await Jimp.read(`./public/images/${req.params.filename}`)
    .then(image => {
      image
        .greyscale()
        .write(`./public/images/greyscale_${req.params.filename}`);
    })
    .catch(err => {
      console.error(err);
    });
  res.json({ imageFile: `greyscale_${req.params.filename}` })

});

router.get('/resize/:filename/:width/:height', async (req, res) => {
  await Jimp.read(`./public/images/${req.params.filename}`)
    .then(image => {
      image
        .resize(Number(req.params.width), Number(req.params.height))
        .write(`./public/images/resize_${req.params.filename}`);
    })
    .catch(err => {
      console.error(err);
    });
  res.json({ imageFile: `resize_${req.params.filename}` })
});

router.get('/mirror/:filename', async (req, res) => {
  await Jimp.read(`./public/images/${req.params.filename}`)
    .then(image => {
      image
        .mirror(true, false)
        .write(`./public/images/mirror_${req.params.filename}`);
    })
    .catch(err => {
      console.error(err);
    });
  res.json({ imageFile: `mirror_${req.params.filename}` })
});

router.get('/contrast/:filename', async (req, res) => {
  await Jimp.read(`./public/images/${req.params.filename}`)
    .then(image => {
      image
        .contrast(+1)
        .write(`./public/images/contrast_${req.params.filename}`);
    })
    .catch(err => {
      console.error(err);
    });
  res.json({ imageFile: `contrast_${req.params.filename}` })

});

router.get('/watermark/:filename/:wmimg', async (req, res) => {
  let watermark = await Jimp.read(path.join(__dirname, `../public/images/${req.params.wmimg}`));
  watermark = watermark.resize(30, 30);
  await Jimp.read(`./public/images/${req.params.filename}`)
    .then(image => {
      image
        .composite(watermark, 0, 0)
        .write(`./public/images/contrast_${req.params.filename}`);
    })
    .catch(err => {
      console.error(err);
    });
  res.json({ imageFile: `contrast_${req.params.filename}` })

});

router.get('/blur/:filename', async (req, res) => {
  await Jimp.read(`./public/images/${req.params.filename}`)
    .then(image => {
      image
        .blur(2)
        .write(`./public/images/blur_${req.params.filename}`);
    })
    .catch(err => {
      console.error(err);
    });
  res.json({ imageFile: `blur_${req.params.filename}` });

});

router.get('/sepia/:filename', async (req, res) => {
  await Jimp.read(`./public/images/${req.params.filename}`)
    .then(image => {
      image
        .sepia()
        .write(`./public/images/sepia_${req.params.filename}`);
    })
    .catch(err => {
      console.error(err);
    });
  res.json({ imageFile: `sepia_${req.params.filename}` });

});

router.get('/posterize/:filename/:n', async (req, res) => {
  await Jimp.read(`./public/images/${req.params.filename}`)
    .then(image => {
      image
        .posterize(Number(req.params.n))
        .write(`./public/images/post_${req.params.filename}`);
    })
    .catch(err => {
      console.error(err);
    });
  res.json({ imageFile: `post_${req.params.filename}` });

});

router.get('/download/:imagename', async (req, res) => {
  res.download(path.join(__dirname, `../public/images/${req.params.imagename}`));
});

router.get('/crop/:filename/:x/:y/:wth/:hth', async (req, res)=>{
  await Jimp.read(`./public/images/${req.params.filename}`)
  .then(image => {
    image
      .crop(Number(req.params.x), Number(req.params.v), Number(req.params.wth), Number(req.params.hth))
      .write(`./public/images/crop_${req.params.filename}`);
  })
  .catch(err => {
    console.error(err);
  });
res.json({ imageFile: `crop_${req.params.filename}` });

});

module.exports = router;
