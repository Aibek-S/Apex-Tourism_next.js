  import Image from "next/image";
  import { redirect } from 'next/navigation'

  // Explicitly export the component
  export default function Home() {
    // Redirect to the home page route
    redirect('/home')
  }

  // Add metadata export to ensure proper type checking
  export const metadata = {
    title: 'Apex Tourism',
    description: 'Welcome to Apex Tourism',
  }