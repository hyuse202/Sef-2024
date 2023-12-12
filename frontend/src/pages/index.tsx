import Image from 'next/image'
import Head from 'next/head';
import Link from 'next/link'
import { NextPage } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SquigglyLines from '@/components/SquigglyLines';

const Home: NextPage = () => {
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>ViT-Cxr</title>
      </Head>
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-10">
        <h1 className="mx-auto max-w-4xl font-display text-3xl font-bold tracking-normal text-slate-900 sm:text-5xl">
          Chẩn đoán bất thường X-quang ngực ứng dụng{' '}
          <span className="relative whitespace-nowrap text-[#3290EE]">
            <SquigglyLines />
            <span className="relative">Vision Transformer</span>
          </span>{' '}
          cho bác sĩ.
        </h1>

        <p className="mx-auto mt-12 max-w-xl text-lg text-slate-700 leading-7">
          Cách sử dụng: do nền tạng Replicate sử dụng cơ chế <a href ="https://replicate.com/docs/how-does-replicate-work#cold-boots"> Cold boot</a>
          . Nên lần đầu tiên chẩn đoán sẽ mất khoảng 2-3 phút để mô hình khởi động và tải lại trang sau đó chỉ mất 3-5s để nhận kết quả. Chi tiết sử dụng như video bên dưới.
        </p>
        <iframe
        src={"https://www.youtube-nocookie.com/embed/sKwqfFpatlk"}
        title={"cc"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        ></iframe>
        {/* <video src="blob:https://www.youtube.com/watch?v=sKwqfFpatlk"></video> */}
        <div className="flex justify-center space-x-4">
          <Link
            className="bg-black rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-black/80"
            href="/diagnose"
          >
            Bắt đầu ngay
          </Link>
        </div>
        <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6">
          <div className="flex flex-col space-y-10 mt-4 mb-16">
            <div className="flex sm:space-x-2 sm:flex-row flex-col">
              <div>
                {/* <h2 className="mb-1 font-medium text-lg">Những công nghệ được ứng dụng</h2>
                <Image
                  alt="...."
                  src="/michael.jpg"
                  className="w-96 h-96 rounded-2xl"
                  width={400}
                  height={400}
                /> */}
              </div>
              {/* <div className="sm:mt-0 mt-8">
                <h2 className="mb-1 font-medium text-lg">Restored Photo</h2>
                <Image
                  alt="Restored photo of my bro"
                  width={400}
                  height={400}
                  src="/michael-new.jpg"
                  className="w-96 h-96 rounded-2xl sm:mt-0 mt-2"
                />
              </div> */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
export default Home;