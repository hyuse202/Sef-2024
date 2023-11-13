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
  let startResponse = await fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url : imageUrl
    }),
  });

  let jsonStartResponse = await startResponse.json();
  // let endpointUrl:any = jsonStartResponse.urls;

  // // GET request to get the status of the image restoration process & return the result when it's ready
  // let restoredImage: string | null = null;
  // while (!restoredImage) {
  //   // Loop in 1s intervals until the alt text is ready
  //   console.log("polling for result...");
  //   let finalResponse = await fetch(endpointUrl, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Token " + "r8_LoSpayLX7wKRgCiSqAy66R9nnTrwikO0ui6bA",
  //     },
  //   });
  //   let jsonFinalResponse = await finalResponse.json();

  //   if (jsonFinalResponse.status === "succeeded") {
  //     restoredImage = jsonFinalResponse.output;
  //   } else if (jsonFinalResponse.status === "failed") {
  //     break;
  //   } else {
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //   }
  // }
  res
    .status(200)
    .json(jsonStartResponse);
}
