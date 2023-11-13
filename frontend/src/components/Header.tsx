import Image from 'next/image';
import Link from 'next/link';

export default function Header({ photo }: { photo?: string | undefined }) {
  return (
    <header className="flex justify-between items-center w-full mt-2 border-b-2 pb-2 sm:px-4 px-2">
      <Link href="/" className="flex space-x-1">
        <Image
          alt="header text"
          src="/cxr-icon.jpg"
          className="sm:w-10 sm:h-10 w-12 h-12"
          width={700}
          height={700}
        />
        <h1 className="sm:text-3xl text-xl font-bold ml-2 tracking-tight">
          ViT-Cxr
        </h1>
      </Link>
      {photo ? (
        <Image
          alt="Profile picture"
          src={photo}
          className="w-10 rounded-full"
          width={32}
          height={28}
        />
      ) : (
        <div className="flex space-x-6">
          <Link
            href="/"
            className="border-r border-gray-300 pr-4 my-auto space-x-2 hover:text-blue-400 transition hidden sm:flex"
          >
            <p className="font-medium text-base">Trang chủ</p>
          </Link>
          <Link
            href="/diagnose"
            className="border-gray-300 bg-black rounded-xl px-3 py-2 text-white space-x-2 hover:text-blue-400 transition hover:bg-black/80 hidden sm:flex"
          >
          Chẩn đoán ngay

          </Link>
        </div>
      )}
    </header>
  );
}