const video = document.querySelector("#videoElement")
const videoText = document.querySelector("#videoText")

const startCamera = () => {
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
			video.play()
		})
	}
}

ml5.imageClassifier('MobileNet', video)
	.then((classifier) => {
		videoText.innerText = 'Model loaded!'
		vidPredict(classifier)
	})

const vidPredict = (classifier) => {
	classifier.predict((err, results) => {
		if (err) {
			console.error(err)
		} else {
			console.log(results)
			videoText.innerText = results[0].probability > 0.4 ? results[0].className : ''
			vidPredict(classifier)
		}
	})
}