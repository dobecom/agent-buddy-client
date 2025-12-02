import { UserCircle } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white shadow-sm p-4 flex items-center">
      <div className="flex items-center space-x-3">
        <UserCircle className="w-10 h-10 text-gray-500" />
        <div>
          <h2 className="text-lg font-semibold">Hi, [username]</h2>
          <p className="text-sm text-gray-500">It's been 276 days you started with AgentBuddy</p>
        </div>
      </div>
    </header>
  )
}

