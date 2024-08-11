from django.urls import path, re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from .consumers import ChatConsumer  # Adjust the import path according to your project structure

application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/chat/", ChatConsumer.as_asgi()),
        ])
    ),
})
