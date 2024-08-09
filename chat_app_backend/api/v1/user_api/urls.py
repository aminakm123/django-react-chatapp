from django.urls import path

from . import views
from .views import AcceptInterestView, ChatMessageListView, ChatWithUserView, InterestListView, ProfileView, RegisterView, RejectInterestView, UserListView, MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

app_name = 'user_api'

urlpatterns = [
    path('', views.getRoutes),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('users/', UserListView.as_view(), name='user-list'),

    path('profile/', ProfileView.as_view(), name='profile'),  # Add this line
    path('interests/', InterestListView.as_view(), name='interest_list'),
    path('interests/<int:pk>/accept/', AcceptInterestView.as_view(), name='interest_accept'),
    path('interests/<int:pk>/reject/', RejectInterestView.as_view(), name='interest_reject'),
    path('chat/messages/', ChatMessageListView.as_view(), name='chat_message_list'),
    path('chat/messages/<int:recipient_id>/', ChatWithUserView.as_view(), name='chat_with_user'),
]
