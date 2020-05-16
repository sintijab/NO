/* eslint-disable */
const axios = require("axios");

class SC {
  init(config) {
    this.config = config;
  }

  get(type, params) {
    return new Promise((resolve, reject) => {
      params == undefined ? (params = {}) : null;
      params.client_id = this.config.clientId;
      let urlParameters = Object.entries(params)
        .map((e) => e.join("="))
        .join("&");

      let url = `${type}?${urlParameters}`;

      axios.get(`/query/${url}`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  stream(type) {
    return new Promise((resolve, reject) => {
      let url = `/query/tracks?ids=${type}&client_id=${this.config.clientId}`;

      axios({
        url: url,
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      })
        .then((res) => {
          const media = res.data[0].media.transcodings[1]
          const protocol = media.format.protocol
          const id = `${res.data[0].id}`
          const tokenIndexStart = media.url.indexOf(id) + id.length + 1
          let tokenId = media.url.slice(tokenIndexStart, media.url.length)
          tokenId = tokenId.slice(0, tokenId.indexOf('/'))
          axios({
            url: `/stream/${protocol}/${id}/${tokenId}?client_id=${this.config.clientId}`,
            headers: {
              "Access-Control-Allow-Origin": "*",
            }
          }).then((song) => {
            console.log(song.data.url);
            let Track = new Audio(song.data.url);
            Track.setVolume = (vol) => {
              Track.volume = vol;
            };
            Track.isEnded = () => {
              return Track.ended;
            };
            Track.getDuration = () => {
              return Track.duration;
            };
            Track.seek = (to) => {
              Track.currentTime = to;
            };
            Track.isPlaying = () => {
              if (Track.defaultPlaybackRate > 0) {
                return true;
              } else {
                return false;
              }
            };
            Track.isActuallyPlaying = () => {
              if (Track.defaultPlaybackRate > 0) {
                return true;
              } else {
                return false;
              }
            };
            resolve(Track);
          });
        })
        .catch((err) => reject(err));
    });
  }
}

export default new SC;
