import { Stack } from "expo-router"
import { AuthProvider } from "./contexts/AuthContext"
import { GameCreationProvider } from "./contexts/GameCreationContext"

const AppLayout = () => {
  return (
    <AuthProvider>
      <GameCreationProvider>
        <Stack />
      </GameCreationProvider>
    </AuthProvider>
  )
}

export default AppLayout
