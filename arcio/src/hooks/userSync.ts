import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { API_URL } from '../config/api'

const useUserSync = () => {
  const { user, isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !isSignedIn || !user) return

      try {
        const response = await fetch(`${API_URL}/users/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clerkId: user.id,
            name: user.fullName || user.firstName || 'Developer',
            email: user.primaryEmailAddress?.emailAddress,
            avatar: user.imageUrl
          })
        })

        const data = await response.json()
        console.log('User synced:', data)
      } catch (error) {
        console.error('User sync failed:', error)
      }
    }

    syncUser()
  }, [isLoaded, isSignedIn, user])
}

export default useUserSync