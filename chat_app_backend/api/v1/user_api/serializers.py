from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from user.models import ChatMessage, Profile, Interest

User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'full_name', 'image']
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)  
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'profile')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(username=validated_data['username'], email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()
        return user


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ['id', 'sender', 'recipient', 'status']
class ChatMessageSerializer(serializers.ModelSerializer):
    sender_profile = ProfileSerializer(read_only=True)
    recipient_profile = ProfileSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ('id', 'sender', 'recipient', 'sender_profile', 'recipient_profile', 'content', 'timestamp')

    def create(self, validated_data):
        user = self.context['request'].user
        recipient = validated_data.get('recipient')
        content = validated_data.get('content')

        message = ChatMessage.objects.create(sender=user, recipient=recipient, content=content)
        return message
