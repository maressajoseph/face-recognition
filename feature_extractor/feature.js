const loading = document.getElementById('loadingFeature')
const video = document.querySelector("#webcam")
const result = document.querySelector("#featureResult")
const image = document.querySelector("#jmImage")
let labeledFaceDescriptors
let faceMatcher
let results
let fullFaceDescriptions
const maxDescriptorDistance = 0.6

async function addFaces() {
  const labels = ['coen.warmer', 'diogo.tavares', 'dirk.volman', 'elke.smit', 'frans.mettes', 'imke.weijers', 'ahmad',
  'irene.bruggemann', 'ernst.de.vries', 'aimee.rutten', 'alexandra.van.voorst', 'arjen.de.vries', 'kars.kingma',
  'astrid.van.heinsbergen', 'bart.beemster', 'claire.delsman', 'bart.ter.steege', 'maressa.joseph', 'marvin.de.bruin',
  'thijs.van.campen', 'bart.vijfhuizen', 'jacintha.kiewiet', 'jessica.de.jong', 'joey.germeraad', 'eefje', 'joyce.lowies',
  'wessel.jansen', 'timo.blom', 'yke.bolman', 'tessa.kooiman', 'sascha.spijker', 'sadie.giles', 'rilliano.mertodikromo',
  'merei.sandbrink', 'matthijs.kleverlaan', 'maiken.van.vliet', 'levi.gijsbertha', 'veerle', 'pinar.kesenci', 'marjolein.van.der.velden'
]

  labeledFaceDescriptors = await Promise.all(
    labels.map(async label => {
      const imgUrl = `../images/${label}.square.png`
      const img = await faceapi.fetchImage(imgUrl)
      
      const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
      
      if (!fullFaceDescription) {
        throw new Error(`no faces detected for ${label}`)
      }
      
      const faceDescriptors = [fullFaceDescription.descriptor]
      return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
    })
  )
  faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)
  detect()
}

async function detect() {
  fullFaceDescriptions = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
  results = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))

  console.log(results)

  if (results && results.length && results[0].label !== "unknown") {
    loading.innerText = ""
    result.innerText = "Hi " + results[0].label
    detect()
  } else {
    result.innerText = "Can't find face, hang on.."
    detect()
  }
}

async function load() {
  await faceapi.loadSsdMobilenetv1Model('../models')
  await faceapi.loadFaceRecognitionModel('../models')
  await faceapi.loadFaceLandmarkModel('../models')
  addFaces()
}

load()

if (labeledFaceDescriptors !== undefined && (results === undefined || results[0].label === "unknown")) {
  detect()
}

if (navigator.mediaDevices.getUserMedia) {
  const constraints = {
    audio: false,
    video: {
      facingMode: 'user'
    }
  }       
  navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    video.srcObject = stream
  })
}

// const isTraining = (loss) => {
//   if (loss === null) {
//     console.log('save model')
//     classifier.classify(video, getResults)
//   }
// }

// const download = () => {
//   classifier.save()
// }

// const getResults = (err, results) => {
//   if (err) {
//     console.log(err)
//   } else {
//     result.innerText = "Hi " + results
//   }
//   classifier.classify(video, getResults)
// }

// const trainModel = () => {
//   console.log('training model')
//   classifier.train(isTraining)
// }


// const extractor = ml5.featureExtractor('MobileNet', () => loading.innerText = 'Ready!')
// classifier = extractor.classification(video)
// extractor.numClasses = 1000
// classifier.load('../model.json', () => {
//   console.log('JM model loaded')
// })

// const createImage = (x, y, w, h) => {
//   const context = canvas.getContext('2d')
//   canvas.width = w
//   canvas.height = h
//   context.drawImage(video, (video.offsetLeft + x + 60), (video.offsetTop + y + 60), w, h, 0, 0, w, h)

//   const data = canvas.toDataURL('image/png')
//   image.setAttribute('src', data)
// }