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
        "72ac5e55c3f2429f52f20afc3ed4d3db57f4ee93ba6fc3e96006afde968e2890",
      input: { image: imageUrl, scale: 2 },
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
    console.log(jsonFinalResponse.output)
    if (jsonFinalResponse.status === "succeeded") {
      restoredImage = jsonFinalResponse.output;
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
