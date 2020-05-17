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
            resolve(song.data.url);
          });
        })
        .catch((err) => reject(err));
    });
  }
}

export default new SC;
