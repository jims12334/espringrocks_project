from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User as AuthUser
from .models import User, Product, Customer, Order, AuditTrail, SystemUpdate

# Unregister the default auth User to avoid conflicts
try:
    admin.site.unregister(AuthUser)
except admin.sites.NotRegistered:
    pass

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'get_full_name', 'role', 'email', 'is_active']
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'middle_name', 'last_name', 'email', 'contact_number')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {'classes': ('wide',), 'fields': ('username', 'first_name', 'last_name', 'email', 'role', 'password1', 'password2')}),
    )
    search_fields = ['username', 'first_name', 'last_name']
    ordering = ['username']

admin.site.register(Product)
admin.site.register(Customer)
admin.site.register(Order)
admin.site.register(AuditTrail)
admin.site.register(SystemUpdate)
