export const processImageService = async (
  image: string,
  clientId: string,
  username: string,
  apiKey: string,
  deviceData: any
): Promise<any> => {
  const processDocumentUrl = "https://lens.veryfi.com/rest/process";
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image: image,
      username,
      api_key: apiKey,
      client_id: clientId,
      device_data: deviceData,
    }),
  };
  const response = await fetch(processDocumentUrl, requestOptions);
  return response.json();
};
