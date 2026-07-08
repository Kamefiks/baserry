// "use client"

// import type React from "react"
// import { motion } from "framer-motion"
// import { useVapi } from "@/hooks/useVapi"

// const Voice: React.FC = () => {
//   const { isCallActive, isLoading, error, startCall, endCall } = useVapi()

//   return (
//     <div className="space-y-8">
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Voice AI Assistant</h1>
//         <p className="text-gray-600 dark:text-gray-300">Powered by Vapi - Voice AI Platform</p>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ delay: 0.1 }}
//         className="card text-center max-w-2xl mx-auto"
//       >
//         <div className="mb-8">
//           <div
//             className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-4xl ${
//               isCallActive ? "bg-green-100 text-green-600 animate-pulse" : "bg-gray-100 text-gray-400"
//             }`}
//           >
//             {isCallActive ? "🎤" : "🔇"}
//           </div>
//         </div>

//         <div className="space-y-4">
//           <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
//             {isCallActive ? "Call Active" : "Ready to Start"}
//           </h2>

//           {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

//           <div className="flex justify-center space-x-4">
//             {!isCallActive ? (
//               <button
//                 onClick={() => startCall()}
//                 disabled={isLoading}
//                 className={`btn-primary text-lg px-8 py-3 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
//               >
//                 {isLoading ? "Starting..." : "Start Call"}
//               </button>
//             ) : (
//               <button
//                 onClick={endCall}
//                 className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded-lg transition-colors text-lg"
//               >
//                 End Call
//               </button>
//             )}
//           </div>
//         </div>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2 }}
//         className="grid grid-cols-1 md:grid-cols-2 gap-6"
//       >
//         <div className="card">
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
//           <ul className="space-y-2 text-gray-600 dark:text-gray-300">
//             <li>• Real-time voice conversation</li>
//             <li>• Natural language processing</li>
//             <li>• Custom assistant configuration</li>
//             <li>• Voice activity detection</li>
//           </ul>
//         </div>

//         <div className="card">
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status</h3>
//           <div className="space-y-3">
//             <div className="flex justify-between">
//               <span className="text-gray-600 dark:text-gray-300">Connection:</span>
//               <span className={`font-medium ${isCallActive ? "text-green-600" : "text-gray-500"}`}>
//                 {isCallActive ? "Connected" : "Disconnected"}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600 dark:text-gray-300">State:</span>
//               <span className="font-medium text-gray-900 dark:text-white">
//                 {isLoading ? "Loading" : isCallActive ? "Active" : "Idle"}
//               </span>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   )
// }

// export default Voice
