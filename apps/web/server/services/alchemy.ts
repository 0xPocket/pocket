const UPDATE_WEBHOOK_URL =
  'https://dashboard.alchemyapi.io/api/update-webhook-addresses';

const OPTIONS = {
  method: 'PATCH',
  headers: {
    'Accept': 'application/json',
    'X-Alchemy-Token': process.env.ALCHEMY_AUTH_TOKEN!,
    'Content-Type': 'application/json',
  },
};

export async function addAddressToWebhook(address: string) {
  return fetch(UPDATE_WEBHOOK_URL, {
    ...OPTIONS,
    body: JSON.stringify({
      addresses_to_add: [address],
      addresses_to_remove: [],
      webhook_id: process.env.ALCHEMY_WEBHOOK_ID!,
    }),
  })
    .then(async (response) => {
      console.log(response);
      const test = await response.json();
      console.log(test);
    })
    .catch((err) => {
      throw err;
    });
}

export async function removeAddressFromWebhook(address: string) {
  return fetch(UPDATE_WEBHOOK_URL, {
    ...OPTIONS,
    body: JSON.stringify({
      addresses_to_add: [],
      addresses_to_remove: [address],
      webhook_id: process.env.ALCHEMY_WEBHOOK_ID!,
    }),
  })
    .then((response) => response.json())
    .catch((err) => {
      throw err;
    });
}
