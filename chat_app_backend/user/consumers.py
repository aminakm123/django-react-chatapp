from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract the user_id from URL route kwargs
        self.user_id = self.scope['url_route']['kwargs']['user_id']

        # Print debugging information
        print(f"Attempting connection with user_id: {self.user_id}")

        # Define the room group name based on the user_id
        self.room_group_name = f'chat_{self.user_id}'

        # Print debugging information
        print(f"Connecting to room group: {self.room_group_name}")

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        recipient_id = text_data_json['recipient_id']

        # Define recipient's room group
        recipient_group_name = f'chat_{recipient_id}'

        # Send message to recipient's room group
        await self.channel_layer.group_send(
            recipient_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': self.user_id  # Using user_id as sender
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender
        }))
