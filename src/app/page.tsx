import Image from 'next/image'
import UploadPic from './Component/UploadPic'
import DrawSt from './Component/DrawSt'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
  {/* <UploadPic/> */}
  <DrawSt width={600} height={600} />
    </main>
  )
}
