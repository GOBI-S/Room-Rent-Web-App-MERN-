import {
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

const cardheader = () => {
  return (
    <>
    <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
    </>
  )
}

export default cardheader