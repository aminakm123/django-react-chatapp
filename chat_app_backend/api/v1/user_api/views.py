from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view
from .models import ChatMessage, Interest, Profile
from .serializers import ChatMessageSerializer, InterestSerializer, ProfileSerializer, RegisterSerializer, UserSerializer

User = get_user_model()

# Get All Routes
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/v1/user/token/',
        '/api/v1/user/register/',
        '/api/v1/user/token/refresh/',
        '/api/v1/user/users/',
        '/api/v1/interests/',
        '/api/v1/interests/<int:pk>/accept/',
        '/api/v1/interests/<int:pk>/reject/',
        '/api/v1/chat/messages/',
        '/api/v1/chat/messages/<int:user_id>/',
    ]
    return Response(routes)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['is_superuser'] = user.is_superuser
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# User Registration View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

# User List View
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

# Interest List/Create View
class InterestListView(generics.ListCreateAPIView):
    serializer_class = InterestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Interest.objects.filter(sender=user) | Interest.objects.filter(recipient=user)

    def perform_create(self, serializer):
        recipient_email = self.request.data.get('recipient_email')
        recipient = User.objects.get(email=recipient_email)
        serializer.save(sender=self.request.user, recipient=recipient)

# Accept/Reject Interest Views
class AcceptInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        interest = Interest.objects.get(pk=pk, recipient=request.user)
        interest.status = 'accepted'
        interest.save()
        return Response({'status': 'Interest accepted'})

class RejectInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        interest = Interest.objects.get(pk=pk, recipient=request.user)
        interest.status = 'rejected'
        interest.save()
        return Response({'status': 'Interest rejected'})

# Chat Message List/Create View
class ChatMessageListView(generics.ListCreateAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ChatMessage.objects.filter(sender=user) | ChatMessage.objects.filter(recipient=user)

    def perform_create(self, serializer):
        recipient_email = self.request.data.get('recipient_email')
        recipient = User.objects.get(email=recipient_email)
        serializer.save(sender=self.request.user, recipient=recipient)

# Retrieve Chat Messages for Specific User
class ChatWithUserView(generics.ListAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        recipient_id = self.kwargs['recipient_id']
        recipient = User.objects.get(id=recipient_id)
        return ChatMessage.objects.filter(sender=user, recipient=recipient) | ChatMessage.objects.filter(sender=recipient, recipient=user)
