from django.contrib import admin

from user.models import ChatMessage, Interest, Profile, User

# Register your models here.
admin.site.register(User)
admin.site.register(Profile)
admin.site.register(Interest)
admin.site.register(ChatMessage)