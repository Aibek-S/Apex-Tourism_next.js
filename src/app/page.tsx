import Image from "next/image";
import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to the home page route
  redirect('/pages/home')
}