import type { NextApiRequest, NextApiResponse } from "next";

type Data = string;
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    imageUrl: string;
  };
}
export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {


  const imageUrl = req.body.imageUrl;
  // POST request to Replicate to start the image restoration generation process
  let startResponse = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " +process.env.NEXT_PUBLIC_REPLICATE
    },
    body: JSON.stringify({
      version:
        "c03f78a9e7220d772d2d5729c4b3e9ce83b381491660a2a4468eb5044bb147a7",
      input: { image: imageUrl},
    }),
  });

  let jsonStartResponse = await startResponse.json();
  let endpointUrl = jsonStartResponse.urls.get;
  // console.log(jsonStartResponse, endpointUrl)
  let restoredImage: string | null = null;
  while (!restoredImage) {
    // Loop in 1s intervals until the alt text is ready
    console.log("polling for result...");
    let finalResponse = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.NEXT_PUBLIC_REPLICATE,
      },
    });
    let jsonFinalResponse = await finalResponse.json();
    // console.log(jsonFinalResponse.output)
    if (jsonFinalResponse.status === "succeeded") {
      let RectResp = await fetch("http://127.0.0.1:5000/rect", {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: jsonFinalResponse.output,
          url: imageUrl
        })
      })
      const jsonRectResp = await RectResp.json()
      // console.log(jsonRectResp.files[0].fileUrl)
      restoredImage = { ...jsonFinalResponse.output, ...jsonRectResp.files[0]};
      console.log(restoredImage)
    } else if (jsonFinalResponse.status === "failed") {
      break;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  res
    .status(200)
    .json(restoredImage ? restoredImage : "Failed to restore image");
}
