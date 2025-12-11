import client from "pusher-js";
import Echo from "laravel-echo";

export default {
  async mounted() {
    if (this.$store.getters["user/loggedIn"] && !window.echoInstance) {
      window.Pusher = client
      window.echoInstance = await new Echo({
        broadcaster: 'pusher',
        key: process.env.MIX_PUSHER_APP_KEY,
        cluster: process.env.MIX_PUSHER_APP_CLUSTER,
        forceTLS: true,
        authEndpoint: process.env.PUSHER_AUTH_ENDPOINT,
        auth: {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('user-token')}`
          }
        },
        /* authorizer: (channel, options) => {
          return {
            authorize: (socketId) => {
              console.log(socketId)
              this.$axios.defaults.headers['X-Socket-ID'] = socketId
            }
          };
        } */
      });

      window.echoUserChannel = window.echoInstance.private(`user.${this.$store.state.user.data.id}`);
      window.echoUserChannel
        .listen('NewMessage', (e) => {
          console.log(e);
        });
    }

  }
}
