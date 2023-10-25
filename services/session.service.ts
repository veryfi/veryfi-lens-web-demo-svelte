import axios from 'axios';

const VALIDATE_URL = "https://lens-pwa-api.veryfi.com/rest/validate_partner"
const CLIENT_ID = "YOUR_CLIENT_ID"

export default async function getVeryfiSession() {
  if (VALIDATE_URL) {
    return await axios.post(
      VALIDATE_URL,
      {},
      {
        headers: {
          'CLIENT-ID': CLIENT_ID,
        },
      }).then((response) => {
        return {
          session: response.data.session
        }
      }).catch((error) => error);
  }
}
