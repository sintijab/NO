import axios from 'axios'
import { getCookie } from '../functions'
import loadSimpleWebRTC from '../webrtc'

const Cosmic = getCookie('val') ? require('cosmicjs')({
  token: getCookie('val'), // optional
}) : require('cosmicjs')({})

const connectWithRoom = () => {
  if (localStorage.getItem('room')) {
    localStorage.removeItem('room')
  }
  // eslint-disable-next-line
  let response = null
  axios.get(`https://api.cosmicjs.com/v1/${process.env.BUCKET_ID}/objects?type=rooms&read_key=${process.env.READ_KEY}`)
    .then((res) => {
      if (res.data.objects) {
        response = true
      }
    })
    .catch((error) => {
      console.log(error)
    })
  if (!response) {
    const randomRoomNumber = Math.floor(Math.random() * 400000000) + 1

    localStorage.setItem('room', randomRoomNumber)
    // eslint-disable-next-line
    loadSimpleWebRTC()
    const params = {
      title: 'room_id',
      type_slug: 'rooms',
      slug: randomRoomNumber,
      content: '',
      status: 'published',
      metafields: [
        {
          required: true,
          value: randomRoomNumber,
          key: 'room_id',
          title: 'room_id',
          type: 'text',
          children: null,
        },
      ],
    }
    Cosmic.getBuckets()
      .then((data) => {
        const bucket = Cosmic.bucket({
          slug: data.buckets[0].slug,
          write_key: process.env.WRITE_KEY,
        })

        bucket.addObject(params)
          .then((res) => {
            console.log(res)
            const roomNrText = document.getElementById('roomNr')
            roomNrText.innerHTML = randomRoomNumber
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    // eslint-disable-next-line
    const objects = response.data.objects
    const roomNr = (objects.length && objects.length)
      ? objects.map((object) => object.metadata.room_id) : null
    const roomId = (objects.length && objects.length) ? objects.map((object) => object.slug) : null
    if (roomNr.length) {
      const randNr = Math.floor(Math.random() * (roomNr.length - 1)) + 0
      const randomRoomNumber = roomNr[randNr]
      localStorage.setItem('room', randomRoomNumber)
      // eslint-disable-next-line
      Cosmic.getBuckets()
        .then((data) => {
          const bucket = Cosmic.bucket({
            slug: data.buckets[0].slug,
            write_key: process.env.WRITE_KEY,
          })
          bucket.deleteObject({
            slug: roomId[randNr],
            write_key: process.env.WRITE_KEY,
          })
            .then((res) => {
              console.log(res)
              const roomNrText = document.getElementById('roomNr')
              roomNrText.innerHTML = randomRoomNumber
            })
            .catch((err) => {
              console.log(err)
            })
        })
      // eslint-disable-next-line
      loadSimpleWebRTC()
    }
  }
}
export default connectWithRoom
