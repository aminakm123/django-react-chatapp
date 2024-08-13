from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from user.models import ChatMessage, Interest, Profile, User

class UserAdmin(BaseUserAdmin):
    list_display = ('id', 'email', 'username', 'is_staff', 'is_active')
    ordering = ('id',)  

admin.site.register(User, UserAdmin)
admin.site.register(Profile)
admin.site.register(Interest)
admin.site.register(ChatMessage)