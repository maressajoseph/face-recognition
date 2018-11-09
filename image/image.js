let img = document.getElementById('image')
const result = document.getElementById('result')
const text = document.getElementById('resultText')
const probability = document.getElementById('probability')
const loading = document.getElementById('loading')
const button = document.getElementById('predictButton')

const modelReady = () => {
  loading.innerText = 'Model is loaded!'
}

const predict = () => {
  classifier.predict(img, (err, results) => {
    if (err) {
      console.error(err)
    } else {
      console.log(results)
      text.style.setProperty('display', 'block')
      result.innerText = results[0].className
      probability.innerText = results[0].probability.toFixed(2)
    }
  })
}

const handleFile = (files) => {
  const file = files[0]
  const reader  = new FileReader()

  reader.onloadend = () => {
    img.src = reader.result;
    predict()
  }

  file ? reader.readAsDataURL(file) : ''
}

const classifier = ml5.imageClassifier('MobileNet', modelReady)