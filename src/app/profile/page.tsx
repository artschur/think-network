import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

export default async function ProfileRedirect() {
    const user = await currentUser()

    if (!user || !user.username) {
        // If no user is logged in or no username, redirect to login
        return redirect("/login")
    }

    // Redirect to the dynamic username route
    return redirect(`/profile/${user.username}`)
}