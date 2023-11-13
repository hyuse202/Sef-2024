import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { UrlBuilder } from '@bytescale/sdk';
import { useState } from 'react';
import { UploadDropzone } from '@bytescale/upload-widget-react'; 
import {
  UploadWidgetConfig,
  UploadWidgetOnPreUploadResult,
} from '@bytescale/upload-widget';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingDots from '@/components/LoadingDots';
import useSWR from 'swr';
import { Rings } from 'react-loader-spinner';
const Home: NextPage = () => {
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  //@ts-ignore
  const options: UploadWidgetConfig = {
    apiKey: "public_kW15bkb3CFLyxLsAk9iNBr4FLm5D",
    maxFileCount: 1,
    mimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    editor: { images: { crop: false } },
    styles: { colors: { primary: '#000' } },
    locale: {
       "orDragDropImage": "... hoặc kéo và thả ảnh.",
        "uploadImage": "Tải ảnh lên",
    },
    onPreUpload: async (
      file: File
    ): Promise<UploadWidgetOnPreUploadResult | undefined> => {
      return undefined;
    },
  };

  const UploadDropZone = () => (
    <UploadDropzone
      options={options}
      onUpdate={({ uploadedFiles }) => {
        if (uploadedFiles.length !== 0) {
          const image = uploadedFiles[0];
          const imageName = image.originalFile.originalFileName;
          const imageUrl = UrlBuilder.url({
            accountId: image.accountId,
            filePath: image.filePath,
            options: {
              transformation: 'preset',
              transformationPreset: 'thumbnail',
            },
          });
          setPhotoName(imageName);
          setOriginalPhoto(imageUrl);
          generatePhoto(imageUrl);
        }
      }}
      width="670px"
      height="250px"
    />
  ); 
 async function generatePhoto(fileUrl: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(true);

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: fileUrl }),
    });

    let newPhoto = await res.json();
    setRestoredImage(newPhoto.Prediction)
    setLoading(false);
  }

  console.log(restoredImage)
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center min-h-screen">
      <Head>
        <title>ViT-Cxr</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-900 sm:text-6xl mb-5">
          Chẩn đoán ảnh tại đây
        </h1>
        <div className="flex justify-between items-center w-full flex-col mt-4">
        {
          !originalPhoto && (
            <UploadDropZone />
          )
        }
          
          {originalPhoto && !restoredImage && (
            // <Image
            //   alt="original photo"
            //   src={originalPhoto}
            //   className="rounded-2xl"
            //   width={475}
            //   height={475}
            // />
            <h1></h1>
          )}
          {restoredImage && originalPhoto && !sideBySide && (
            <div className="flex sm:space-x-4 sm:flex-row flex-col">
              <div>
                <h2 className="mb-1 font-medium text-lg">Original Photo</h2>
                {/* <Image
                  alt="original photo"
                  src={originalPhoto}
                  className="rounded-2xl relative"
                  width={475}
                  height={475}
                /> */}
              </div>
              <div className="sm:mt-0 mt-8">
                <h2 className="mb-1 font-medium text-lg">Restored Photo</h2>
                <a href={restoredImage} target="_blank" rel="noreferrer">
                  {/* <Image
                    alt="restored photo"
                    src={restoredImage}
                    className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in"
                    width={475}
                    height={475}
                    onLoadingComplete={() => setRestoredLoaded(true)}
                  /> */}
                  {restoredImage}
                </a>
              </div>
            </div>
          )}
          {loading && (
            <button
              disabled
              className="bg-black rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 hover:bg-black/80 w-40"
            >
              <span className="pt-4">
                <LoadingDots color="white" style="large" />
              </span>
            </button>
          )}
          <div className="flex space-x-2 justify-center">
            {originalPhoto && !loading && (
              <button
                onClick={() => {
                  setOriginalPhoto(null);
                  setRestoredImage(null);
                  setRestoredLoaded(false);
                  setError(null);
                }}
                className="bg-black rounded-full text-white font-medium px-4 py-2 mt-8 hover:bg-black/80 transition"
              >
                Upload New Photo
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;