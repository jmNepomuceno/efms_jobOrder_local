import asyncio
import websockets

# Store all connected clients
connected_clients = set()

async def handler(websocket):
    # When a client connects
    connected_clients.add(websocket)
    print(f"New connection! ({id(websocket)})")

    try:
        async for message in websocket:
            print(f"Message received: {message}")

            # Broadcast to all other clients
            for client in connected_clients:
                if client != websocket:
                    await client.send(message)

    except Exception as e:
        print(f"Connection {id(websocket)} error: {e}")

    finally:
        connected_clients.remove(websocket)
        print(f"Connection {id(websocket)} closed")



async def main():
    # Host & port (match your PHP Ratchet setup)
    server = await websockets.serve(handler, "0.0.0.0", 8082)

    print("WebSocket server running on ws://192.168.42.14/chat")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
