import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { io } from "socket.io-client";
import DynamicBreadcrumb from "@/hooks/brudcrumbhooks";
import { AppSidebar } from "./Sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/hooks/redduxhook";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000");
interface Message {
  message: string;
  from: "You" | "Owner";
}

const Chat = () => {
  const userId = useAppSelector((state) => state.user.Userid); // User's ID
  const [message, setMessage] = useState<string>(""); // Message input
  const [messages, setMessages] = useState<Message[]>([]); // Chat messages
  const { id } = useParams<{ id: string }>(); // Room ID from URL
  const userEmail = useAppSelector((state) => state.user.email); // User's email (needed for owner)
  useEffect(() => {
    if (id) {
    } else {
    }
    initializeRoomChat();
    fetchChatList();
    
    // Cleanup socket listeners on unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, [id, userId, userEmail]);

  // Initialize chat for a specific room
  const initializeRoomChat = () => {
    if (!userId) {
      console.error("User ID is missing. Cannot register with the server.");
      return;
    }

    socket.emit("registerUser", userId); // Register user
    socket.on("receiveMessage", (data: { sender: any; message: string }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: data.message,
          from: data.sender === userEmail ? "Owner" : "You",
        },
      ]);
    });
  };

  // Placeholder for fetching chat list if no room ID is provided
  const fetchChatList = () => {
    console.log("Fetching chat list...");
    // Implement API call to fetch chat list if necessary
  };
  const sendMessagewithoutroomid=()=>{
    socket.emit("sendMessagewithoutroomid", {
      senderId: userId,
      message,
      ReceiverEmail: id,
    });
  }

  // Send message to the room owner
  const sendMessageToOwner = () => {
    if (!message.trim()) {
      console.error("Message is empty. Cannot send.");
      return;
    }

    // if (!id) {
    //   console.error("Room ID is missing. Cannot send the message.");
    //   return;
    // }

    socket.emit("sendMessage", {
      senderId: userId,
      message,
      ReceiverRoomId: id,
    });

    setMessages((prevMessages) => [...prevMessages, { message, from: "You" }]);
    setMessage(""); // Clear message input
  };
  return (
    <>
      <SidebarProvider>
        <AppSidebar title="Create room" />
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumb />
            </div>
          </header>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-[0.2fr_1fr] grid-rows-[auto_1fr] max-h-[93vh] h-screen">
            {/* Chat List Sidebar */}
            <div className="border-l border overflow-y-auto h-screen max-h-[93vh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] text-center text-l">
                      Chats
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Chat list rows */}
                  {Array.from({ length: 30 }, (_, i) => (
                    <TableRow key={i}>
                      <TableCell> Chat {i + 1}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Chat Section */}
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-2 ">
                <div className="flex-1">Details Name</div>
              </div>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((message: Message, index: number) => (
                  <div
                    key={index}
                    className={
                      message.from === "You" ? "text-right" : "text-left"
                    }
                  >
                    <strong>{message.from}: </strong> {message.message}
                  </div>
                ))}
                {/* Add more messages as needed */}
              </div>

              {/* Message Input */}
              <div className="flex items-center gap-2 px-4 py-2 border-t ">
                <Input
                  type="text"
                  placeholder="Message"
                  value={message}
                  className="flex-1"
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button type="submit" onClick={()=>{id?sendMessageToOwner():sendMessagewithoutroomid()}}>
                  Send
                </Button>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Chat;
