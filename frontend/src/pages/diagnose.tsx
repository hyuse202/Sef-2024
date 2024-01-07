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
import downloadPhoto from '@/utils/downloadPhotos';
import appendNewToName from '@/utils/utils/appendNewToName';
const Home: NextPage = () => {
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const options: UploadWidgetConfig  = {
    apiKey: process.env.NEXT_PUBLIC_BYTESCALES,
    //@ts-expect-errorn
  
    locale: {
       "orDragDropImage": "... hoặc kéo và thả ảnh.",
        "uploadImage": "Tải ảnh lên",
    },
    addAnotherFile: {},
    maxFileCount: 1,
    mimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    editor: { images: { crop: false } },
    styles: { colors: { primary: '#000' } },
    onDragDropImage:{},
    uploadImage: {},
    // @ts-nocheck
    //@ts-nocheck
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
    
    setRestoredImage(newPhoto)
    setLoading(false);
  }

  console.log(typeof restoredImage)
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center min-h-screen">
      <Head>
        <title>ViT-Cxr</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
        <h1 className="mx-auto max-w-4xl font-display text-3xl font-bold tracking-normal text-slate-900 sm:text-6xl mb-5">
          Chẩn đoán ảnh ngay bây giờ
        </h1>
        <div className="flex justify-between items-center w-full flex-col mt-4">
        {
          !originalPhoto && (
            <UploadDropZone />
          )
        }
          {originalPhoto && !restoredImage && (
            <Image
              alt="original photo"
              src={originalPhoto}
              className="rounded-2xl"
              width={475}
              height={475}
            />
            // <h1></h1>
          )}
          {restoredImage && originalPhoto && !sideBySide && (
            <div className="flex sm:space-x-4 sm:flex-row flex-col">
              <div>
                <h2 className="mb-1 font-medium text-lg">Ảnh chẩn đoán</h2>
                <Image
                  alt="original photo"
                  src={originalPhoto}
                  className="rounded-2xl relative"
                  width={475}
                  height={475}
                />
              </div>
              <div className="sm:mt-0 mt-8">
                <h2 className="mb-1 font-medium text-lg">Kết quả chẩn đoán</h2>
                {/* <a href={restoredImage} target="_blank" rel="noreferrer"> */}
                  <Image
                    alt="restored photo"
                    src={restoredImage.fileUrl}
                    className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in"
                    width={475}
                    height={475}
                    // onLoadingComplete={() => setRestoredLoaded(true)}
                  />
                <div className='mt-8 ml-10 items-center'>
                    {Object.entries(restoredImage.name).map(([key, name]) => (
                    <p className='text-justify' key={key}>
                      {name} {restoredImage.confidence[key]}
                    </p>
                  ))}
                {/* {restoredImage.map((item, index) => (
                  <p className=' text-justify' key={index}>{item}</p>
                  ))} */}
                  
                </div>
                {/* </a> */}
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
                Chọn ảnh mới
              </button>
            )}
            {restoredLoaded && (
              <button
                onClick={() => {
                  downloadPhoto(restoredImage!, appendNewToName(photoName!));
                }}
                className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-8 hover:bg-gray-100 transition"
              >
                Download Restored Photo
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