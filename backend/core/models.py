from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('role', 'IT Administrator')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('IT Administrator', 'IT Administrator'),
        ('Employee', 'Employee'),
    ]
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    contact_number = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Employee')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    approval_status = models.CharField(max_length=20, default='Approved')

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    objects = UserManager()

    def get_full_name(self):
        parts = [self.first_name]
        if self.middle_name:
            parts.append(self.middle_name[0] + '.')
        parts.append(self.last_name)
        return ' '.join(parts)

    def __str__(self):
        return self.username


class Product(models.Model):
    AGGREGATE_TYPES = [
        ('Sand', 'Sand'),
        ('Gravel', 'Gravel'),
        ('Mixed', 'Mixed'),
    ]
    STATUS_CHOICES = [('Active', 'Active'), ('Inactive', 'Inactive'), ('Archived', 'Archived')]

    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    aggregate_type = models.CharField(max_length=20, choices=AGGREGATE_TYPES)
    volume_multiplier = models.DecimalField(max_digits=5, decimal_places=2, default=1.0)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Active')
    approval_status = models.CharField(max_length=20, default='Approved')
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} - {self.name}"


class Customer(models.Model):
    hauler_name = models.CharField(max_length=100)
    plate_number = models.CharField(max_length=20)
    location = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    length = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    width = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    contact_person = models.CharField(max_length=100, blank=True)
    contact_number = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    approval_status = models.CharField(max_length=20, default='Approved')
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def lxw(self):
        if self.length and self.width:
            return float(self.length) * float(self.width)
        return None

    def __str__(self):
        return f"{self.hauler_name} - {self.plate_number}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Cancelled', 'Cancelled'),
        ('Archived', 'Archived'),
    ]
    invoice_number = models.AutoField(primary_key=True)
    gate_pass = models.CharField(max_length=20)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, related_name='orders')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, related_name='orders')
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # aggregate amount in meters
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    is_onsite = models.BooleanField(default=True)
    is_delivery = models.BooleanField(default=False)
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='orders')
    approval_status = models.CharField(max_length=20, default='Approved')
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def lxw(self):
        if self.customer and self.customer.length and self.customer.width:
            return float(self.customer.length) * float(self.customer.width)
        return 0

    @property
    def total_cubic(self):
        if self.amount is None:
            return 0
        return self.lxw * float(self.amount)

    @property
    def initial_price(self):
        if self.product:
            return self.total_cubic * float(self.product.base_price)
        return 0

    @property
    def vat_amount(self):
        return self.initial_price * 0.12

    @property
    def initial_price_with_vat(self):
        return self.initial_price + (self.initial_price * 0.12)

    @property
    def tax_row(self):
        if self.total_cubic is None:
            return 0
        return self.total_cubic * 30  # 15 tax + 15 ROW

    @property
    def total_price(self):
        if self.initial_price_with_vat is None or self.tax_row is None:
            return 0
        return self.initial_price_with_vat + self.tax_row

    def __str__(self):
        return f"Order #{self.invoice_number}"


class AuditTrail(models.Model):
    action = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.action} by {self.user} at {self.timestamp}"


class SystemUpdate(models.Model):
    update_log = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return self.update_log[:50]
